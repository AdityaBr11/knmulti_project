import { connectDB } from "./db";
import server from "./server";
require("dotenv").config();

connectDB()
  .then(() => {
    server.listen(process.env.PORT || 3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
