import { Router } from "express";
import { Customer, Lead, Project, SaleInvoice } from "../../models";
import { Employee } from "../../models/employee";
import { SalePayment } from "../../models/salePayment";

const dashboardRouter = Router();

dashboardRouter.get("/", async (req, res) => {
  const project = await Project.find();
  const employeeCount = await Employee.find().count();
  const customerCount = await Customer.find().count();

  const leadCount = await Lead.find().populate("status").count();
  // const leadCount = await Lead.find({
  //   $nor: [{ status: "Lead Won" }, { status: "Lead Lost" }],
  // }).count();
  const invoices = await SaleInvoice.find({})
    .limit(5)
    .populate("customer")
    .populate("project");
  const payments = await SalePayment.find({}).limit(5).populate("invoice");

  return res.status(200).json({
    projectCount: project.length,
    project,
    employeeCount,
    customerCount,
    leadCount,
    invoices,
    payments,
  });
});

export default dashboardRouter;
