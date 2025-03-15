// src/models/Student.ts
import mongoose, { Schema, Document } from 'mongoose';

interface IStudent extends Document {
  firstName: string;
  lastName: string;
  email: string;
  batchId: mongoose.Types.ObjectId;
}

const StudentSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  batchId: { type: Schema.Types.ObjectId, ref: 'Batch', required: true },
});

const Student = mongoose.model<IStudent>('Student', StudentSchema);
export default Student;