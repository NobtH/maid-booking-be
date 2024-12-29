import express from 'express';
import { getMaidById } from '~/controllers/maidController';

const maidRouter = express.Router();

// Lấy chi tiết một Maid theo ID
maidRouter.get('/maids/:id', getMaidById);

export default maidRouter;
