const {Tenant} = require("../models/index");
const jwt = require('jsonwebtoken');
const sendEmail = require("../configs/email");
const {Property} = require("../models/index");
const moment = require('moment');
const {RentSchedule} =require("../models/index")

const addTenant = async (req, res) => {
  try {
    const { name, email, mobile, propertyId } = req.body;
    if (!name || !email || !mobile || !propertyId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingTenant = await Tenant.findOne({ where: { email } });
    if (existingTenant) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const newTenant = await Tenant.create({ name, email, mobile, propertyId });

    res.status(201).json(newTenant);

    const token = jwt.sign({ tenantId: newTenant.id }, process.env.JWT_SECRET);

    const setupLink = `${process.env.CLIENT_URL}/tenant/set-password/${token}`;
    const html = `
      <h2>Welcome to RentEase, ${name}!</h2>
      <p>We're excited to have you on board.</p>
      <p>Please click the link below to set your password and complete your onboarding:</p>
      <a href="${setupLink}" target="_blank">${setupLink}</a>
      <br/>
      <p>Best regards,</p>
      <p>RentEase Team</p>
    `;

    sendEmail(email, "Welcome to RentEase – Set Your Password", html)
      .then(() => console.log(`✅ Email sent to ${email}`))
      .catch((err) => console.error("❌ Error sending email:", err));

    const property = await Property.findByPk(propertyId);
    if (property) {
      const dueDate = moment(newTenant.createdAt);
      await RentSchedule.create({
        tenantId: newTenant.id,
        month: dueDate.format('MMMM YYYY'),
        dueDate: dueDate.toDate(),
        status: 'Pending',
      });
      console.log(`✅ Initial rent schedule created for ${name} (${dueDate.format('MMMM YYYY')})`);
    }

  } catch (error) {
    console.error("Error adding tenant:", error);
    if (!res.headersSent) {
      res.status(500).json({ message: "Server error" });
    }
  }
};

const getTenants = async (req, res) => {
  try {
    const tenants = await Tenant.findAll({
      include: { model: Property, attributes: ['id', 'name', 'rent', 'frequency'] },
    });
    res.status(200).json(tenants);
  } catch (error) {
    console.error("Error fetching tenants:", error);
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
  
  
  const updateTenant = async (req, res) => {
      const { id } = req.params;
      const { name, email, mobile, propertyId } = req.body;

      try {
        const tenant = await Tenant.findByPk(id);

        if (!tenant) {
          return res.status(404).json({ message: "Tenant not found" });
        }

        await tenant.update({
          name,
          email,
          mobile,
          propertyId
        });

        res.json({ message: "Tenant updated successfully", tenant });
      } catch (error) {
        console.error("Error updating tenant:", error);
        res.status(500).json({ message: "Server error" });
      }
  };

  
  const deleteTenant = async (req, res) => {
    try {
      const tenant = await Tenant.findByPk(req.params.id);
      if (!tenant) {
        return res.status(404).json({ message: "Tenant not found" });
      }
  
      await tenant.destroy();
      res.status(200).json({ message: "Tenant deleted successfully" });
    } catch (error) {
      console.error("Error deleting tenant:", error);
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
      console.log("Login payload:", email, password);
  
      const user = await Tenant.findOne({ where: { email } });
      if (!user) {
        return res.status(401).json({ detail: "Invalid credentials" });
      }
  
      if (user.password !== password) {
        return res.status(401).json({ detail: "Invalid credentials" });
      }
  
      const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, {
      });
  
      res.json({ access_token: token, role: user.role });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ detail: "Internal server error" });
    }
  };

  module.exports = {
    addTenant,
    getTenants,
    getTenantById,
    updateTenant,
    deleteTenant,
    verifyTokenAndSetPassword,
    login,
  };
