const Property = require("../models/property");

const getAllProperties = async (req, res) => {
  try {
    const properties = await Property.findAll();
    res.json(properties);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch properties" });
  }
};

const createProperty = async (req, res) => {
  try {
    const { name, rent, frequency } = req.body;
    const property = await Property.create({ name, rent, frequency });
    res.status(201).json(property);
  } catch (error) {
    res.status(400).json({ error: "Failed to create property" });
  }
};

const updateProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, rent, frequency } = req.body;

    const property = await Property.findByPk(id);
    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    await property.update({ name, rent, frequency });
    res.json(property);
  } catch (error) {
    res.status(400).json({ error: "Failed to update property" });
  }
};

const deleteProperty = async (req, res) => {
  try {
    const { id } = req.params;

    const property = await Property.findByPk(id);
    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    await property.destroy();
    res.json({ message: "Property deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete property" });
  }
};

module.exports = {
  getAllProperties,
  createProperty,
  updateProperty,
  deleteProperty,
};
