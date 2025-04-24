const express = require("express");
const router = express.Router();
const { getTenantById, verifyTokenAndSetPassword, login, getMyProperty,updateTenantProfile } = require("../controllers/tenantController");
const {tenantAuth} = require("../middleware/authmiddleware")

router.post('/login', login);
router.get("/tenants/my-property",tenantAuth, getMyProperty);
router.get("/tenants/:id", getTenantById);
router.post('/set-password/:token', verifyTokenAndSetPassword);
router.put('/tenants/:id',updateTenantProfile);

module.exports = router;