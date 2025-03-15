import Batch from '../../models/batch';
import Student from '../../models/student';

class BatchService {
  async fetchAllBatches() {
    return await Batch.find();
  }

  async fetchStudentsByBatchId(batchId: string) {
    return await Student.find({ batchId });
  }
}

export default new BatchService();