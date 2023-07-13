import { Document, Schema, Types } from "mongoose";
import { PRIORITY } from "../../constants";

interface ProjectAttachment {
  name: string;
  url: string;
  uploadedAt: Date;
  uploader: number;
}

interface subPlot extends Document {
  name: string;
  leadsInfo: {
    leadType: string;
    lead: Types.ObjectId;
    isCustomer: Boolean;
    customer: Types.ObjectId;
  }[];
  facing: string;
  area: number;
  areaCost: string;
  dimension: string;
  corner: string;
  other: string;
  cost: string;
  description: string;
  revenuePlot: [{
    name: string;
    area: number;
    percent: number;
    cost: number;
    description: string;
  }];
  component: {
    x: string;
    y: string;
  };
  sold: boolean;
  soldAt: Date;
  soldBy: number;
  soldTo: Types.ObjectId;
}

interface IProject extends Document {
  name: string;
  startDate: Date;
  endDate: Date;
  saleStatus: string;
  description: string;
  leads: Types.ObjectId[];
  leadcustomers: Types.ObjectId[];
  members: number[];
  vendor: Types.ObjectId;
  priority: PRIORITY;
  progress: number;
  type: string;
  subtype: string;
  createdBy: number;
  estimatedCost: number;
  costPerSqFeet: number;
  attachments: ProjectAttachment[];
  layout: string;
  subPlots: subPlot[];
  landArea : number;
}

const projectSchema = new Schema<IProject>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    startDate: Date,
    endDate: Date,
    saleStatus: String,
    description: String,
    leads: [{ type: Schema.Types.ObjectId, ref: "Lead" }],
    leadcustomers: [{ type: Schema.Types.ObjectId, ref: "Customer" }],
    members: [{ type: Number, ref: "Employee" }],
    vendor: { type: Schema.Types.ObjectId, ref: "Vendor" },
    priority: { type: String, enum: Object.values(PRIORITY) },
    progress: Number,
    type: String,
    subtype: String,
    costPerSqFeet: Number,
    createdBy: { type: Number, ref: "Employee" },
    layout: String,
    subPlots: [
      {
        name: String,
        leadsInfo: [
          {
            leadType: {
              default: "New Lead",
              type: String,
            },
            lead: { type: Schema.Types.ObjectId, ref: "Lead" },
            isCustomer: { type: Boolean, default: false },
            customer: { type: Schema.Types.ObjectId, ref: "Customer" },
          },
        ],
        facing: String,
        dimension: String,
        area: Number,
        areaCost: String,
        corner: { type: String, default: 0 },
        other: { type: String, default: 0 },
        cost: String,
        description:String,
        revenuePlot: [{
          name: String,
          area: Number,
          percent: Number,
          cost: Number,
          description: String
        }],
        component: {
          x: String,
          y: String,
        },
        sold: {
          type: Boolean,
          default: false,
        },
        soldAt: Date,
        soldBy: { type: Number, ref: "Employee" },
        soldTo: { type: Schema.Types.ObjectId, ref: "Customer" },
      },
    ],
    estimatedCost: Number,
    attachments: [
      {
        name: String,
        url: String,
        uploadedAt: Date,
        uploader: { type: Number, ref: "Employee" },
      },
    ],
    landArea: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

export { IProject, projectSchema };
