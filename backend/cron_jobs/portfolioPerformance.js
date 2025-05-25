require('dotenv').config({ path: '../.env' });
const cron = require('node-cron');
const redis = require("../config/redis");
const mongoose = require('mongoose');
const db = require("../config/mongoose-connection");
const User = require("../models/user");
const Holding = require("../models/holding");
const PortfolioPerformanceModel = require("../models/PortfolioPerformance");
const moment = require('moment-timezone'); // For handling IST timezone

// Check if in simulation mode
const SIMULATION_MODE = process.env.SIMULATION_MODE === 'true';

// Connection state tracking
let isDBReady = false;
db.on('connected', () => {
  isDBReady = true;
  console.log('MongoDB connection ready');
});

db.on('error', (err) => {
  console.error('MongoDB connection error:', err);
  isDBReady = false;
});

// Calculate TTL until next 3:35 PM IST
const calculateTTL = () => {
  const now = moment.tz('Asia/Kolkata');
  const nextUpdate = moment.tz('Asia/Kolkata').set({ hour: 15, minute: 35, second: 0, millisecond: 0 });
  
  // If current time is past 3:35 PM IST, set to next day's 3:35 PM
  if (now.isAfter(nextUpdate)) {
    nextUpdate.add(1, 'day');
  }
  
  // Return TTL in seconds
  return Math.floor((nextUpdate - now) / 1000);
};

// Countdown timer for simulation mode
let runCount = 0;
const countdown = () => {
  runCount++;
  const nextRun = 30 - (runCount % 30);
  console.log(`[${new Date().toISOString()}] Next run in ${nextRun}s...`);
};

async function getAllUsersWithHoldings() {
  if (!isDBReady) throw new Error('Database connection not ready');
  return Holding.find({}).populate('user').lean();
}

async function portfolioPerformance() {
  try {
    const startTime = new Date();
    console.log(`\n[${startTime.toISOString()}] Starting portfolio snapshot...`);

    const holdingsWithUsers = await getAllUsersWithHoldings();

    for (const holding of holdingsWithUsers) {
      if (!holding.user) {
        console.log(`[${new Date().toISOString()}] No user found for holding ${holding._id}`);
        continue;
      }

      if (!holding.holdings?.length) {
        console.log(`[${new Date().toISOString()}] No holdings for user ${holding.user._id}`);
        continue;
      }

      let investedAmount = 0;
      let actualAmount = 0;

      // Process all stocks in parallel
      await Promise.all(holding.holdings.map(async (stock) => {
        try {
          const priceData = await redis.get(`livePrice:${stock.stock_name}`);
          if (!priceData) {
            console.warn(`[${new Date().toISOString()}] No price data for ${stock.stock_name}`);
            return;
          }

          const price = JSON.parse(priceData).price || 0;
          const stockValue = price * stock.quantity;

          investedAmount += stock.average_price * stock.quantity;
          actualAmount += stockValue;
        } catch (error) {
          console.error(`[${new Date().toISOString()}] Error fetching price for ${stock.stock_name}:`, error.message);
        }
      }));

      const performanceEntry = {
        date: startTime,
        investedAmount,
        actualAmount
      };

      // Try to update if an entry for this exact timestamp exists
      const result = await PortfolioPerformanceModel.updateOne(
        {
          userId: holding.user._id,
          'performance.date': startTime
        },
        {
          $set: {
            'performance.$.investedAmount': investedAmount,
            'performance.$.actualAmount': actualAmount,
            updatedAt: new Date()
          }
        }
      );

      let formattedData = null;
      if (result.modifiedCount === 0) {
        // If no existing entry, push a new one
        await PortfolioPerformanceModel.updateOne(
          { userId: holding.user._id },
          {
            $push: { performance: performanceEntry },
            $set: { updatedAt: new Date() }
          },
          { upsert: true }
        );

        // Fetch the updated document to cache
        const updatedData = await PortfolioPerformanceModel.findOne({ userId: holding.user._id }).lean();
        formattedData = {
          userId: updatedData.userId,
          performance: updatedData.performance.map(entry => ({
            date: entry.date,
            investedAmount: entry.investedAmount,
            actualAmount: entry.actualAmount
          })),
          updatedAt: updatedData.updatedAt
        };
      } else {
        // Format the data for caching
        formattedData = {
          userId: holding.user._id,
          performance: [{
            date: startTime,
            investedAmount,
            actualAmount
          }],
          updatedAt: new Date()
        };
      }

      // Cache the formatted data in Redis
      const cacheKey = `portfolioPerformance:${holding.user._id}`;
      const ttl = calculateTTL();
      await redis.set(cacheKey, JSON.stringify(formattedData), 'EX', ttl);
      console.log(`[${new Date().toISOString()}] Cached data for user ${holding.user._id} with TTL ${ttl}s`);

      const diff = actualAmount - investedAmount;
      const percentChange = investedAmount ? (diff / investedAmount * 100).toFixed(2) : "0.00";

      console.log(`[${new Date().toISOString()}] User ${holding.user._id} | ` +
        `Invested: ₹${investedAmount.toFixed(2)} | ` +
        `Current: ₹${actualAmount.toFixed(2)} | Change: ${percentChange}%`);
    }

    const duration = (new Date() - startTime) / 1000;
    console.log(`[${new Date().toISOString()}] Job completed in ${duration.toFixed(2)}s`);
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error:`, error.message);
    if (error.stack) console.error(error.stack);
  }
}

function startScheduler() {
  if (SIMULATION_MODE) {
    cron.schedule('*/30 * * * * *', () => {
      console.clear();
      console.log(`[${new Date().toISOString()}] SIMULATION MODE ACTIVE`);
      countdown();
      portfolioPerformance();
    });
    console.log('Scheduler started in simulation mode (30s interval)');
  } else {
    cron.schedule('30 15 * * *', () => {
      console.log(`[${new Date().toISOString()}] Running daily portfolio update`);
      portfolioPerformance();
    }, {
      timezone: "Asia/Kolkata"
    });
    console.log('Scheduler started in production mode (3:30 PM daily)');
  }
}

// Wait for DB connection before starting
const dbCheckInterval = setInterval(() => {
  if (isDBReady) {
    clearInterval(dbCheckInterval);
    startScheduler();
  }
}, 1000);

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down scheduler...');
  mongoose.disconnect().then(() => {
    console.log('MongoDB connection closed');
    process.exit(0);
  });
});