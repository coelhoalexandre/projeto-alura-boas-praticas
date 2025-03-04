import {
  LogErrorMongoRepository,
  TaskMongoRepository,
  DbUpdateTask,
} from '../../dataSources';
import { UpdateTaskController } from '../controllers/task/updateTask';
import { LogErrorControllerDecorator } from '../decorators/logErrorControllerDecorator';
import { Controller } from '../interfaces/';
import { RequiredFieldsValidation } from '../validations/requiredFieldsValidation';

export const updateTaskControllerFactory = (): Controller => {
  const taskMongoRepository = new TaskMongoRepository();
  const dbUpdateTask = new DbUpdateTask(taskMongoRepository);
  const taskController = new UpdateTaskController(
    dbUpdateTask,
    new RequiredFieldsValidation('id')
  );
  const logMongoRepository = new LogErrorMongoRepository();
  return new LogErrorControllerDecorator(taskController, logMongoRepository);
};
