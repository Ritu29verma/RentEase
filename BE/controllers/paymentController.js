const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const {Invoice, Tenant, Property, RentSchedule} = require("../models/index")
const {BillingSetting} = require("../models/BillingSetting")
const { addMonths, format, subDays } = require("date-fns");

const initStripe = async (req, res) => {
    const { rentScheduleId, amount } = req.body;
    const tenantId = req.tenantId;
  
    try {
      const tenant = await Tenant.findByPk(tenantId, {
        include: {
          model: Property,
          attributes: ['name', 'frequency'],
        },
      });
  
      if (!tenant || !tenant.Property) {
        return res.status(404).json({ message: "Tenant or Property not found" });
      }
  
      const rentSchedule = await RentSchedule.findByPk(rentScheduleId);
      if (!rentSchedule) {
        return res.status(404).json({ message: "Rent schedule not found" });
      }
  
      const tenantName = tenant.name;
      const propertyName = tenant.Property.name;
  
      // Create Stripe session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
          price_data: {
            currency: 'inr',
            product_data: {
              name: `Rent for ${tenantName}`,
              description: `Rent payment for ${tenantName} (${propertyName})`,
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        }],
        mode: 'payment',
        success_url: `${process.env.CLIENT_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.CLIENT_URL}/payment/cancel`,
      });
  
      // Get or create BillingSetting
      let billingSetting = await BillingSetting.findOne();
      if (!billingSetting) {
        billingSetting = await BillingSetting.create(); 
      }
  
      // Calculate fromDate and toDate based on frequency
      const fromDate = new Date(rentSchedule.dueDate);
      const toDate = subDays(addMonths(fromDate, tenant.Property.frequency === 'Monthly' ? 1 : 3), 1);
  
      // Check if an invoice already exists
      let invoice = await Invoice.findOne({ where: { tenantId, rentScheduleId } });
  
      if (invoice) {
        invoice.amount = amount;
        invoice.status = 'Pending';
        invoice.transactionId = session.id;
        invoice.fromDate = format(fromDate, 'yyyy-MM-dd');
        invoice.toDate = format(toDate, 'yyyy-MM-dd');
      } else {
        invoice = await Invoice.create({
          tenantId,
          rentScheduleId,
          amount,
          status: 'Pending',
          transactionId: session.id,
          fromDate: format(fromDate, 'yyyy-MM-dd'),
          toDate: format(toDate, 'yyyy-MM-dd'),
        });
  
        invoice.invoiceNo = `${billingSetting.invoicePrefix}${String(invoice.id).padStart(4, '0')}`;
      }
  
      await invoice.save();
  
      res.json({ url: session.url });
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Payment initiation failed' });
    }
  };
  

  const paymentSuccess = async (req, res) => {
    const { session_id } = req.params;
  
    try {

      const invoice = await Invoice.findOne({ where: { transactionId: session_id } });
  
      if (!invoice) {
        return res.status(404).json({ message: "Invoice not found for this session ID" });
      }
  
      // Update invoice status to Paid
      invoice.status = "Paid";
      await invoice.save();
  
      // Update corresponding rent schedule status to Paid
      const rentSchedule = await RentSchedule.findByPk(invoice.rentScheduleId);
      if (rentSchedule) {
        rentSchedule.status = "Paid";
        await rentSchedule.save();
      }
  
      res.status(200).json({ message: "Payment recorded successfully" });
    } catch (error) {
      console.error("Error in payment success handler:", error);
      res.status(500).json({ message: "Server error while updating payment status" });
    }
  };


  const getTenantInvoices = async (req, res) => {
    try {
      const tenantId = req.tenantId;
  
      const invoices = await Invoice.findAll({
        where: { tenantId },
        include: [{ model: RentSchedule, attributes: ['dueDate'] }],
        order: [['createdAt', 'DESC']]
      });
  
      const formatted = invoices.map(invoice => ({
        id: invoice.invoiceNo,
        date: new Date(invoice.updatedAt).toDateString(),
        amount: `₹${invoice.amount.toLocaleString('en-IN')}`,
        status: invoice.status
      }));
  
      res.json({ data: formatted });
  
    } catch (error) {
      console.error("Error fetching tenant invoices:", error);
      res.status(500).json({ message: "Failed to fetch invoices" });
    }
  };

  const getAllInvoicesWithDetails = async (req, res) => {
    try {
      const invoices = await Invoice.findAll({
        include: [
          {
            model: Tenant,
            attributes: ['name'],
            include: {
              model: Property,
              attributes: ['name'],
              required: false
            }
          },
          {
            model: RentSchedule,
            attributes: ['dueDate'],
            required: false
          }
        ],
        order: [['createdAt', 'DESC']]
      });
  
      const formatted = invoices.map(inv => ({
        invoiceNo: inv.invoiceNo,
        transactionId: inv.transactionId,
        tenantName: inv.Tenant?.name || 'N/A',
        propertyName: inv.Tenant?.Property?.name || 'N/A',
        paymentDate: new Date(inv.updatedAt).toLocaleDateString(),
        amount: `₹${inv.amount.toLocaleString('en-IN')}`,
        status: inv.status
      }));
  
      res.json({ data: formatted });
    } catch (error) {
      console.error("❌ Error fetching invoices:", error);
      res.status(500).json({ message: "Failed to fetch invoices" });
    }
  };  
  
  const getAllInvoicesWithDetailsId = async (req, res) => {
    const { invoiceId } = req.params;
  
    try {
      const invoice = await Invoice.findOne({
        where: { invoiceNo: invoiceId },
        include: [
          {
            model: Tenant,
            include: [Property],
          },
          {
            model: RentSchedule, // One-to-one relation
            attributes: ['dueDate'],
          },
        ],
      });
  
      if (!invoice) {
        return res.status(404).json({ error: "Invoice not found" });
      }
  
      res.json({
        invoiceNumber: invoice.invoiceNo,
        tenantName: invoice.Tenant?.name,
        property: {
          name: invoice.Tenant?.Property?.name || "N/A",
          rent: invoice.Tenant?.Property?.rent || 0,
          frequency: invoice.Tenant?.Property?.frequency || "Monthly",
        },
        duration: {
          from: invoice.fromDate,
          to: invoice.toDate,
        },
        invoiceDate: new Date(invoice.updatedAt).toLocaleDateString(),
        dueDate: invoice.RentSchedule?.dueDate || "N/A",
        paymentDate: new Date(invoice.updatedAt).toLocaleDateString(),
        status: invoice.status,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Something went wrong" });
    }
  };
  
  const getRecentPayments = async (req, res) => {
    try {
      const paidInvoices = await Invoice.findAll({
        where: { status: 'Paid' },
        include: [
          { model: Tenant, attributes: ['name'] },
          { model: RentSchedule, attributes: ['amount', 'dueDate'] }
        ],
        order: [['updatedAt', 'DESC']],
        limit: 5,
      });
  
      const formattedPayments = paidInvoices.map(invoice => ({
        tenantName: invoice.Tenant?.name || "N/A",
        amount: invoice.RentSchedule?.amount || 0,
        date: new Date(invoice.updatedAt).toLocaleDateString(),
      }));
  
      res.json(formattedPayments);
    } catch (error) {
      console.error("Error fetching recent payments:", error);
      res.status(500).json({ error: "Failed to fetch recent payments" });
    }
  };
  
  module.exports={initStripe, paymentSuccess, getTenantInvoices,getAllInvoicesWithDetails,getAllInvoicesWithDetailsId, getRecentPayments }