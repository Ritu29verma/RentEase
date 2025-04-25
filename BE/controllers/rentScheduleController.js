const RentSchedule = require('../models/RentSchedule');
const { Op, fn, col, literal } = require('sequelize');

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

const getMonthlyRentStats = async (req, res) => {
  try {
    const rawStats = await RentSchedule.findAll({
      attributes: [
        [fn('EXTRACT', literal('YEAR FROM "dueDate"')), 'year'],
        [fn('EXTRACT', literal('MONTH FROM "dueDate"')), 'month'],
        'status',
        [fn('SUM', col('amount')), 'total']
      ],
      group: [
        literal('EXTRACT(YEAR FROM "dueDate")'),
        literal('EXTRACT(MONTH FROM "dueDate")'),
        'status'
      ],
      raw: true
    });

    // Convert to format: [{ year, month, collected, pending }]
    const monthlyMap = {};

    for (const row of rawStats) {
      const key = `${row.year}-${row.month.toString().padStart(2, '0')}`;
      if (!monthlyMap[key]) {
        monthlyMap[key] = {
          year: row.year,
          month: row.month.toString().padStart(2, '0'),
          collected: 0,
          pending: 0,
        };
      }

      if (row.status === 'Paid') {
        monthlyMap[key].collected = parseInt(row.total);
      } else {
        monthlyMap[key].pending = parseInt(row.total);
      }
    }

    const result = Object.values(monthlyMap);
    res.json(result);
  } catch (err) {
    console.error('Error fetching monthly stats:', err);
    res.status(500).json({ message: 'Failed to fetch monthly stats' });
  }
};


module.exports={getAllRentSchedules,getmyrentSchedules,getmyLatestrentSchedules, getMonthlyRentStats}