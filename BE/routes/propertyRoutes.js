const express = require("express");
const router = express.Router();
const {
  getAllProperties,
  createProperty,
  updateProperty,
  deleteProperty,
  getTotalProperties
} = require("../controllers/propertyController");

router.get("/property", getAllProperties);
router.post("/property", createProperty);
router.get("/property/total", getTotalProperties);
router.put("/property/:id", updateProperty);
router.delete("/property/:id", deleteProperty);

module.exports = router;
