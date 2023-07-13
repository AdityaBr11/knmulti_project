import { Document, Schema } from "mongoose";

interface ModuleAccess {
  employee: Boolean;
  holidays: Boolean;
  leaves: Boolean;
  events: Boolean;
  chat: Boolean;
  jobs: Boolean;
}

interface Crud {
  read: Boolean;
  write: Boolean;
  create: Boolean;
  delete: Boolean;
  import: Boolean;
  export: Boolean;
}

interface ModulePermission {
  employee: Crud;
  holidays: Crud;
  leaves: Crud;
  events: Crud;
}

interface IRolePermisionAccseeSchema extends Document {
  role: string;
  moduleAccess : ModuleAccess;
  modulePermission: ModulePermission;
}


const rolePermisionAccseeSchema = new Schema<IRolePermisionAccseeSchema>(
  {
    role: {
      type: String,
      required: [true, "Please Provide Role"],
      unique: true,
    },
    moduleAccess: {
      employee: {
        type: Boolean,
        default: false
      },
      holidays: {
        type: Boolean,
        default: false
      },
      leaves: {
        type: Boolean,
        default: false
      },
      events: {
        type: Boolean,
        default: false
      },
      chat: {
        type: Boolean,
        default: false
      },
      jobs: {
        type: Boolean,
        default: false
      },
    },
    modulePermission: {
      employee: {
        read: {
        type: Boolean,
        default: false
      },
        create: {
        type: Boolean,
        default: false
      },
        write: {
        type: Boolean,
        default: false
      },
        import: {
        type: Boolean,
        default: false
      },
        delete: {
        type: Boolean,
        default: false
      },
        export: {
          type: Boolean,
          default: false
        },
      },
      holidays: {
        read: {
        type: Boolean,
        default: false
      },
        create: {
        type: Boolean,
        default: false
      },
        write: {
        type: Boolean,
        default: false
      },
        import: {
        type: Boolean,
        default: false
      },
        delete: {
        type: Boolean,
        default: false
      },
        export: {
          type: Boolean,
          default: false
        },
      },
      events: {
        read: {
        type: Boolean,
        default: false
      },
        create: {
        type: Boolean,
        default: false
      },
        write: {
        type: Boolean,
        default: false
      },
        import: {
        type: Boolean,
        default: false
      },
        delete: {
        type: Boolean,
        default: false
      },
        export: {
          type: Boolean,
          default: false
        },
      },
      leaves: {
        read: {
        type: Boolean,
        default: false
      },
        create: {
        type: Boolean,
        default: false
      },
        write: {
        type: Boolean,
        default: false
      },
        import: {
        type: Boolean,
        default: false
      },
        delete: {
        type: Boolean,
        default: false
      },
        export: {
          type: Boolean,
          default: false
        },
      },
    }
  }
);

export { IRolePermisionAccseeSchema, rolePermisionAccseeSchema };