import { Router } from 'express';
import { expressRouteAdapter } from '../../../expressRouteAdapter';
import {
  addTaskControllerFactory,
  deleteTaskControllerFactory,
  listTasksControllerFactory,
  updateTaskControllerFactory,
} from '../../../factories';

export default (router: Router): void => {
  router.post('/tasks', expressRouteAdapter(addTaskControllerFactory()));
  router.get('/tasks', expressRouteAdapter(listTasksControllerFactory()));
  router.put('/tasks', expressRouteAdapter(updateTaskControllerFactory()));
  router.delete('/tasks', expressRouteAdapter(deleteTaskControllerFactory()));
};
