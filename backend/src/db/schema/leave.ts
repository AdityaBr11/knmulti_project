import { Document, Schema, Types } from "mongoose";
import { Approval } from "../../models";

interface Ileave extends Document {
  employee: number;
  leaveType: Types.ObjectId;
  fromDate: Date;
  toDate: Date;
  reason: string;
  approvedBy: number;
  approvedDate: Date;
  approved: boolean;
  status: string;
}

const leaveSchema = new Schema<Ileave>(
  {
    leaveType: { type: Schema.Types.ObjectId, ref: "LeaveType" },
    employee: { type: Number, ref: "Employee", required: true },
    fromDate: Date,
    toDate: Date,
    reason: String,
    approvedBy: Number,
    approvedDate: Date,
    approved: Boolean,
    status: String,
  },
  {
    timestamps: true,
  }
);

leaveSchema.pre("save", async function (next) {
  if (this.isNew) {
    const approval = new Approval({
      type: "leave",
      leave: this._id,
    });
    approval.save((err, approval) => {
      if (err) return next(err);
      this.approved = false;
      next();
    });
  } else {
    next();
  }
});

export { Ileave, leaveSchema };
