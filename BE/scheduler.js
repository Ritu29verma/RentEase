// scheduler.js
const cron = require("node-cron");
let reminderJob = null;

const convertToCronTime = (timeString) => {
  const [hours, minutes] = timeString.split(":");
  return `${parseInt(minutes, 10)} ${parseInt(hours, 10)} * * *`;
};

const scheduleReminders = (timeToSend, task) => {
  // Stop the previous job
  if (reminderJob) {
    reminderJob.stop();
    console.log("⛔ Previous reminder job stopped.");
  }

  const cronTime = convertToCronTime(timeToSend);
  console.log(`📅 Rescheduling daily reminder at ${cronTime}`);

  reminderJob = cron.schedule(cronTime, task, { scheduled: true });
};

module.exports = {
  scheduleReminders,
};
