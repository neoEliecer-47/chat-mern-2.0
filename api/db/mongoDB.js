import mongoose from "mongoose";

mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    
  })
  .then(() => console.log("db conectada Ok📗"))
  .catch((e) => console.log("algo falló " + e));