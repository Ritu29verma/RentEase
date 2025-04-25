const Property = require('./property');
const Tenant = require('./tenantModel');
const RentSchedule = require('./RentSchedule')
const Invoice =require("./Invoice")

Property.hasMany(Tenant, { foreignKey: 'propertyId' });
Tenant.belongsTo(Property, { foreignKey: 'propertyId' });

Tenant.hasMany(RentSchedule, { foreignKey: 'tenantId' });
RentSchedule.belongsTo(Tenant, { foreignKey: 'tenantId' });

Invoice.belongsTo(RentSchedule, { foreignKey: 'rentScheduleId' });
RentSchedule.hasOne(Invoice, { foreignKey: 'rentScheduleId' });

// Invoice belongs to Tenant
Invoice.belongsTo(Tenant, { foreignKey: 'tenantId' });
Tenant.hasMany(Invoice, { foreignKey: 'tenantId' });

module.exports = {
    Tenant,
    Property,
    RentSchedule,
    Invoice
  };