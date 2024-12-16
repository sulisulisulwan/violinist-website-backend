import BaseRoute from "../BaseRoute.js";
import { MasterModel } from "../../models/index.js";
import { Request as ExpressRequest, Response as ExpressResponse } from "express-serve-static-core";

import Request from "../../request/Request.js";
import { BlogItemAPI, BlogItemMYSQL } from "suli-violin-website-types/src/index.js";
import TransformBlog from "../../transformers/TransformBlog.js";


export default class GetBlog extends BaseRoute {

  protected model: MasterModel
  protected transformer: TransformBlog
  
  constructor(model: MasterModel, transformer: TransformBlog) {
    super()
    this.model = model
    this.transformer = transformer
    this.exec = this.exec.bind(this)
  }

  async exec(req: ExpressRequest, res: ExpressResponse) {
    const request = (req as any).requestObj as Request
    try {
      const dbResult: BlogItemMYSQL[] = (await this.model.blog.getAllBlogEntries(request)).getData()
      const transformedResults: BlogItemAPI[] = dbResult.map(this.transformer.transformGet)
      res.status(200).json({ results: transformedResults })
    } catch(e) {
      (req as any).logger.log(e.stack)
      res.sendStatus(400)
    }
  }
}