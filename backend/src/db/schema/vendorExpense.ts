import { Document, Schema, Types } from "mongoose";

interface IVendorExpense extends Document {
  expenseDate: Date;
  employeeId: number;
  expenseAccount: string;
  ratePerKM: number;
  distance: number;
  expenseAmount: number;
  paymentThrough: string;
  vendorId?: Types.ObjectId;
  invoiceId: string;
  notes: string;
  customerId?: Types.ObjectId;
  isBillable: boolean;
  projectId?: Types.ObjectId;
  markUpBy: number;
  isInvoiced: boolean;
  status: string;
  recurrExp?: Types.ObjectId;
  invoiceRef?: Types.ObjectId;
  fileInfos: {
    fileName: string;
    filePath: string;
  }[];
  pdf_url?: string;
}

const vendorExpenseSchema = new Schema<IVendorExpense>({
  expenseDate: Date,
  employeeId: { type: Number, ref:"Employee" },
  expenseAccount: String,
  ratePerKM: Number,
  distance: Number,
  expenseAmount: Number,
  paymentThrough: String,
  vendorId: { type: Schema.Types.ObjectId, ref:"Vendor" },
  invoiceId: String,
  notes: String,
  customerId: { type: Schema.Types.ObjectId, ref:"Customer" },
  isBillable: Boolean,
  projectId: { type: Schema.Types.ObjectId, ref:"Project" },
  markUpBy: Number,
  isInvoiced: Boolean,
  status: String,
  invoiceRef: { type: Schema.Types.ObjectId, ref:"saleInvoice" },
  recurrExp: { type: Schema.Types.ObjectId, ref:"RecurringExpense" },
  fileInfos: [{
    fileName: String,
    filePath: String,
  }],
  pdf_url: String,
},
{
  timestamps: true
});
 
export { IVendorExpense, vendorExpenseSchema }