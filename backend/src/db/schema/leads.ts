import { Document, Schema, Types } from "mongoose";
import { Lead, Project, Task } from "../../models";
import { Employee } from "../../models/employee";

interface ILeadActivity {
  id: number;
  type: string;
  description: string;
  dateTime: Date;
  employee: Number;
}

interface ILeadNote {
  id: number;
  title: string;
  dateTime: Date;
  description: string;
}

interface IAddress {
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zipCode: string;
}

interface ILead extends Document {
  name: string;
  firstName: string;
  lastName: string;
  status: Types.ObjectId;
  startDate: Date;
  email: string;
  notes: [ILeadNote];
  activities: [ILeadActivity];
  nextAppointment: Date;
  createdBy: number;
  endDate: Date;
  project: Types.ObjectId[];
  lead: string;
  phone: string;
  address: IAddress;
  assignedTo: [number];
  pointDiscussed: string;
  totalCalls: string;
  assignType: string;
  currentAssigned: number;
  interest: [string]; 
  customer: Types.ObjectId;
  // not used
}

const leadSchema = new Schema<ILead>(
  {
    status: { type: Schema.Types.ObjectId, ref: 'LeadStatus' },
    name: String,
    firstName: String,
    lastName: String,
    startDate: Date,
    nextAppointment: Date,
    email: String,
    endDate: Date,
    project: [{ type: Schema.Types.ObjectId, ref: "Project" }],
    lead: String,
    phone: String,
    address: {
      addressLine1: String,
      addressLine2: String,
      city: String,
      state: String,
      zipCode: String,
    },
    assignType: String,
    notes: [
      {
        id: Number,
        title: String,
        dateTime: Date,
        description: String,
      },
    ],
    createdBy: { type: Number, ref: "Employee" },
    assignedTo: [{ type: Number, ref: "Employee" }],
    currentAssigned: { type: Number, ref: "Employee" },
    totalCalls: String,
    pointDiscussed: String,
    customer: { type: Types.ObjectId, ref: "Customer" },
    activities: [
      {
        id: Number,
        activityType: String,
        description: String,
        dateTime: Date,
        employee: { type: Number, ref: "Employee"}
      },
    ],
  },
  { timestamps: true }
);

// leadSchema.pre('save', async function(next) {
//   if (this.isNew) {
//     await Lead.findByIdAndUpdate(this._id, { name: `${this.firstName} ${this.lastName}` });
//   }
// })

leadSchema.pre("save", function(next) {
  this.name = `${this?.firstName} ${this?.lastName}`;
  next();
})

export { ILead, leadSchema };
