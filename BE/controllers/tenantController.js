const {Tenant} = require("../models/index");
const Admin = require("../models/Admin")
const jwt = require('jsonwebtoken');
const sendEmail = require("../configs/email");
const {Property} = require("../models/index");
const moment = require('moment');
const {RentSchedule} =require("../models/index")


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
  

  module.exports = {
    getTenantById,
    verifyTokenAndSetPassword,
    login,
    getMyProperty
  };
