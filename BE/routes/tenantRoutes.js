const express = require("express");
const router = express.Router();
const { addTenant, getTenants , getTenantById, updateTenant, deleteTenant, verifyTokenAndSetPassword, login } = require("../controllers/tenantController");

router.post("/tenants", addTenant);
router.get("/tenants", getTenants);
router.get("/tenants/:id", getTenantById);
router.put("/tenants/:id", updateTenant);
router.delete("/tenants/:id", deleteTenant);
router.post('/set-password/:token', verifyTokenAndSetPassword);
router.post('/tenants/login', login);

module.exports = router;
