const {Tenant} = require("../models/index");
const Admin = require("../models/Admin")
const jwt = require('jsonwebtoken');
const sendEmail = require("../configs/email");
const {Property} = require("../models/index");
const moment = require('moment');
const {RentSchedule, Invoice} =require("../models/index")

const getMyDetails = async (req, res) => {
  try {
    const tenant = await Tenant.findByPk(req.tenantId);
    if (!tenant) {
      return res.status(404).json({ message: "Tenant not found" });
    }
    res.status(200).json(tenant);
  } catch (error) {
    console.error("Error fetching tenant:", error);
    res.status(500).json({ message: "Server error" });
  }
};


const getTenantById = async (req, res) => {
    try {
      const tenant = await Tenant.findByPk(req.params.id);
      if (!tenant) {
        return res.status(404).json({ message: "Tenant not found" });
      }
      res.status(200).json(tenant);
    } catch (error) {
      console.error("Error fetching tenant:", error);
      res.status(500).json({ message: "Server error" });
    }
  };

  const verifyTokenAndSetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
  
    if (!password) {
      return res.status(400).json({ message: 'Password is required' });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const tenantId = decoded.tenantId;
  
      await Tenant.update(
        { password: password },
        { where: { id: tenantId } }
      );
  
      res.status(200).json({ message: 'Password set successfully' });
    } catch (error) {
      console.error('Token error:', error);
      res.status(400).json({ message: 'Invalid or expired token' });
    }
  };

  const login = async (req, res) => {
    try {
      const { email, password } = req.body;
      
      const admin = await Admin.findOne({ where: { email } });
      if (admin && admin.password === password) {
        const token = jwt.sign({ userId: admin.id, role: 'admin' }, process.env.JWT_SECRET);
        return res.json({ access_token: token, role: 'admin' });
      }
  
      const tenant = await Tenant.findOne({ where: { email } });
      if (tenant && tenant.password === password) {
        const token = jwt.sign({ userId: tenant.id, role: 'tenant' }, process.env.JWT_SECRET);
        return res.json({ access_token: token, role: 'tenant' });
      }
  
      res.status(401).json({ detail: "Invalid credentials" });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ detail: "Internal server error" });
    }
  };

  const getMyProperty = async (req, res) => {
    try {
      const tenantId = req.tenantId;
  
      const tenant = await Tenant.findOne({
        where: { id: tenantId },
        include: [{ model: Property }]
      });
  
      if (!tenant || !tenant.Property) {
        return res.status(404).json({ detail: "Property not found" });
      }
  
      res.json({
        propertyName: tenant.Property.name,
        rent: tenant.Property.rent,
        frequency: tenant.Property.frequency,
        stayDuration: {
          start: tenant.createdAt,
          end: null
        }
      });
    } catch (err) {
      console.error("Get property error:", err);
      res.status(500).json({ detail: "Internal server error" });
    }
  };
  
  const updateTenantProfile = async (req, res) => {
    const { name, email, mobile } = req.body;
    const tenantId = req.params.id;
  
    try {
      const tenant = await Tenant.findByPk(tenantId);
      if (!tenant) return res.status(404).json({ message: 'Tenant not found' });
  
      tenant.name = name || tenant.name;
      tenant.email = email || tenant.email;
      tenant.mobile = mobile || tenant.mobile;
  
      await tenant.save();
  
      res.json({ message: 'Profile updated successfully', tenant });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to update profile' });
    }
  };


  const dashboardStats = async (req, res) => {
    try {
      const tenantId = req.tenantId;
  
      const tenant = await Tenant.findByPk(tenantId, {
        include: {
          model: Property,
          attributes: ['name', 'frequency']
        }
      });
  
      if (!tenant || !tenant.Property) {
        return res.status(404).json({ message: 'Tenant or property not found' });
      }
  
      const { name: propertyName, frequency } = tenant.Property;
  
      // 2. Get latest RentSchedule for tenant
      const lastSchedule = await RentSchedule.findOne({
        where: { tenantId },
        order: [['dueDate', 'DESC']],
      });
  
      let nextDueDate = null;
  
      if (lastSchedule) {
        const lastDate = new Date(lastSchedule.dueDate);
      
        if (frequency === 'Weekly') {
          lastDate.setDate(lastDate.getDate() + 7);
        } else if (frequency === 'Monthly') {
          lastDate.setMonth(lastDate.getMonth() + 1);
        } else if (frequency === 'Quarterly') {
          lastDate.setMonth(lastDate.getMonth() + 3);
        }
      
        nextDueDate = lastDate.toISOString().split('T')[0];
      }
  
      // 3. Total Paid amount
      const totalPaidData = await Invoice.findAll({
        where: {
          tenantId,
          status: 'Paid',
        },
        attributes: ['amount'],
      });
  
      const totalPaid = totalPaidData.reduce((sum, inv) => sum + inv.amount, 0);
  
      res.json({
        currentProperty: propertyName,
        nextDueDate,
        totalPaid
      });
  
    } catch (err) {
      console.error("Error in tenant dashboard:", err);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  const getTotalTenants = async (req, res) => {
    try {
      const totalTenants = await Tenant.count();
      res.json({ totalTenants });
    } catch (err) {
      console.error('Error fetching total tenants:', err);
      res.status(500).json({ message: 'Server error' });
    }
  };

  module.exports = {
    getMyDetails,
    getTenantById,
    verifyTokenAndSetPassword,
    login,
    getMyProperty,
    updateTenantProfile,
    dashboardStats,
    getTotalTenants
  };


