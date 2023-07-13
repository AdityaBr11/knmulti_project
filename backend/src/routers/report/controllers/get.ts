import { Request, Response } from "express";
import { Project, Vendor } from "../../../models";
import { VendorBill } from "../../../models/VendorBill";
import { VendorCredit } from "../../../models/vendorCredit";
import { VendorExpense } from "../../../models/vendorExpense";

export async function projectsSumGet(req: Request, res: Response) {
  try {

    const projects = await Project.find();

    const projectsData = projects.map((p) => {
      const totalArea = p?.subPlots.reduce((a, b) => a + b.area, 0);
      const totalAreaSold = p?.subPlots
      .filter((l) => l.sold)
      .reduce((a, b) => a + b.area, 0);

      const totalPlots = p?.subPlots.length;
      const totalPlotsSoldOut = p?.subPlots.filter((l) => l.sold).length;

      return { projectId: p?._id, projectName: p?.name, totalArea, totalAreaSold, totalPlots, totalPlotsSoldOut }

    });

    res.status(200).json(projectsData);

  } catch (err) {
    res.status(500).json({ msg: "Server Error" })
  }
}

export async function vPurchaseGet(req: Request, res: Response) {
  try {

    const vendor = await Vendor.find().select("name");

    const vbill =  await Promise.all(vendor.map(async(v) => {
      // let vExpenseCount = await VendorExpense.find({ vendorId: v?._id }).countDocuments();
      let vBillData = await VendorBill.find({ vendorId: v?._id });
      let vBillTotal = vBillData.reduce((acc, curr) => {
        return acc + curr?.total
      }, 0);

      let vExpenseData = await VendorExpense.find({ vendorId: v?._id });
      let vExpTotal = vExpenseData.reduce((acc, curr) => {
        return acc + curr?.expenseAmount
      }, 0);

      let vCreditData = await VendorCredit.find({ vendorId: v?._id });
      let vCreditTotal = vCreditData.reduce((acc, curr) => {
        return acc + curr?.total
      }, 0);

      let total = (vBillTotal + vExpTotal + vCreditTotal) || 0;
      
      return {vendorId: v, billCount: vBillData.length, expCount: vExpenseData.length, creditCount: vCreditData.length, total};
    }));
    
    res.status(200).json(vbill);
    
  } catch (err) {
    res.status(500).json({ msg: "Server Error" })
  }
}

export async function vBalSumGet(req: Request, res: Response) {
  try {

    const vendor = await Vendor.find().select("name");

    const vbill =  await Promise.all(vendor.map(async(v) => {
      let vBillData = await VendorBill.find({ vendorId: v?._id }).select("subTotal total balanceDue");
      // console.log(vBillData)
      let vTotal = vBillData.reduce((acc, curr) => {
        return acc + curr?.total
      }, 0);
      let vBalanceDue = vBillData.reduce((acc, curr) => {
        return acc + curr?.balanceDue
      }, 0);
      return {vendorId: v, total: vTotal, amountPaid : vTotal - vBalanceDue};
    }));
    
    res.status(200).json(vbill);
    
  } catch (err) {
    res.status(500).json({ msg: "Server Error" })
  }
}

export async function pBalSumGet(req: Request, res: Response) {
  try {

    const project = await Project.find().select("name");

    const pbill =  await Promise.all(project.map(async(p) => {
      let pBillData = await VendorBill.find({ projectId: p?._id }).select("subTotal total balanceDue");
      // console.log(pBillData)
      let pTotal = pBillData.reduce((acc, curr) => {
        return acc + curr?.total
      }, 0);
      let pBalanceDue = pBillData.reduce((acc, curr) => {
        return acc + curr?.balanceDue
      }, 0);
      return {projectId: p, total: pTotal, amountPaid : pTotal - pBalanceDue, balanceDue : pBalanceDue};
    }));
    
    res.status(200).json(pbill);
    
  } catch (err) {
    res.status(500).json({ msg: "Server Error" })
  }
}

export async function vCreditSumGet(req: Request, res: Response) {
  try {

    const vendor = await Vendor.find().select("name");

    const vCreditSum =  await Promise.all(vendor.map(async(v) => {
      let vCreditData = await VendorCredit.find({ vendorId: v?._id });
      let vCreditTotal = vCreditData.reduce((acc, curr) => {
        return acc + curr?.total
      }, 0);
      let vCreditUsed = vCreditData.reduce((acc, curr) => {
        return acc + curr?.creditUsed
      }, 0);
      let vCreditBalance = vCreditData.reduce((acc, curr) => {
        return acc + curr?.balance
      }, 0);

      return {vendorId: v, total: vCreditTotal, creditUsed : vCreditUsed, creditBalance: vCreditBalance};
    }));
    
    res.status(200).json(vCreditSum);
    
  } catch (err) {
    res.status(500).json({ msg: "Server Error" })
  }
}

