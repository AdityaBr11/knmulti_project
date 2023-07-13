import { model } from "mongoose";
import { clientSchema } from "../db/schema/client";

const Client = model("Client", clientSchema);

export default Client;
