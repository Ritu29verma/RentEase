const express = require('express');
const router = express.Router();
const {getAllRentSchedules, getmyrentSchedules} =require("../controllers/rentScheduleController")
const {tenantAuth} =require("../middleware/authmiddleware");

router.get('/rent-schedules', getAllRentSchedules);
router.get('/my-rent-schedules', tenantAuth, getmyrentSchedules);


module.exports = router;