import { Request, Response, Router } from "express";
import { SaleInvoice } from "../../models";
import { SalePayment } from "../../models/salePayment";

const saleReportRouter = Router();

saleReportRouter.get(
  "/sales-by-customer/:id",
  async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
      return res.status(404).json({ message: "Customer not found" });
    } else {
      const sales = await SalePayment.find({ customer: id });
      res.status(200).json(sales);
    }
  }
);

saleReportRouter.get(
  "/sales-by-employee/:id",
  async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
      return res.status(404).json({ message: "Employee not found" });
    } else {
      const sales = await SalePayment.find({ createdBy: id });
      res.status(200).json(sales);
    }
  }
);

saleReportRouter.get(
  "/sales-by-project/:id",
  async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
      return res.status(404).json({ message: "Project not found" });
    } else {
      const sales = await SaleInvoice.find({ project: id });
      res.status(200).json(sales);
    }
  }
);

export default saleReportRouter;
