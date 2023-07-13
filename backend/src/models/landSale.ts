import { model } from "mongoose";
import { ILandSale, landSaleSchema } from "../db/schema/landSale";

export const LandSale = model<ILandSale>("LandSale", landSaleSchema);