import { Task } from '../../entities/task';
import { DbListTasks } from './dbListTasks';
import { ListTasksRepository } from '../../usecases/';

const exampleListTasks = [
  {
    id: 'any_title',
    title: 'any_title',
    description: 'any_description',
    date: '30/06/2024',
  },
  {
    id: 'order_title',
    title: 'order_title',
    description: 'order_description',
    date: '30/06/2024',
  },
];

const makeFakeTasks = (): Task[] => {
  return exampleListTasks;
};

const makeListTasksRepository = (): ListTasksRepository => {
  class ListTasksRepositoryStub implements ListTasksRepository {
    async list(): Promise<Task[]> {
      return Promise.resolve(makeFakeTasks());
    }
  }

  return new ListTasksRepositoryStub();
};

interface SutTypes {
  sut: DbListTasks;
  listTasksRepositoryStub: ListTasksRepository;
}

const makeSut = (): SutTypes => {
  const listTasksRepositoryStub = makeListTasksRepository();
  const sut = new DbListTasks(listTasksRepositoryStub);
  return { sut, listTasksRepositoryStub };
};

describe('DbListTasks', () => {
  test('Deve chamar ListTaskRepository', async () => {
    const { sut, listTasksRepositoryStub } = makeSut();
    const listSpy = jest.spyOn(listTasksRepositoryStub, 'list');
    await sut.list();
    expect(listSpy).toHaveBeenCalled();
  });

  test('Deve retornar tarefas em caso de sucesso', async () => {
    const { sut } = makeSut();
    const tasks = await sut.list();

    expect(tasks).toEqual(makeFakeTasks());
  });

  test('Deve lançar um erro se LisTasksRepository lançar um erro', async () => {
    const { sut, listTasksRepositoryStub } = makeSut();
    jest
      .spyOn(listTasksRepositoryStub, 'list')
      .mockReturnValueOnce(Promise.reject(new Error()));
    const promise = sut.list();
    await expect(promise).rejects.toThrow();
  });
});
