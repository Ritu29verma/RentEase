const Property = require('./property');
const Tenant = require('./tenantModel');
const RentSchedule = require('./RentSchedule')
const Invoice =require("./Invoice")
const TenantStay = require("./TenantStay")

Property.hasMany(Tenant, { foreignKey: 'propertyId', onDelete: 'CASCADE' });
Tenant.belongsTo(Property, { foreignKey: 'propertyId' });

Tenant.hasMany(RentSchedule, { foreignKey: 'tenantId', onDelete: 'CASCADE' });
RentSchedule.belongsTo(Tenant, { foreignKey: 'tenantId' });

RentSchedule.hasOne(Invoice, { foreignKey: 'rentScheduleId', onDelete: 'CASCADE' });
Invoice.belongsTo(RentSchedule, { foreignKey: 'rentScheduleId' });

Tenant.hasMany(Invoice, { foreignKey: 'tenantId', onDelete: 'CASCADE' });
Invoice.belongsTo(Tenant, { foreignKey: 'tenantId' });

Tenant.hasMany(TenantStay, { foreignKey: 'tenantId', onDelete: 'CASCADE' });
TenantStay.belongsTo(Tenant, { foreignKey: 'tenantId' });

Property.hasMany(TenantStay, { foreignKey: 'propertyId', onDelete: 'CASCADE' });
TenantStay.belongsTo(Property, { foreignKey: 'propertyId' });


module.exports = {
    Tenant,
    Property,
    RentSchedule,
    Invoice,
    TenantStay
  };