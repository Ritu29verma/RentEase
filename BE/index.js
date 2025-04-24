const express = require('express');
const dotenv = require('dotenv');
const cors = require("cors");
const { connectDB } = require('./configs/db');
const runRentScheduler = require('./rentScheduler');
const tenantRoutes = require("./routes/tenantRoutes");
const propertyRouts = require("./routes/propertyRoutes");
const adminroutes =require("./routes/adminroutes")
const cron = require("node-cron");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', tenantRoutes);
app.use('/api', propertyRouts);
app.use('/api', adminroutes);

const PORT = process.env.PORT || 5000;

(async () => {
  await connectDB();
  await runRentScheduler();

  const scheduleTime = process.env.RENT_SCHEDULER_CRON || '0 0,12 * * *';
  cron.schedule(scheduleTime, runRentScheduler);

  app.listen(PORT, () => {
    console.log(`🚀 Server running on ${PORT}`);
  });
})();
