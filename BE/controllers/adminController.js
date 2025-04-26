const {Tenant,TenantStay} = require("../models/index");
const Admin = require("../models/Admin")
const jwt = require('jsonwebtoken');
const sendEmail = require("../configs/email");
const {Property} = require("../models/index");
const moment = require('moment');
const {RentSchedule} =require("../models/index")
const {GeneralSetting} = require("../models/GeneralSetting")
const {ReminderSetting} = require("../models/ReminderSetting")
const {BillingSetting} = require("../models/BillingSetting")
const { scheduleReminders } = require("../scheduler");
const sendDailyReminders = require('../sendDailyReminders')

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
        amount: property.rent, 
        status: 'Pending',
      });
      console.log(`✅ Initial rent schedule created for ${name} (${dueDate.format('MMMM YYYY')})`);
    }
    await TenantStay.create({
        tenantId: newTenant.id,
        propertyId: propertyId,
        fromDate: new Date(),
        toDate: null, 
      });

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


const updateTenant = async (req, res) => {
    const { id } = req.params;
    const { name, email, mobile, propertyId } = req.body;

    try {
      const tenant = await Tenant.findByPk(id);

      if (!tenant) {
        return res.status(404).json({ message: "Tenant not found" });
      } if (propertyId && tenant.propertyId !== propertyId) {
        // End the previous stay
        const currentStay = await TenantStay.findOne({
          where: {
            tenantId: tenant.id,
            toDate: null,
          },
        });
  
        if (currentStay) {
          currentStay.toDate = new Date();
          await currentStay.save();
          
        }
  
        // Create a new stay entry
        await TenantStay.create({
          tenantId: tenant.id,
          propertyId: propertyId,
          fromDate: new Date(),
          toDate: null,
        });

      }
  
      await tenant.update({
        name,
        email,
        mobile,
        propertyId,
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
  
  const saveGeneralSettings = async (req, res) => {
    try {
      let setting = await GeneralSetting.findOne();
  
      if (setting) {
        await setting.update(req.body);
      } else {  
        setting = await GeneralSetting.create(req.body);
      }
      res.json(setting);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  

  const getGeneralSettings = async (req, res) => {
    try {
      const setting = await GeneralSetting.findOne();
      res.json(setting);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  

  const saveReminderSettings = async (req, res) => {
    try {
      const payload = { id: 1, ...req.body };
      const [setting] = await ReminderSetting.upsert(payload);
  
      // Reschedule task immediately
      if (payload.timeToSend) {
        scheduleReminders(payload.timeToSend, sendDailyReminders);
      }
  
      res.json(setting);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  const getReminderSettings = async (req, res) => {
    try {
      const setting = await ReminderSetting.findByPk(1); 
      res.json(setting);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  
  
  const saveBillingSettings = async (req, res) => {
    try {
      const [setting] = await BillingSetting.upsert(req.body);
      res.json(setting);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  const getBillingSettings = async (req, res) => {
    try {
      const setting = await BillingSetting.findOne();
      res.json(setting);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  const getUpcomingPayments = async (req, res) => {
    try {
      const upcomingPayments = await RentSchedule.findAll({
        where: {
          status: 'Pending'
        },
        include: [
          {
            model: Tenant,
            attributes: ['name'] // only fetch tenant name
          }
        ],
        order: [['dueDate', 'ASC']], // Nearest due date first
        limit: 5,
      });
  
      const formattedPayments = upcomingPayments.map(payment => ({
        tenantName: payment.Tenant.name,
        amount: payment.amount,
        dueDate: payment.dueDate,
      }));
  
      res.json(formattedPayments);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server Error' });
    }
  };
  



module.exports = {
    addTenant,
    getTenants,
    updateTenant,
    deleteTenant,
    getBillingSettings,
    saveBillingSettings,
    getReminderSettings,
    saveReminderSettings,
    getGeneralSettings,
    saveGeneralSettings,
    getUpcomingPayments
}