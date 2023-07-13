import { Document, Schema, Types } from "mongoose";


interface IPurchaseOrder extends Document {
  vendorId: Types.ObjectId;
  projectId: Types.ObjectId;
  deliveryTo: string;
  organisationData: {
    name: string;
    address: string;
  };
  customerId: Types.ObjectId;
  purchaseOrderNo: string;
  referenceId: string;
  purchareOrderDate: Date;
  expentedDeliveryDate: Date;
  paymentTerms: string;
  shipmentPreference: string;
  discountType: string;
  transaction: {
    itemDetails: string;
    account: string;
    quantity: number;
    unit: string;
    rate: number;
    discount: {discountType: string; discountValue: number;};
    amount: number;
  }[];
  subTotal: number;
  discount: {
    discountType: string;
    discountValue: number;
  };
  discountAccount: string;
  discountAmount: number;
  taxSystem: string;
  taxType: string;
  tcsTax: Types.ObjectId;
  taxAmount: number;
  adjustment: {
    adjustmentName: string;
    adjustmentValue: number;
  };
  total: number;
  notes: string;
  termsAndConditions: string;
  status: string;
  billedStatus: string;
  billInfo: Types.ObjectId;
  fileInfos: {
    fileName: string;
    filePath: string;
  }[];
  pdf_url?:string;
}

const purchaseOrderSchema = new Schema<IPurchaseOrder>({
  vendorId: { type: Schema.Types.ObjectId, ref: "Vendor" },
  projectId: { type: Schema.Types.ObjectId, ref: "Project" },
  deliveryTo: String,
  organisationData: {
    name: String,
    address: String,
  },
  customerId: { type: Schema.Types.ObjectId, ref: "Customer" },
  purchaseOrderNo: String,
  referenceId: String,
  purchareOrderDate: Date,
  expentedDeliveryDate: Date,
  paymentTerms: String,
  shipmentPreference: String,
  discountType: String,
  transaction: [{
    itemDetails: String,
    account: String,
    quantity: Number,
    unit: { type: String, default: "pcs." },
    rate: Number,
    discount: {discountType: String, discountValue: Number},
    amount: Number,
  }],
  subTotal: Number,
  discount: {
    discountType: String,
    discountValue: Number,
  },
  discountAccount: String,
  discountAmount: Number,
  taxSystem: String,
  taxType: String,
  tcsTax: { type: Schema.Types.ObjectId, ref: "Tax" },
  taxAmount: Number,
  adjustment: {
    adjustmentName: String,
    adjustmentValue: Number,
  },
  total: Number,
  notes: String,
  termsAndConditions: String,
  status: String,
  billedStatus: String,
  billInfo: { type: Schema.Types.ObjectId, ref: "VendorBill" },
  fileInfos: [{
    fileName: String,
    filePath: String,
  }],
  pdf_url: String,
},
{
  timestamps: true
});

// 0 0,12 * * *
export { IPurchaseOrder, purchaseOrderSchema }