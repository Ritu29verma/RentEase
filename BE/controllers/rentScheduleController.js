const RentSchedule = require('../models/RentSchedule');

const getAllRentSchedules = async (req, res) => {
  try {
    const schedules = await RentSchedule.findAll();
    res.json(schedules);
  } catch (error) {
    console.error("Error fetching rent schedules:", error);
    res.status(500).json({ message: "Failed to fetch rent schedules" });
  }
};

const getmyrentSchedules= async (req, res) => {
  try {
    const schedules = await RentSchedule.findAll({
      where: { tenantId: req.tenantId },
      order: [['dueDate', 'ASC']],
    });

    res.json(schedules);
  } catch (err) {
    console.error("Error fetching rent schedules:", err);
    res.status(500).json({ detail: "Server error fetching rent schedules" });
  }
};

module.exports={getAllRentSchedules,getmyrentSchedules}