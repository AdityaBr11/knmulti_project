import { Request, Response } from "express";
import { Customer, Lead, Project, SaleEstimate, SaleInvoice } from "../../../models";
import { LeadStatus } from "../../../models/LeadStatus";
import { generateSaleEstimatePDF, generateSaleInvoicePDF } from "../../../utils/pdf-generation/generatePDF";
import RequestWithUser from "../../../utils/requestWithUser";
import putFile from "../../../utils/s3";
import fs from 'fs';
import { CustomerTimeline } from "../../../models/customerTimeline";
import moment from "moment";

export default async function controllerPut(
  req: RequestWithUser,
  res: Response
) {
  const id = req.params.id;
  if (id) {
    const projectData = req.body;
    const project = await Project.findByIdAndUpdate(id, projectData);
    if (project) {
      return res.status(200).json(project);
    } else {
      return res.status(404).send("Not found");
    }
  } else {
    res.status(400).send("No id was provided");
  }
};

export async function controllerStatusPut(
  req: RequestWithUser,
  res: Response
) {
  const { id } = req.params;
  if (id) {
    try {
      let { project, status, plot, lead, leadcustomer } = req.body;
      const leadStatus = await LeadStatus.find();
      if (status === 'Won') {
        if(leadcustomer) {

          const subPlot = project.subPlots.find((p: any) => p._id === plot._id);
          subPlot.leadsInfo.forEach((l: any) => {
            if (l.lead) {
              l.leadType = 'Lost'
            }
            if (l.customer !== leadcustomer) {
              l.leadType = 'Lost'
            }
            if (l.customer === leadcustomer) {
              l.leadType = 'Won'
            }

          });
          subPlot.sold = true;

          let customer: any = {};
          customer = await Customer.findById(leadcustomer);
          

          const leadId: any = leadStatus.filter((v,i) => v.name === 'Won');

          await CustomerTimeline.create({
            customer: leadcustomer, 
            timelineType: "Status Update",
            description: `Status updated to ${status} of ${plot?.name} in ${project?.name}`,
            // link: "",
          });

          subPlot.soldTo = customer._id;

          project.subPlots[project.subPlots.findIndex((p: any) => p._id === plot._id)] = subPlot;

          const updateProject = await Project.findByIdAndUpdate(id, project);
          // Invoice
          await createEstimate(project, plot, lead, customer, req);
          return res.status(200).json(customer);

        } else{

          // const subPlot = project.subPlots.find((p: any) => p._id === plot._id);
          // subPlot.leadsInfo.forEach((l: any) => {
          //   if (l.customer) {
          //     l.leadType = 'Lost'
          //   }
          //   if (l.lead !== lead) {
          //     l.leadType = 'Lost'
          //   }
          //   if (l.lead === lead) {
          //     l.leadType = 'Won'
          //   }
          // });
          // subPlot.sold = true;
          
          const leadData: any = await Lead.findById(lead);
          let customer: any = {};
          if (lead?.customer) {
            customer = await Customer.findById(lead?.customer);
          } else {
            const latest: any = await Customer.find({}).sort({ id: -1 }).limit(1);        
            const cust: any = {
              firstName: leadData.firstName,
              lastName: leadData.lastName,
              email: leadData.email,
              phone: leadData.phone,
              lead: leadData._id,
              displayName: leadData.name,
              customerType: 'Individual',
              billingAddress: {
                addressLine1: leadData.address.addressLine1,
                addressLine2: leadData.address.addressLine2,
                city: leadData.address.city,
                state: leadData.address.state,
                zipcode: leadData.address.zipCode,
              },
              currentAssigned: leadData?.currentAssigned,
              project: [ ...leadData?.project ],
              createdBy: req.user.id,
            };
            latest.length >0 && latest[latest.length-1].customerId
              ? cust.customerId = `CUST-${parseInt(latest[0].customerId.split('-')[1])+1}`
              : cust.customerId = 'CUST-1'
            customer = await Customer.create(cust);
          }

          const subPlot = project.subPlots.find((p: any) => p._id === plot._id);
          subPlot.leadsInfo.forEach((l: any) => {
            if (l.customer) {
              l.leadType = 'Lost'
            }
            if (l.lead !== lead) {
              l.leadType = 'Lost'
            }
            if (l.lead === lead) {
              l.leadType = 'Won';
              l.customer = customer?._id;
              l.isCustomer = true;
              // l.lead = undefined;
            }
          });
          subPlot.sold = true;

          // adding lead activity to customer timeline 
          const newCustTimeline = leadData?.activities.map((act : any) => {
            return {
              customer: customer?._id,
              timelineType: act?.activityType,
              description: act?.description,
              employee: act?.employee
            }
          });

          await CustomerTimeline.insertMany([ ...newCustTimeline ]);

          const leadId: any = leadStatus.filter((v,i) => v.name === 'Won');
          await Lead.findByIdAndUpdate(lead, {
            customer: customer._id,
            status: leadId[0]._id.toString(),
          });

          await Lead.findByIdAndUpdate(lead, {
            $push: { activities: {
              activityType: 'Status Update',
              description: `Status updated to ${status} of ${plot?.name} in ${project?.name}`,
              dateTime: new Date(),
              employee: req.user.id,
            } }
          });
          subPlot.soldTo = customer._id;

          project.subPlots[project.subPlots.findIndex((p: any) => p._id === plot._id)] = subPlot;
          const updateProject = await Project.findByIdAndUpdate(id, project);

          // Changing lead to customer info in subPlot of project 
          const leadPlotUp: any = await Lead.findById(lead).populate('project');

          // console.log("leadpopulate", leadPlotUp)

          const leadprojects = await leadPlotUp?.project;

          leadprojects.forEach(async(leadProject : any) => {
            
            let projectSubPlots = leadProject.subPlots;
            
            projectSubPlots.forEach((sp : any) => {
              // console.log(sp?.name);
              sp?.leadsInfo.forEach((li:any) => {
                if(li?.lead?.toHexString() == lead){
                  // console.log("inside");
                  li.customer = customer?._id;
                  li.isCustomer = true;
                }
              })
            }) 
            
            await Project.findByIdAndUpdate(leadProject._id, { subPlots: projectSubPlots });
          })
          

          await CustomerTimeline.create({
            customer: customer._id, 
            timelineType: "Status Update",
            description: `Status updated to ${status} of ${plot?.name} in ${project?.name}`,
            // link: "",
          });

          // Invoice
          await createEstimate(project, plot, lead, customer, req);

          await Lead.findByIdAndDelete(lead);

          return res.status(200).json(customer);
        }
      }
      const updateProject = await Project.findByIdAndUpdate(id, project);
      if(leadcustomer){

        await CustomerTimeline.create({
          customer: leadcustomer, 
          timelineType: "Status Update",
          description: `Status updated to ${status} of ${plot?.name} in ${project?.name}`,
          // link: "",
        });

      } else {

        const newLead = await Lead.findByIdAndUpdate(lead, {
          $push: { activities: {
            activityType: 'Status Update',
            description: `Status updated to ${status} of ${plot?.name} in ${project?.name}`,
            dateTime: new Date(),
            employee: req.user.id,
          } }
        });
      }
      return res.status(200).json(updateProject);
    } catch (err) {
      console.log(err);
      return res.status(400).json({ msg: 'Some error occured while updating the status' })
    }
  } else {
    return res.status(400).send("No id was provided");
  }
}

const createEstimate: any = async (project: any, plot: any, lead: any, customer: any, req: any) => {
  let est;
  const latest: any = await SaleEstimate.find({}).sort({_id: -1}).limit(1);
    if (latest.length > 0 && latest[latest.length-1].estimate) {
      est = `EST-${parseInt(latest[0].estimate.split('-')[1])+1}`;
    } else {
      est = 'EST-1';
    }

  const date = moment().format("YYYY-MM-DD");

  const data = {
    estimate: est,
    employee: req?.user?.id,
    customer: customer?._id,
    project: project?._id,
    plot: plot?.name,
    estimateDate: date,
    items: [{
      item: plot?.name,
      description: project.name,
      quantity: 1,
      unitCost: Number(plot?.cost),
      amount: Number(plot?.cost),
    }],
    discount: 0,
    taxAmount: 0,
    adjustment: 0,
    discountVarient: {
      discountType: "percent",
      discountValue: 0
    },
    amount: Number(plot?.cost),
    grandTotal: Number(plot?.cost), 
  };

  try {
    const estimate : any  = await SaleEstimate.create(data);

    await CustomerTimeline.create({
      customer: estimate?.customer, 
      timelineType: "Estimate Created",
      description: `Estimate ${estimate?.estimate} created`,
      // link: "",
    });

    const uploadedEstimate = await SaleEstimate.findOne({ _id: estimate._id }).populate(["customer", "tax"]);
    const pathToFile = await generateSaleEstimatePDF(uploadedEstimate.toJSON());
    const file = await fs.readFileSync(pathToFile);
    await putFile(file, `${uploadedEstimate._id}.pdf`);
    const saleEstimate = await SaleEstimate.findByIdAndUpdate(
      uploadedEstimate._id, 
      { pdf_url: `https://knmulti.fra1.digitaloceanspaces.com/${uploadedEstimate._id}.pdf` },
      { new: true }
    ).populate({ path: 'customer', select: 'displayName billingAddress email' });
    await fs.rmSync(pathToFile);

  } catch (e) {
    console.log(e)
  }
}

const createInvoice: any = async (project: any, plot: any, lead: any, customer: any, req: any) => {
  const latest: any = await SaleInvoice.find({}).sort({ _id: -1 }).limit(1);
  let inv;
  if(latest.lenght){
    inv = `INV-${parseInt(latest[0]?.invoice?.split('-')[1])+1}`;
  } else{
    inv = `INV-1`;
  }
  const today = new Date();
  const date = `${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}`
  const invoice = {
    employee: req.user.id,
    project: project._id,
    invoiceDate: date,
    invoice: inv,
    items: [{
      item: plot?.name,
      description: project.name,
      quantity: 1,
      unitCost: Number(plot?.cost),
      amount: Number(plot?.cost),
    }],
    customer: customer._id,
    amount: Number(plot?.cost),
    grandTotal: Number(plot?.cost),
  };
  try {
    const saleInvoice: any = await SaleInvoice.create(invoice);
    const uploadedInvoice = await SaleInvoice.findById(saleInvoice._id).populate(["customer", "tcsTax"]);
    const pathToFile = await generateSaleInvoicePDF(uploadedInvoice.toJSON())
    const file = await fs.readFileSync(pathToFile);
    await putFile(file, `${uploadedInvoice._id}.pdf`);
    await SaleInvoice.updateOne({ _id : uploadedInvoice._id }, { pdf_url: `https://knmulti.fra1.digitaloceanspaces.com/${uploadedInvoice._id}.pdf` });
    await fs.rmSync(pathToFile);
  } catch (e) {
    console.log(e)
  }
}