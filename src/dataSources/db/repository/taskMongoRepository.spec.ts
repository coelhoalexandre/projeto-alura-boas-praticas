import { ObjectId } from 'mongodb';
import { UpdateTaskModel } from '../../../usecases';
import { MongoManager } from '../../config/mongoManager';
import { TaskMongoRepository } from './taskMongoRepository';
import {
  InvalidParamError,
  NotFoundError,
} from '../../../adapters/presentations/api/errors';

const taskExample = {
  title: 'any_title',
  description: 'any_description',
  date: '30/06/2024',
};

const oldTaskExample = {
  title: 'old_title',
  description: 'old_description',
  date: 'old_date',
};

const newTaskExample = {
  title: 'new_title',
  description: 'new_description',
  date: 'new_date',
};

const makeSut = (): TaskMongoRepository => {
  return new TaskMongoRepository();
};

describe('TaskMongoRepository', () => {
  const client = MongoManager.getInstance();

  beforeAll(async () => {
    await client.connect(process.env.MONGO_URL as string);
  });

  afterAll(async () => {
    await client.disconnect();
  });

  beforeEach(async () => {
    await client.getCollection('tasks').deleteMany({});
  });

  test('Deve retornar a tarefa em caso de sucesso', async () => {
    const sut = makeSut();
    await sut.add(taskExample);

    const tasks = await sut.list();

    expect(tasks[0].id).toBeTruthy();
    expect(tasks[0].date).toBe(taskExample.date);
    expect(tasks[0].description).toBe(taskExample.description);
    expect(tasks[0].title).toBe(taskExample.title);
    expect(tasks.length).toBe(1);
  });

  test('Deve atualizar tarefa com sucesso', async () => {
    const sut = makeSut();
    const task = await sut.add(oldTaskExample);

    const updateData: UpdateTaskModel = {
      ...newTaskExample,
      id: task.id,
    };

    await sut.update(updateData);

    const updatedTask = await client
      .getCollection('tasks')
      .findOne({ _id: new ObjectId(task.id) });

    expect(updatedTask).toBeTruthy();
    expect(updatedTask?.title).toBe(newTaskExample.title);
    expect(updatedTask?.description).toBe(newTaskExample.description);
    expect(updatedTask?.date).toBe(newTaskExample.date);
  });

  test('Deve retornar InvalidParamError se o ID da tarefa for inválido', async () => {
    const sut = makeSut();
    const invalidId = 'invalid_id';
    const updateData: UpdateTaskModel = {
      ...newTaskExample,
      id: invalidId,
    };

    const error = await sut.update(updateData);

    expect(error).toEqual(new InvalidParamError(invalidId));
  });

  test('Deve retornar NotFoundError se nenhuma tarefa for encontrada para atualização', async () => {
    const sut = makeSut();
    const updateData: UpdateTaskModel = {
      ...newTaskExample,
      id: new ObjectId().toHexString(),
    };

    const error = await sut.update(updateData);

    expect(error).toEqual(new NotFoundError('task'));
  });
});
