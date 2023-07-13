import moment from "moment";
import { SaleInvoice } from "../models";
import { RecurringInvoice } from "../models/recurringInvoice";
import { calculateNextTime } from "../utils/nextTime";

module.exports = async () => {

  let today = moment().format("YYYY-MM-DD");

  const recurringInvoice = await RecurringInvoice.find();

  const activeInvoice = recurringInvoice.filter(inv => inv.status == "ACTIVE");

  const neverExpireInv = activeInvoice.filter(inv => inv.neverExpires === true); 

  const mayExpireInv = activeInvoice.filter(inv => inv.neverExpires !== true);

  neverExpireInv.forEach(async (inv: any) => {
    const invNextDay = moment(inv.nextDate).format('YYYY-MM-DD');
    const saleInv = {
      amount: inv?.amount,
      customer: inv?.customer,
      customerNotes: inv?.customerNotes,
      discount: inv?.discount,
      employee: inv?.employee,
      project: inv?.project,
      grandTotal: inv?.grandTotal,
      invoice: `INV-${recurringInvoice.length}`,
      invoiceDate: today,
      items: inv?.items,
      orderNumber: inv?.orderNumber,
      termsAndConditions: inv?.termsAndConditions,
      terms: inv?.terms,
      adjustments: inv?.adjustments,
      status: 'OPEN',

    }

    if (invNextDay === today) {
      const invoice = await SaleInvoice.create(saleInv);
      const updateNextDate = calculateNextTime(inv?.nextDate, inv?.frequency, inv?.frequencyUnit);

      inv?.childInvoices.push(invoice._id);
      inv.nextDate = updateNextDate;

      const updatedRecInvoice = await RecurringInvoice.findByIdAndUpdate(inv?._id, inv)
    }
    
  })

  mayExpireInv.forEach(async (inv) => {
    const invNextDay = moment(inv.nextDate).format('YYYY-MM-DD');
    const invEndDay = moment(inv.endDate).format('YYYY-MM-DD');
    const saleInv = {
      amount: inv?.amount,
      customer: inv?.customer,
      customerNotes: inv?.customerNotes,
      discount: inv?.discount,
      employee: inv?.employee,
      project: inv?.project,
      grandTotal: inv?.grandTotal,
      invoice: `INV-${recurringInvoice.length}`,
      invoiceDate: today,
      items: inv?.items,
      orderNumber: inv?.orderNumber,
      termsAndConditions: inv?.termsAndConditions,
      terms: inv?.terms,
      adjustments: inv?.adjustments,
      status: 'OPEN',
    };

    const sameOrAfter = moment(invEndDay).isSameOrAfter(today, 'day');

    if (sameOrAfter) {
      if (invNextDay === today) {
        const invoice = await SaleInvoice.create(saleInv);
        const updateNextDate = calculateNextTime(inv?.nextDate, inv?.frequency, inv?.frequencyUnit);
        const nextIsSameOrAfter = moment(invEndDay).isSameOrAfter(updateNextDate, 'day');

        if (nextIsSameOrAfter) {

          inv.childInvoices.push(invoice._id);

          const updatedRecInvoice = await RecurringInvoice.findByIdAndUpdate(inv._id, {...inv, nextDate: updateNextDate });
        } else {
          const updatedRecInvoice = await RecurringInvoice.findByIdAndUpdate(inv._id, { status: 'INACTIVE' });
        }
      }
    }
  })
}