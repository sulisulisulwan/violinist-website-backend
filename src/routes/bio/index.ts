import express from 'express'
import generateRequest from "../generateRequest.js";

import GetBio from "./BioGet.js";
import PostBio from "./BioPost.js";
import PatchBio from './BioPatch.js';
import DeleteBio from './BioDelete.js';

import GetLongFormBio from "./longForm/LongFormBioGet.js";
import PatchLongFormBio from './longForm/LongFormBioPatch.js';

import GetShortFormBio from "./shortForm/ShortFormBioGet.js";
import PatchShortFormBio from './shortForm/ShortFormBioPatch.js';

import { masterModelSingleton } from '../../models/index.js'
import TransformBio from "../../transformers/TransformBio.js";

const bioRoute = express.Router()
const transformBio = new TransformBio()

const getBio = new GetBio(masterModelSingleton, transformBio)
const postBio = new PostBio(masterModelSingleton)
const patchBio = new PatchBio(masterModelSingleton)
const deleteBio = new DeleteBio(masterModelSingleton)

const getLongFormBio = new GetLongFormBio(masterModelSingleton, transformBio)
const patchLongFormBio = new PatchLongFormBio(masterModelSingleton)

const getShortFormBio = new GetShortFormBio(masterModelSingleton, transformBio)
const patchShortFormBio = new PatchShortFormBio(masterModelSingleton)

bioRoute
  .get('/', generateRequest, async (req, res) => await getBio.exec(req, res))
  .post('/', generateRequest, transformBio.transformPost, async (req, res) => await postBio.exec(req, res))
  .patch('/', generateRequest, transformBio.transformPatch, async (req, res) => await patchBio.exec(req, res))
  .delete('/', generateRequest, async (req, res) => await deleteBio.exec(req, res))

  .get('/longForm', generateRequest, async (req, res) => await getLongFormBio.exec(req, res))
  .patch('/longForm', generateRequest, async (req, res) => await patchLongFormBio.exec(req, res))
  
  .get('/shortForm', generateRequest, async (req, res) => await getShortFormBio.exec(req, res))
  .patch('/shortForm', generateRequest, async (req, res) => await patchShortFormBio.exec(req, res))

  
export default bioRoute