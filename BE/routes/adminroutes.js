const express = require("express");
const router = express.Router();
const { addTenant, getTenants,updateTenant, deleteTenant,saveGeneralSettings,saveReminderSettings,saveBillingSettings,getGeneralSettings,getReminderSettings,getBillingSettings } = require("../controllers/adminController")

router.post("/general", saveGeneralSettings);
router.get("/general", getGeneralSettings);


router.post("/reminder", saveReminderSettings);
router.get("/reminder", getReminderSettings);

router.post("/billing", saveBillingSettings);
router.get("/billing", getBillingSettings);

router.post("/tenants", addTenant);
router.get("/tenants", getTenants);
router.put("/tenants/:id", updateTenant);
router.delete("/tenants/:id", deleteTenant);

module.exports = router;