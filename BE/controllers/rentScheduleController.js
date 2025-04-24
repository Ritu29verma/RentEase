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

const getmyLatestrentSchedules = async (req, res) => {
  try {
    const lastSchedule = await RentSchedule.findOne({
      where: {
        tenantId: req.tenantId,
        status: "Pending",
      },
      order: [["dueDate", "DESC"]],
    });

    if (!lastSchedule) {
      return res.json({ message: "No upcoming rent found", data: null });
    }

    res.json({
      data: {
        id: lastSchedule.id,
        amount: lastSchedule.amount,
        dueDate: lastSchedule.dueDate,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ detail: "Server error" });
  }
};


module.exports={getAllRentSchedules,getmyrentSchedules,getmyLatestrentSchedules}