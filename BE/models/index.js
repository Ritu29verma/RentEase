const Property = require('./property');
const Tenant = require('./tenantModel');
const RentSchedule = require('./RentSchedule')

Property.hasMany(Tenant, { foreignKey: 'propertyId' });
Tenant.belongsTo(Property, { foreignKey: 'propertyId' });

Tenant.hasMany(RentSchedule, { foreignKey: 'tenantId' });
RentSchedule.belongsTo(Tenant, { foreignKey: 'tenantId' });