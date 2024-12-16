import express from 'express'
import generateRequest from "../generateRequest.js";

import GetBlog from "./BlogGet.js";
import PostBlog from "./BlogPost.js";
import PatchBlog from './BlogPatch.js';
import DeleteBlog from './BlogDelete.js';

import { masterModelSingleton } from '../../models/index.js'
import TransformBlog from "../../transformers/TransformBlog.js";

const blogRoute = express.Router()
const blogTransformer = new TransformBlog()

const getBlog = new GetBlog(masterModelSingleton, blogTransformer)
const postBlog = new PostBlog(masterModelSingleton)
const patchBlog = new PatchBlog(masterModelSingleton)
const deleteBlog = new DeleteBlog(masterModelSingleton)

blogRoute
  .get('/', generateRequest, async (req, res) => await getBlog.exec(req, res))
  .post('/', generateRequest, blogTransformer.transformPost, async(req, res) => await postBlog.exec(req, res))
  .patch('/', generateRequest, blogTransformer.transformPatch, async (req, res) => await patchBlog.exec(req, res))
  .delete('/', generateRequest, async (req, res) => await deleteBlog.exec(req, res))
export default blogRoute