const moment = require('moment');
const { RentSchedule, Tenant } = require('./models/index');
const sendEmail = require('./configs/email');

const sendDailyReminders = async () => {
  console.log('🔁 Checking for pending rent reminders...');

  try {
    const pendingSchedules = await RentSchedule.findAll({
        where: {
          status: 'Pending',
          reminderSent: false,
        },
        include: [Tenant],
      });

    for (const schedule of pendingSchedules) {
      const tenant = schedule.Tenant;
      if (!tenant) continue;

      const dueDateFormatted = moment(schedule.dueDate).format('DD MMMM YYYY');
      const dashboardLink = `${process.env.CLIENT_URL}/tenant/dashboard`;
      const subject = `Reminder: Rent Due for ${schedule.month}`;
      const html = `
        <p>Dear ${tenant.name},</p>
        <p>This is a daily reminder that your rent of <strong>₹${schedule.amount}</strong> is pending and due on <strong>${dueDateFormatted}</strong>.</p>
        <p>Please visit your <a href="${dashboardLink}">dashboard</a> to complete the payment.</p>
        <p>Thank you,<br>RentEase Team</p>
      `;

      try {
        await sendEmail(tenant.email, subject, html);
        console.log(`📧 Daily reminder sent to ${tenant.email} for ${schedule.month}`);
      } catch (err) {
        console.error(`❌ Could not send email to ${tenant.email}:`, err.message);
      }
    }

    if (pendingSchedules.length === 0) {
      console.log('✅ No pending rent found today.');
    }

  } catch (err) {
    console.error('❌ Error while sending daily reminders:', err.message);
  }

  console.log('✅ Daily rent reminder check completed.\n');
};

module.exports = sendDailyReminders;
