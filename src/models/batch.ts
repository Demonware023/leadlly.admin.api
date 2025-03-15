// src/models/Batch.ts
import mongoose, { Schema, Document } from 'mongoose';

interface IBatch extends Document {
  name: string;
  startDate: Date;
  endDate: Date;
}

const BatchSchema = new Schema({
  name: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
});

const Batch = mongoose.model<IBatch>('Batch', BatchSchema);
export default Batch;