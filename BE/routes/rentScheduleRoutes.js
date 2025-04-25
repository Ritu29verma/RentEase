const express = require('express');
const router = express.Router();
const {getAllRentSchedules, getmyrentSchedules, getmyLatestrentSchedules, getMonthlyRentStats} =require("../controllers/rentScheduleController")
const {tenantAuth} =require("../middleware/authmiddleware");

router.get('/rent-schedules', getAllRentSchedules);
router.get('/my-rent-schedules', tenantAuth, getmyrentSchedules);
router.get('/my-latest-rent-schedules', tenantAuth, getmyLatestrentSchedules);
router.get('/monthly-rent-stats', getMonthlyRentStats);

module.exports = router;