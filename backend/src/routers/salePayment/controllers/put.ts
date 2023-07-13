// create an express put route for salePayment model

import { Request, Response } from "express";
import { SalePayment } from "../../../models/salePayment";
import { generateSalePayment } from "../../../utils/pdf-generation/generatePDF";
import putFile, { deleteFile } from "../../../utils/s3";
import { validatePayment } from "../../../validators";
import fs from 'fs';
import { Project, SaleInvoice } from "../../../models";
import moment from "moment";
import { CustomerTimeline } from "../../../models/customerTimeline";

export default async function controllerPut(req: Request, res: Response) {
  const { id } = req.params;
  const data = req.body;
  const errors = validatePayment(data);
  if (errors.length) {
    res.status(400).json({ errors });
    return;
  }
  const salePayment = await SalePayment.findByIdAndUpdate(id, data).populate({ path: 'customer', select: 'displayName billingAddress email' });
  if (!salePayment) {
    return res.status(404).json({ message: "SalePayment not found" });
  }
  return res.status(200).json(salePayment);
}

export async function updatePayCredits(req: Request, res: Response){

  // console.log("Hello");

  const { creditList, inv } = req.body;

  const invoiceData : any = await SaleInvoice.findById(inv.id);

  const payCreditsArr = [ ...creditList ];

  for await (const payCreditData of payCreditsArr){

    const salePayInfo : any = await SalePayment.findById(payCreditData.id);

    let invoice : any = [];

    if(salePayInfo?.invoice?.length){
      invoice = [ ...salePayInfo.invoice ];
    }

    const invInfofropay = {
      id: inv?.id,
      paidAmount: payCreditData?.paymentAmount - payCreditData?.pAmt,
      invoiceNumber: inv?.invoiceNumber,
      invoiceDate: moment().format("YYYY-MM-DD"),
      invoiceAmount: inv?.invoiceAmount,
    }

    invoice.push({ ...invInfofropay });

    const uploadedPayemnt : any = await SalePayment.findByIdAndUpdate(payCreditData.id, {
      paymentAmount: payCreditData?.paymentAmount,
      excessAmount: payCreditData?.excessAmount,
      invoice: [ ...invoice ]
    }, { new : true });

    await CustomerTimeline.create({
      customer: uploadedPayemnt?.customer, 
      timelineType: "Sale Payment Updated",
      description: `Sale Payment ${uploadedPayemnt?.paymentNumber} Updated`,
      // link: "",
    });

    const paymentReceived = {
      id: uploadedPayemnt._id,
      payment: uploadedPayemnt.paymentNumber,
      paymentMode: uploadedPayemnt.paymentMode,
      amount: payCreditData?.paymentAmount - payCreditData?.pAmt,
    };

    invoiceData.paymentReceived.push(paymentReceived);

    const updatedPay = await SalePayment.findById(uploadedPayemnt._id).populate(["customer"]);

    await deleteFile(`${updatedPay._id}.pdf`);

    const pathToFile = await generateSalePayment(updatedPay.toJSON());
    const file = await fs.readFileSync(pathToFile);
    await putFile(file, `${updatedPay._id}.pdf`);
    await fs.rmSync(pathToFile);
  }

  invoiceData.paidAmount = inv.paidAmount + invoiceData.paidAmount;
  invoiceData.balance = inv?.invBalDue;
  invoiceData.status = inv?.invBalDue <= 0 ? "PAID" : "PARTIAL";

  const updatedInv = await SaleInvoice.findByIdAndUpdate(invoiceData.id, invoiceData, { new : true });

  await CustomerTimeline.create({
    customer: updatedInv?.customer, 
    timelineType: "Invoice Updated",
    description: `Invoice ${updatedInv?.invoice} Updated`,
    // link: "",
  });

  const updatedInvoice : any = await SaleInvoice.findById(updatedInv?._id).populate("project");

  if(updatedInvoice?.status == "PAID"){
    if(updatedInvoice?.plot){
      // console.log("I am In ");

      const subPlot = await updatedInvoice?.project.subPlots.find((p: any) => p.name == updatedInvoice?.plot);
      // console.log({ subPlot })
      // let projectSubPlots = leadProject.subPlots;

      subPlot.leadsInfo.forEach((l: any) => {
        // console.log(l.customer, updatedInvoice.customer);
        if (l.customer?.toHexString() == updatedInvoice.customer?.toHexString()) {
          // console.log("inside");
          l.leadType = 'Under Registration'
        }
      });

      // console.log("sub", subPlot);

      updatedInvoice.project.subPlots[updatedInvoice.project.subPlots.findIndex((p: any) => p.name == updatedInvoice.plot)] = subPlot;

      // console.log("subPlots", updatedInvoice.project.subPlots[updatedInvoice.project.subPlots.findIndex((p: any) => p.name == updatedInvoice.plot)]);

      
      const updateProject = await Project.findByIdAndUpdate(updatedInvoice.project?._id, {subPlots: updatedInvoice.project.subPlots}, {new: true});

      await CustomerTimeline.create({
        customer: updatedInvoice.customer, 
        timelineType: "Status Update",
        description: `Status updated to Under Registration of ${subPlot?.name} in ${updateProject?.name}`,
        // link: "",
      });

      // console.log("updateProject", updateProject?.subPlots);
    }
  }

  return res.status(200).json(updatedInvoice);

}
