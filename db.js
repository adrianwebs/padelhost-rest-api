import mongoose from "mongoose";

const connectionString = "mongodb+srv://Adriwebs:zG90o6JbuDF1h9US@cluster0.zso5e.mongodb.net/padelhost?retryWrites=true&w=majority";

mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("Connected to MongoDB");
}).catch((err) => {
  console.log("Error connecting to MongoDB: ", err);
});