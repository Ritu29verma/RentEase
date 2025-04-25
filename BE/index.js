const express = require('express');
const dotenv = require('dotenv');
const cors = require("cors");
const { connectDB } = require('./configs/db');
const runRentScheduler = require('./rentScheduler');
const sendDailyReminders =require('./sendDailyReminders')
const tenantRoutes = require("./routes/tenantRoutes");
const propertyRouts = require("./routes/propertyRoutes");
const adminroutes =require("./routes/adminroutes");
const rentScheduleRoutes = require("./routes/rentScheduleRoutes")
const paymentRoutes =require("./routes/paymentRoutes");
const cron = require("node-cron");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', tenantRoutes);
app.use('/api', propertyRouts);
app.use('/api', adminroutes);
app.use('/api', rentScheduleRoutes);
app.use('/api/payment', paymentRoutes);

const PORT = process.env.PORT || 5000;

(async () => {
  await connectDB();
  await runRentScheduler();
  await sendDailyReminders();

  const rentSchedulerCron = process.env.RENT_SCHEDULER_CRON;
  cron.schedule(rentSchedulerCron, runRentScheduler);


  const dailyReminderCron = process.env.DAILY_REMINDER_CRON;
  cron.schedule(dailyReminderCron, sendDailyReminders);

  app.listen(PORT, () => {
    console.log(`🚀 Server running on ${PORT}`);
  });
})();
