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
const {ReminderSetting} = require("./models/ReminderSetting")
const { scheduleReminders } = require("./scheduler");
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

const convertToCronTime = (timeString) => {
  const [hours, minutes] = timeString.split(":");
  return `${parseInt(minutes, 10)} ${parseInt(hours, 10)} * * *`;
};

const PORT = process.env.PORT || 5000;

(async () => {
  await connectDB();

  let reminderSetting = await ReminderSetting.findOne();
  if (!reminderSetting) {
    reminderSetting = await ReminderSetting.create();
  }
  const cronTime = convertToCronTime(reminderSetting.timeToSend);

  await runRentScheduler();
  await sendDailyReminders();

  cron.schedule(cronTime, runRentScheduler);


  scheduleReminders(reminderSetting.timeToSend, sendDailyReminders);

  app.listen(PORT, () => {
    console.log(`🚀 Server running on ${PORT}`);
  });
})();
