const express = require("express");
const router = express.Router();
const { initStripe, paymentSuccess, getTenantInvoices, getAllInvoicesWithDetails,getAllInvoicesWithDetailsId, getRecentPayments } = require("../controllers/paymentController");
const {tenantAuth} = require('../middleware/authmiddleware');

router.post('/init-stripe',tenantAuth, initStripe);
router.get('/recent-payments', getRecentPayments);
router.get('/my-invoices',tenantAuth, getTenantInvoices);
router.get("/payment-success/:session_id", paymentSuccess);
router.get('/admin/invoices', getAllInvoicesWithDetails);
router.get('/admin/invoices/:invoiceId', getAllInvoicesWithDetailsId);


module.exports = router;