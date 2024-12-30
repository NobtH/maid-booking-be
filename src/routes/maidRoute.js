import express from 'express';
import { getMaidById, getAllMaids } from '~/controllers/maidController';

const maidRouter = express.Router();

maidRouter.get('/maids', getAllMaids);
maidRouter.get('/maids/:id', getMaidById);

export default maidRouter;
