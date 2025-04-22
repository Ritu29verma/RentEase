const express = require("express");
const router = express.Router();
const {
  getAllProperties,
  createProperty,
  updateProperty,
  deleteProperty,
} = require("../controllers/propertyController");

router.get("/property", getAllProperties);
router.post("/property", createProperty);
router.put("/property/:id", updateProperty);
router.delete("/property/:id", deleteProperty);

module.exports = router;
