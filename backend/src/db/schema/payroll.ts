import moment from "moment";
import { Document, Types, Schema } from "mongoose";
import { GeneralLedger } from "../../models/generalLedger";
import { Employee } from "../../models/employee";

interface IPayroll extends Document {
  employeeId: number;
  fromDate: Date;
  Payroll_status:String;
  toDate: Date;
  salaryRate: {
    basicSalary: number;
    DA: number;
    HRA: number;
    totalSalary: number;
  };
  attendance: {
    present: number;
    paidLeave: number;
    weeklyOff: number;
    festival: number;
    paidDays: number;
  };
  earnedSalary: {
    eBasicSalary: number;
    eDA: number;
    eHRA: number;
    incentive: number;
    totalEarned: number;
  };
  deduction: {
    esiAmount: number;
    PF: number;
    advanceAmt: number;
    TDS: number;
    LWF: number;
    professionalTax: number;
    totalDeduction: number;
  };
  netSalary: number;
  connfirm:number;
  description: string;
}

const payrollSchema = new Schema<IPayroll>({
  employeeId : {
    type: Number, ref: "Employee"
  },
  
  fromDate: Date,
  Payroll_status:String,
  toDate: Date,
  salaryRate: {
    basicSalary: Number,
    DA: Number,
    HRA: Number,
    totalSalary: Number,
  },
  attendance: {
    present: Number,
    paidLeave: Number,
    weeklyOff: Number,
    festival: Number,
    paidDays: Number,
  },
  earnedSalary: {
    eBasicSalary: Number,
    eDA: Number,
    eHRA: Number,
    incentive: Number,
    totalEarned: Number,
  },
  deduction: {
    esiAmount: Number,
    PF: Number,
    advanceAmt: Number,
    TDS: Number,
    LWF: Number,
    professionalTax: Number,
    totalDeduction: Number,
  },
  netSalary: Number,
  connfirm: Number,
  description: String,
}, 
{
  timestamps: true
});

// payrollSchema.post("save", async function(next){

//   const emp = await Employee.findById(this?.employeeId);
//   const tt = 0 - this?.netSalary;
//   const gl = {
//     date: moment().format("YYYY-MM-DD"),
//     journalId: `JL-${Math.ceil(Math.random()*100000)}`,
//     referenceId: `RTX-${Math.ceil(Math.random()*100000)}`,
//     notes: "payroll",
//     journalType : "payed",
//     currency: "INR",
//     category: "employee",
//     clientName: { 
//       userId: this?.employeeId,
//       name: emp?.name
//     },
//     transaction: [{
//       account: "cash",
//       description: "Payroll Payment",
//       debits: this?.netSalary,
//       credits: 0
//     }],
//     total: tt
//   }
//   await GeneralLedger.create(gl)
//   next();
// })


export { IPayroll, payrollSchema };
