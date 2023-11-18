const express = require('express');
const salesReportRouter = express();
const salesReportController = require('../controller/salesReportControl');
const auth = require('../middleware/adminAuth');

salesReportRouter.get('/saleReport', auth.isAdminLogin, salesReportController.loadSalesReportPage);

module.exports = salesReportRouter;