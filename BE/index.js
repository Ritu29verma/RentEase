const express = require('express');
const dotenv = require('dotenv');
const db = require('./configs/db');
const tenantRoutes = require("./routes/tenantRoutes");
const cors = require("cors");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', tenantRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
