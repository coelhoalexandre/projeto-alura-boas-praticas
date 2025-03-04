import { Task } from '../../entities/task';
import { ListTasksRepository } from '../../usecases/';

export class DbListTasks implements ListTasksRepository {
  constructor(private readonly listTasksRepository: ListTasksRepository) {}
  async list(): Promise<Task[]> {
    const tasks = await this.listTasksRepository.list();
    return tasks;
  }
}
