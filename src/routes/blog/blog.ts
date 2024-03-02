import * as express from 'express'

import BlogModel from '../../models/blog.js'

import MySQL from '../../db/db.js'
import Config from '../../config/Config.js'

import { BlogItemAPI, BlogItemMYSQL } from 'suli-violin-website-types/src'
import generateRequest from '../generateRequest.js'
import TransformBlog from '../../transformers/TransformBlog.js'


const config = new Config()
const blogModel = new BlogModel(new MySQL(config.getField('MYSQL_CONFIG')))
const blogRoute = express.Router()
const blogTransformer = new TransformBlog()

blogRoute.get('/', generateRequest, async(req, res) => {
  try {
    let request = (req as any).requestObj
    const dbResult: BlogItemMYSQL[] = (await blogModel.getAllBlogEntries(request)).getData()
    const transformedResults: BlogItemAPI[] = dbResult.map(blogTransformer.transformGet)
    res.status(200).json({ results: transformedResults })
  } catch(e) {
    (req as any).logger.log(e.stack)
    res.sendStatus(400)
  }
})

blogRoute.post('/', generateRequest, blogTransformer.transformPost, async(req, res) => {
  try {
    const request = (req as any).requestObj
    const insertId = (await blogModel.createBlogEntry(request)).getData()
    res.status(201).json({ insertId })
  } catch(e) {
    (req as any).logger.log(e.stack)
    res.sendStatus(400)
  }
})


blogRoute.patch('/', generateRequest, blogTransformer.transformPatch, async(req, res) => {
  try {
    const request = (req as any).requestObj;
    (await blogModel.updateBlogEntryById(request)).getData()
    res.sendStatus(200)
  } catch(e) {
    (req as any).logger.log(e.stack)
    res.sendStatus(400)
  }
})

blogRoute.delete('/', generateRequest, async(req, res) => {
  try {
    const request = (req as any).requestObj
    request.setData({ id: req.query.id })
    (await blogModel.deleteBlogEntryById(request)).getData()
    res.sendStatus(204)
  } catch(e) {
    (req as any).logger.log(e)
    res.sendStatus(400)
  }
})

export default blogRoute