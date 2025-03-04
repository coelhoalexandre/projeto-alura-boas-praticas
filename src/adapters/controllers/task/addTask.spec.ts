import { Task } from '../../../entities/task';
import { AddTask, AddTaskModel } from '../../../usecases';
import { HttpRequest, Validation } from '../../interfaces';
import { serverError } from '../../presentations/api/httpResponses/httpResponses';
import { AddTaskController } from './addTask';

const exampleTask = {
  title: 'any_title',
  description: 'any_description',
  date: '30/06/2024',
};

const makeAddTask = (): AddTask => {
  class AddTaskStub implements AddTask {
    async add(task: AddTaskModel): Promise<Task> {
      return Promise.resolve({ ...exampleTask, id: 'any_id' });
    }
  }

  return new AddTaskStub();
};

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(data: any): Error | void {
      return;
    }
  }

  return new ValidationStub();
};

interface SutTypes {
  addTaskSub: AddTask;
  validationStub: Validation;
  sut: AddTaskController;
}

const makeSut = (): SutTypes => {
  const addTaskSub = makeAddTask();
  const validationStub = makeValidation();
  const sut = new AddTaskController(addTaskSub, validationStub);

  return {
    addTaskSub,
    validationStub,
    sut,
  };
};

const makeFakeRequest = (): HttpRequest => {
  return { body: exampleTask };
};

describe('AddTask Controller', () => {
  test('Deve chamar AddTask com valores corretos', async () => {
    const { sut, addTaskSub } = makeSut();

    const addSpy = jest.spyOn(addTaskSub, 'add');

    await sut.handle(makeFakeRequest());

    expect(addSpy).toHaveBeenCalledWith(exampleTask);
  });

  it('Deve retornar 500 se AddTask lançar uma exceção', async () => {
    const { sut, addTaskSub } = makeSut();
    jest
      .spyOn(addTaskSub, 'add')
      .mockImplementationOnce(async () => Promise.reject(new Error()));

    const httpResponse = await sut.handle(makeFakeRequest());

    expect(httpResponse).toEqual(serverError(new Error()));
  });
  it('Deve chamar Validation com valores corretos', async () => {
    const { sut, validationStub } = makeSut();

    const validateSpy = jest.spyOn(validationStub, 'validate');

    const httpRequest = makeFakeRequest();

    await sut.handle(httpRequest);

    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body);
  });
});
