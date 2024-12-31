import express from 'express'
import { getMaidById, getAllMaids, getTopMaids, searchMaidsByName } from '~/controllers/maidController'

const maidRouter = express.Router()

maidRouter.get('/maids', getAllMaids)

maidRouter.get('/maids/top', getTopMaids)

maidRouter.get('/maids/search', searchMaidsByName)

maidRouter.get('/maids/:id', getMaidById)

export default maidRouter
