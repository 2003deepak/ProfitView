const { Queue } = require("bullmq");
const redisClient = require("./redis");

const orderQueue = new Queue("orderQueue", {
    connection: redisClient
});

module.exports = orderQueue;
