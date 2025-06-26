import express from 'express'
import generateRequest from "../generateRequest.js";

import GetPrograms from "./ProgramsGet.js";
import PostPrograms from './ProgramsPost.js';
import PatchPrograms from './ProgramsPatch.js';
import DeletePrograms from './ProgramsDelete.js';

import { masterModelSingleton } from '../../models/index.js'
// import TransformBlog from "../../transformers/TransformBlog.js";

const programsRoute = express.Router()
// const blogTransformer = new TransformBlog()


const getPrograms = new GetPrograms(masterModelSingleton)
const postPrograms = new PostPrograms(masterModelSingleton)
const patchPrograms = new PatchPrograms(masterModelSingleton)
const deletePrograms = new DeletePrograms(masterModelSingleton)

programsRoute
  .get('/', generateRequest, async (req, res) => await getPrograms.exec(req, res))
  .post('/', generateRequest, async(req, res) => await postPrograms.exec(req, res))
  .patch('/', generateRequest, async (req, res) => await patchPrograms.exec(req, res))
  .delete('/', generateRequest, async (req, res) => await deletePrograms.exec(req, res))
export default programsRoute