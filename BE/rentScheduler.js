const cron = require('node-cron');
const moment = require('moment');
const dotenv = require('dotenv');
dotenv.config(); 

const { Tenant, Property, RentSchedule } = require('./models/index');

const runRentScheduler = async () => {
  console.log('🏃 Rent scheduler started...');

  const tenants = await Tenant.findAll({ include: [Property] });

  let schedulesCreated = 0;

  for (const tenant of tenants) {
    const property = tenant.Property;
    if (!property) continue;

    const frequency = property.frequency;
    const createdAt = moment(tenant.createdAt);

    const lastSchedule = await RentSchedule.findOne({
      where: { tenantId: tenant.id },
      order: [['dueDate', 'DESC']],
    });

    let nextDueDate = lastSchedule
      ? moment(lastSchedule.dueDate).add(frequency === 'Monthly' ? 1 : 3, 'months')
      : createdAt;

    const now = moment();

    if (now.isSameOrAfter(nextDueDate, 'day')) {
      await RentSchedule.create({
        tenantId: tenant.id,
        month: nextDueDate.format('MMMM YYYY'),
        dueDate: nextDueDate.toDate(),
        amount: property.rent, 
        status: 'Pending',
      });

      schedulesCreated++;
      console.log(`✅ Rent schedule created for ${tenant.name} (${nextDueDate.format('MMMM YYYY')})`);
    }
  }

  if (schedulesCreated === 0) {
    console.log('ℹ️ No rent schedules needed to be created at this time.');
  }

  console.log('🏁 Rent scheduler completed.\n');
};


module.exports = runRentScheduler;
