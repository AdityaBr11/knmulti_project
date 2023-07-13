import moment from "moment";
import { RecurringExpense } from "../models/recurringExpense"
import { VendorExpense } from "../models/vendorExpense";
import { calculateNextTime } from "../utils/nextTime";


module.exports = async () => {
  console.log("in expense sch 1");
  
  let today = moment().format("YYYY-MM-DD")

  const recurringExpense = await RecurringExpense.find();
  // console.log({recurringExpense})

  const activeExpense = recurringExpense.filter(exp => exp.status == "ACTIVE");
  // console.log({activeExpense})
  const neverExpireExpense = activeExpense.filter(exp => exp.neverExpire == true);
  // console.log({neverExpireExpense})
  const mayExpireExpense = activeExpense.filter(exp => exp.neverExpire != true);
  // console.log({mayExpireExpense})

  neverExpireExpense.forEach(async (nep) => {
    // console.log("in expense sch never exp 2");
    const expNextDay = moment(nep.expenseNextDate).format("YYYY-MM-DD");
    const vendorExpense = {
      expenseDate: today,
      expenseAccount : nep?.expenseAccount,
      expenseAmount: nep?.expenseAmount,
      paymentThrough: nep?.paymentThrough,
      vendorId: nep?.vendorId,
      notes: nep?.notes,
      customerId: nep?.customerId,
      isBillable: nep?.isBillable,
      projectId: nep?.projectId,
      markUpBy: nep?.markUpBy,
      status: nep?.isBillable ? "UNBILLED" : "NON-BILLABLE",
      recurrExp: nep?._id
    }
    // console.log({ expNextDay, today })
    if(expNextDay == today){
      // console.log("in expense sch never exp eq today 3");
      const aa = await VendorExpense.create(vendorExpense);
      // console.log({aa})
      const updateExpnxtD = calculateNextTime(nep?.expenseNextDate, nep?.repeatEvery.repeatNumber, nep?.repeatEvery.repeatUnit);
      const bb = await RecurringExpense.findByIdAndUpdate(nep?._id, { expenseNextDate : updateExpnxtD });
      // console.log({bb})
    }
  })

  mayExpireExpense.forEach(async (mep) => {
    // console.log("in expense sch may exp 4");
    const expNextDay = moment(mep.expenseNextDate).format("YYYY-MM-DD");
    const expEndtDay = moment(mep.expenseEndDate).format("YYYY-MM-DD");
    const vendorExpense = {
      expenseDate: today,
      expenseAccount : mep?.expenseAccount,
      expenseAmount: mep?.expenseAmount,
      paymentThrough: mep?.paymentThrough,
      vendorId: mep?.vendorId,
      notes: mep?.notes,
      customerId: mep?.customerId,
      isBillable: mep?.isBillable,
      projectId: mep?.projectId,
      markUpBy: mep?.markUpBy,
      status: mep?.isBillable ? "UNBILLED" : "NON-BILLABLE",
      recurrExp: mep?._id
    }

    const sameOrAfter = moment(expEndtDay).isSameOrAfter(today, "day");

    if(sameOrAfter){
      // console.log("in expense sch same or after 5");
      if(expNextDay == today){
        // console.log("in expense sch 6");
        const cc = await VendorExpense.create(vendorExpense);
        // console.log({cc})
        const updateExpnxtD = calculateNextTime(mep?.expenseNextDate, mep?.repeatEvery.repeatNumber, mep?.repeatEvery.repeatUnit);
        // console.log({updateExpnxtD});
        const updatedSameOrAfter = moment(expEndtDay).isSameOrAfter(updateExpnxtD, "day");
        if(updatedSameOrAfter){
          // console.log("in expense sch 7");
          const dd = await RecurringExpense.findByIdAndUpdate(mep?._id, { expenseNextDate : updateExpnxtD });
          // console.log({dd})
        } else {
          // console.log("in expense sch 8");
          const ee =await RecurringExpense.findByIdAndUpdate(mep?._id, { expenseNextDate : undefined, status: "INACTIVE" });
          // console.log({ee})
        }
      }
    }

  });

} 