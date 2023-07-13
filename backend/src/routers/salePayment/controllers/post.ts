// create an express post route for the salePayment model

import { Request, Response } from "express";
import { Customer, Project, SaleInvoice } from "../../../models";
import { SalePayment } from "../../../models/salePayment";
import { generateSalePayment } from "../../../utils/pdf-generation/generatePDF";
import { validatePayment } from "../../../validators";
import fs from 'fs';
import putFile from "../../../utils/s3";
import { CustomerTimeline } from "../../../models/customerTimeline";

export default async function controllerPost(req: Request, res: Response) {
  try {
    const data = req.body;
    const errors = validatePayment(data.payment);
    if (errors.length) {
      res.status(400).json({ errors });
      return;
    };

    const latest: any = await SalePayment.find({}).sort({_id: -1}).limit(1);
    latest.length > 0 
      ? data.payment.paymentNumber = `RP-${parseInt(latest[0].paymentNumber.split('-')[1])+1}`
      : data.payment.paymentNumber = `RP-1`;

    const invoices = [...data.invoices];
    let invoice : any = [];

    for await (const invData of invoices) {
      const inv = await SaleInvoice.findById(invData._id);
      if (!inv) {
        return res.status(404).json({message: "Invoice not found"});
      }

      const paidAmount = invData.paidAmount - inv.paidAmount;
      const withholdingTax = invData.withholdingTax - inv.withholdingTax;

      if (paidAmount > 0 || withholdingTax > 0) {
        invoice.push({
          id: inv._id.toString(),
          paidAmount,
          withholdingTax,
          invoiceNumber: inv.invoice,
          invoiceDate: inv.invoiceDate,
          invoiceAmount: inv.grandTotal,
        });
      }

      inv.paidAmount = invData.paidAmount;
      inv.withholdingTax = invData.withholdingTax;
      await SaleInvoice.findByIdAndUpdate(inv._id, inv);
    }

    data.payment.invoice = invoice;
    
    const salePayment: any = await SalePayment.create(data.payment);

    await CustomerTimeline.create({
      customer: salePayment?.customer, 
      timelineType: "Sale Payment Created",
      description: `Sale Payment ${salePayment?.paymentNumber} Created`,
      // link: "",
    });

    for await (const inv of invoice ) {
      const invoiceData : any = await SaleInvoice.findById(inv.id);
      const paymentReceived = {
        id: salePayment._id,
        payment: salePayment.paymentNumber,
        paymentMode: salePayment.paymentMode,
        amount: inv.paidAmount,
      };

      invoiceData.paymentReceived.push(paymentReceived);
      let balanceDue = invoiceData?.grandTotal - invoiceData?.paidAmount - invoiceData?.withholdingTax;
      invoiceData.balance = balanceDue;
      invoiceData.status = balanceDue <= 0 ? "PAID" : "PARTIAL";
      const updatedInv = await SaleInvoice.findByIdAndUpdate(invoiceData._id, invoiceData, { new : true });

      await CustomerTimeline.create({
        customer: updatedInv?.customer, 
        timelineType: "Invoice Updated",
        description: `Invoice ${updatedInv?.invoice} Updated`,
        // link: "",
      });

      const updatedInvoice : any = await SaleInvoice.findById(updatedInv?._id).populate("project");
      // console.log("populate", updatedInvoice);
      if(updatedInvoice?.status == "PAID"){
        if(updatedInvoice?.plot){
          console.log("I am In ");

          const subPlot = await updatedInvoice?.project.subPlots.find((p: any) => p.name == updatedInvoice?.plot);
          console.log({ subPlot })
          // let projectSubPlots = leadProject.subPlots;

          subPlot.leadsInfo.forEach((l: any) => {
            console.log(l.customer, updatedInvoice.customer);
            if (l.customer?.toHexString() == updatedInvoice.customer?.toHexString()) {
              console.log("inside");
              l.leadType = 'Under Registration'
            }
          });

          console.log("sub", subPlot);

          updatedInvoice.project.subPlots[updatedInvoice.project.subPlots.findIndex((p: any) => p.name == updatedInvoice.plot)] = subPlot;

          console.log("subPlots", updatedInvoice.project.subPlots[updatedInvoice.project.subPlots.findIndex((p: any) => p.name == updatedInvoice.plot)]);

          
          const updateProject = await Project.findByIdAndUpdate(updatedInvoice.project?._id, {subPlots: updatedInvoice.project.subPlots}, {new: true});
          console.log("updateProject", updateProject?.subPlots);
          await CustomerTimeline.create({
            customer: updatedInvoice.customer, 
            timelineType: "Status Update",
            description: `Status updated to Under Registration of ${subPlot?.name} in ${updateProject?.name}`,
            // link: "",
          });
        }
      }
    };

    const uploadedPayemnt = await SalePayment.findById(salePayment._id).populate(["customer"]);
    const pathToFile = await generateSalePayment(uploadedPayemnt.toJSON())
    const file = await fs.readFileSync(pathToFile);
    await putFile(file, `${uploadedPayemnt._id}.pdf`);
    const payment = await SalePayment.findByIdAndUpdate(uploadedPayemnt._id, { pdf_url: `https://knmulti.fra1.digitaloceanspaces.com/${uploadedPayemnt._id}.pdf` }, { new: true}).populate({ path: 'customer', select: 'displayName billingAddress email' });
    await fs.rmSync(pathToFile);
    res.status(200).send(payment);
  } catch (err) {
    console.log(err)
    res.status(500).send({ msg: 'Error Recording the Payment' })
  }
}