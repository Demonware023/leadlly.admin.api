import { app } from "./app";
import ConnectToDB from "./db/db";
import serverless from "serverless-http";
// import { otpWorker } from "./services/bullmq/worker";
import mongoose from 'mongoose';

const port = process.env.PORT || 4001

ConnectToDB(); //main db

// MongoDB connection for batch-related data
mongoose
  .connect('mongodb://localhost:27017/leadlly', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as any)
  .then(() => console.log('MongoDB connected'));

// otpWorker

app.listen(port, () => console.log(`Server is working on port ${port}`))
