import { Document, Schema, Types } from "mongoose";
import { calculateNextTime } from "../../utils/nextTime";

interface IRecurringExpense extends Document {
  profileName: string;
  repeatEvery: {
    repeatNumber: number;
    repeatUnit: string;
  };
  expenseStartDate: Date;
  expenseEndDate: Date;
  expenseNextDate: Date;
  neverExpire: boolean;
  expenseAccount: string;
  expenseAmount: number;
  paymentThrough: string;
  vendorId?: Types.ObjectId;
  notes: string;
  customerId?: Types.ObjectId;
  isBillable: boolean;
  projectId?: Types.ObjectId;
  markUpBy: number;
  status: string;
}

const recurringExpenseSchema = new Schema<IRecurringExpense>({
  profileName: String,
  repeatEvery: {
    repeatNumber: Number,
    repeatUnit: String,
  },
  expenseStartDate: Date,
  expenseEndDate: Date,
  expenseNextDate: Date,
  neverExpire: Boolean,
  expenseAccount: String,
  expenseAmount: Number,
  paymentThrough: String,
  vendorId: { type: Schema.Types.ObjectId, ref:"Vendor" },
  notes: String,
  customerId: { type: Schema.Types.ObjectId, ref:"Customer" },
  isBillable: Boolean,
  projectId: { type: Schema.Types.ObjectId, ref:"Project" },
  markUpBy: Number,
  status: String,
},
{
  timestamps: true
});

recurringExpenseSchema.pre("save", async function(next){
  const nextTime = calculateNextTime(this.expenseStartDate, this.repeatEvery.repeatNumber, this.repeatEvery.repeatUnit);
  this.expenseNextDate = nextTime as any;
  next();
})

export { IRecurringExpense, recurringExpenseSchema }