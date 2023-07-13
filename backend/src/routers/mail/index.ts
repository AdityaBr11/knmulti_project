import { Router } from "express";
import { 
  creditNote,
  deliveryChallan, 
  landSale, 
  purchaseBill, 
  purchaseOrder, 
  saleEstimate, 
  saleInvoice, 
  saleOrder, 
  salePayment,
  vendorCredit,
  vendorPayment, 
} from "./controllers/post";

const mailRouter = Router();

mailRouter.post('/estimate', saleEstimate);
mailRouter.post('/sale-order', saleOrder);
mailRouter.post('/delivery-challan', deliveryChallan);
mailRouter.post('/sale-invoice', saleInvoice);
mailRouter.post('/sale-payment', salePayment);
mailRouter.post('/credit-note', creditNote);

// purchase 
mailRouter.post('/purchase-order', purchaseOrder);
mailRouter.post('/purchase-bill', purchaseBill);
mailRouter.post('/vendor-credit', vendorCredit);
mailRouter.post('/vendor-payment', vendorPayment);
mailRouter.post('/land-sale-email', landSale);

export default mailRouter;