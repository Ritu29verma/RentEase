const cron = require('node-cron');
const moment = require('moment');
const dotenv = require('dotenv');
dotenv.config();

const { Tenant, Property, RentSchedule } = require('./models/index');
const {ReminderSetting} = require("./models/ReminderSetting")

const sendEmail = require('./configs/email');

const runRentScheduler = async () => {
    console.log('🏃 Rent scheduler started...');
    await RentSchedule.update(
        { reminderSent: false },
        { where: { status: 'Pending' } }
      );
  
    const tenants = await Tenant.findAll({ include: [Property] });
    let reminderSetting = await ReminderSetting.findOne();

    if (!reminderSetting) {
    reminderSetting = await ReminderSetting.create();
    }
    const daysBeforeDue = reminderSetting.daysBeforeDue;
  
    let schedulesCreated = 0;
  
    for (const tenant of tenants) {
      const property = tenant.Property;
      if (!property) continue;
  
      const frequency = property.frequency;
      const lastSchedule = await RentSchedule.findOne({
        where: { tenantId: tenant.id },
        order: [['dueDate', 'DESC']],
      });
  
      if (!lastSchedule) continue;
  

      const nextDueDate = moment(lastSchedule.dueDate).add(frequency === 'Monthly' ? 1 : 3, 'months');
      const creationThresholdDate = moment(nextDueDate).subtract(daysBeforeDue, 'days');
      const today = moment();
  
   
      if (today.isSameOrAfter(creationThresholdDate, 'day')) {
   
        const existing = await RentSchedule.findOne({
          where: { tenantId: tenant.id, dueDate: nextDueDate.toDate() },
        });
  
        if (!existing) {
          const newSchedule = await RentSchedule.create({
            tenantId: tenant.id,
            month: nextDueDate.format('MMMM YYYY'),
            dueDate: nextDueDate.toDate(),
            amount: property.rent,
            status: 'Pending',
            reminderSent: true,
          });
  
          schedulesCreated++;
          console.log(`✅ Rent schedule created for ${tenant.name} (${nextDueDate.format('MMMM YYYY')})`);
  
          // Send email reminder
          const dashboardLink = `${process.env.CLIENT_URL}/tenant/dashboard`;
          const subject = `Upcoming Rent Due: ${newSchedule.month}`;
          const html = `
            <p>Dear ${tenant.name},</p>
            <p>This is a reminder that your next rent is due on <strong>${nextDueDate.format('DD MMMM YYYY')}</strong>.</p>
            <p>Please visit your <a href="${dashboardLink}">dashboard</a> to proceed with the payment or view details.</p>
            <p>Thank you,<br>RentEase Team</p>
          `;
  
          try {
            await sendEmail(tenant.email, subject, html);
            console.log(`📧 Reminder email sent to ${tenant.email}`);
          } catch (emailErr) {
            console.error(`❌ Failed to send email to ${tenant.email}:`, emailErr.message);
          }
        }
      }
    }
  
    if (schedulesCreated === 0) {
      console.log('ℹ️ No rent schedules needed to be created at this time.');
    }
  
    console.log('🏁 Rent scheduler completed.\n');
  };

module.exports = runRentScheduler;
