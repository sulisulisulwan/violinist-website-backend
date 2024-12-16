import express from 'express'
import generateRequest from "../generateRequest.js";

import GetCalendar from "./CalendarGet.js";
import PostCalendar from "./CalendarPost.js";
import PatchCalendar from './CalendarPatch.js';
import DeleteCalendar from './CalendarDelete.js';

import { masterModelSingleton } from '../../models/index.js'
import TransformCalendar from "../../transformers/TransformCalendar.js";

const calendarRoute = express.Router()
const calendarTransformer = new TransformCalendar()

const getCalendar = new GetCalendar(masterModelSingleton, calendarTransformer)
const postCalendar = new PostCalendar(masterModelSingleton)
const patchCalendar = new PatchCalendar(masterModelSingleton)
const deleteCalendar = new DeleteCalendar(masterModelSingleton)

calendarRoute
  .get('/', generateRequest, async (req, res) => await getCalendar.exec(req, res))
  .post('/', generateRequest, async(req, res) => await postCalendar.exec(req, res))
  .patch('/', generateRequest, async (req, res) => await patchCalendar.exec(req, res))
  .delete('/', generateRequest, async (req, res) => await deleteCalendar.exec(req, res))
  
export default calendarRoute