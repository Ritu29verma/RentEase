const express = require("express");
const router = express.Router();
const { addTenant, getTenants , getTenantById, updateTenant, deleteTenant, verifyTokenAndSetPassword } = require("../controllers/tenantController");

router.post("/tenants", addTenant);
router.get("/tenants", getTenants);
router.get("/tenants/:id", getTenantById);
router.put("/tenants/:id", updateTenant);
router.delete("/tenants/:id", deleteTenant);
router.post('/set-password/:token', verifyTokenAndSetPassword);

module.exports = router;
