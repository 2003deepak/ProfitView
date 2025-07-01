const portfolioPerformanceModel = require('../../models/PortfolioPerformance');
const redis = require('../../config/redis'); 
const moment = require('moment-timezone'); // For handling IST timezone


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

const getPortfolioPerformance = async (req, res) => {
  try {
    const userId = req.user._id; 
    const cacheKey = `portfolioPerformance:${userId}`;

    // Check Redis cache
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      console.log(`[${new Date().toISOString()}] Cache hit for user ${userId}`);
      return res.status(200).json({ status: 'success', message: "Portfolio Performance fecthed succcessfully" , data :JSON.parse(cachedData) });
    }

    // Cache miss, fetch from MongoDB
    // console.log(`[${new Date().toISOString()}] Cache miss for user ${userId}, querying DB`);
    const performanceData = await portfolioPerformanceModel.findOne({ userId });

    if (!performanceData) {
      return res.status(404).json({ status: 'fail', message: 'No portfolio performance data found' });
    }

    // Format the response
    const formattedData = {
      userId: performanceData.userId,
      performance: performanceData.performance.map(entry => ({
        date: entry.date,
        investedAmount: entry.investedAmount,
        actualAmount: entry.actualAmount
      })),
      updatedAt: performanceData.updatedAt
    };

    // Cache the formatted data in Redis with TTL
    const ttl = calculateTTL();
    await redis.set(cacheKey, JSON.stringify(formattedData), 'EX', ttl);
    console.log(`[${new Date().toISOString()}] Cached data for user ${userId} with TTL ${ttl}s`);

    res.status(200).json({ status: 'success', data: formattedData });
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error fetching portfolio performance:`, error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

module.exports = getPortfolioPerformance;