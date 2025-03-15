import { Request, Response, NextFunction } from 'express';
import { db } from '../../db/db';
import { CustomError } from '../../middleware/error';
import mongoose from 'mongoose';

export const createBatch = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, mentorId, studentIds } = req.body;

        if (!name || !mentorId || !Array.isArray(studentIds)) {
            return next(new CustomError("Batch name, mentor ID, and student IDs are required", 400));
        }

        if (!mongoose.Types.ObjectId.isValid(mentorId)) {
            return next(new CustomError("Invalid mentor ID", 400));
        }

        if (studentIds.some(id => !mongoose.Types.ObjectId.isValid(id))) {
            return next(new CustomError("Invalid student IDs", 400));
        }

        const mentorObjectId = new mongoose.Types.ObjectId(mentorId);
        const studentObjectIds = studentIds.map(id => new mongoose.Types.ObjectId(id));

        // Check if students are already assigned to a batch
        const existingStudents = await db.collection('users').find({ _id: { $in: studentObjectIds }, batchId: { $ne: null } }).toArray();

        if (existingStudents.length > 0) {
            return next(new CustomError("Some students are already assigned to a batch", 400));
        }

        // Create the batch
        const batch = await db.collection('batches').insertOne({
            name,
            mentorId: mentorObjectId,
            studentIds: studentObjectIds,
            createdAt: new Date()
        });

        // Update students to reference the new batch
        await db.collection('users').updateMany(
            { _id: { $in: studentObjectIds } },
            { $set: { batchId: batch.insertedId } }
        );

        res.status(201).json({
            success: true,
            message: "Batch created successfully",
            batchId: batch.insertedId
        });
    } catch (error: any) {
        console.error(`Error: ${error.message}`);
        next(new CustomError(error.message, 500));
    }
};

export const getBatches = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const batches = await db.collection('batches').find().toArray();

        res.status(200).json({
            success: true,
            batches
        });
    } catch (error: any) {
        console.error(`Error: ${error.message}`);
        next(new CustomError(error.message, 500));
    }
};

export const getBatchStudents = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { batchId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(batchId)) {
            return next(new CustomError("Invalid batch ID", 400));
        }

        const students = await db.collection('users').find({ batchId: new mongoose.Types.ObjectId(batchId) }).toArray();

        res.status(200).json({
            success: true,
            students
        });
    } catch (error: any) {
        console.error(`Error: ${error.message}`);
        next(new CustomError(error.message, 500));
    }
};