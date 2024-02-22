import * as express from 'express'

import BlogModel from '../../models/blog'
import Request from '../../Request'

import MySQL from '../../db/db'
import config from '../../db/config'

import { createMySqlDatetimeOfNow, getDoubleQuotesEscapedString } from '../utils'
import { BlogItemAPI, BlogItemMYSQL, ParsedHTMLComponent } from 'suli-violin-website-types/src'

const blogModel = new BlogModel(new MySQL(config))
const BlogRoute = express.Router()

BlogRoute.get('/', async(req, res) => {
  console.log('[GET]/blog/')
  let request = new Request()

  try {
    const result = (await blogModel.getAllBlogEntries(request)).getData()

    const parsedResults: BlogItemAPI = result[0].map((blog: BlogItemMYSQL) => {
      return {
        title: blog.title,
        components: JSON.parse(blog.components).map(((component: ParsedHTMLComponent) => {
          return {
            type: component.type,
            content: component.content
          }
        })),
        dateCreated: blog.dateCreated,
        dateLastModified: blog.dateLastModified,
      }
    })


    const resData = {
      results: parsedResults
    }

    res.status(200).json(resData)
  } catch(request) {
    console.error(request)
  }
})

BlogRoute.post('/', async(req, res) => {
  console.log('[POST]/blog/')
  let request = new Request()

  const { title, components } = req.body 

  const doubleQuotesEscapedComponents = components.map((component: ParsedHTMLComponent) => { 
    component.content = getDoubleQuotesEscapedString(component.content)
    return component
  })

  const dateCreated = createMySqlDatetimeOfNow()

  const data = {
    title,
    components: JSON.stringify(doubleQuotesEscapedComponents),
    dateCreated,
    dateLastModified: dateCreated
  }

  request.setData(data)

  try {
    const insertId = (await blogModel.createBlogEntry(request)).getData()[0].insertId
    res.status(201).json({ insertId })
  } catch(request) {
    console.log(request)
    res.sendStatus(400)
  }
})

BlogRoute.patch('/', async(req, res) => {
  console.log('[PATCH]/blog/')
  let request = new Request()

  const { id, title, components } = req.body 
    
  const doubleQuotesEscapedComponents = components.map((component: ParsedHTMLComponent) => { 
    component.content = getDoubleQuotesEscapedString(component.content)
    return component
  })
  
  const dateModified = createMySqlDatetimeOfNow()
  const data = {
    id,
    title,
    components: JSON.stringify(doubleQuotesEscapedComponents),
    dateLastModified: dateModified
  }

  request.setData(data)

  try {
    const result = (await blogModel.updateBlogEntryById(request)).getData()
    res.status(200).json(result[0])
  } catch(request) {
    console.error(request)
  }
})

BlogRoute.delete('/', async(req, res) => {
  console.log('[DELETE]/blog/')
  let request = new Request()
  const { id } = req.query
  request.setData({ id })

  try {
    const result = (await blogModel.deleteBlogEntryById(request)).getData()
    res.sendStatus(204)
  } catch(request) {
    console.error(request.getError())
  }
})

export default BlogRoute