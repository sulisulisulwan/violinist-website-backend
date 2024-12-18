import MySQL from "../../db/db.js";
import Request from "../../request/Request.js";
import RequestRequired from "../../request-required-wrapper/RequestRequired.js";
import { ResultSetHeader } from "mysql2";
import { prepareStringForMySQL } from "../utils.js";

class BlogModel extends RequestRequired {

  protected db: typeof MySQL

  constructor(dbInstance: typeof MySQL) {
    super()
    this.db = dbInstance
  }

  async getAllBlogEntries(request: Request): Promise<Request> {
    const q = `SELECT * FROM blogs`
    const result = await this.db.query(q)
    request.setData(result[0])
    return request
  }

  async getBlogEntryById(request: Request): Promise<Request> {
    const data = request.getData()
    const q = `SELECT * FROM blogs WHERE id = ${data.id}`
    const result = await this.db.query(q)
    request.setData(result)
    return request
  }

  async createBlogEntry(request: Request): Promise<Request> {
    const data = request.getData()
    const q = `INSERT INTO blogs (title, components, dateCreated, dateLastModified) VALUES ('${prepareStringForMySQL(data.title)}', '${prepareStringForMySQL(data.components)}', '${data.dateCreated}', '${data.dateLastModified}')`
    const result = await this.db.query(q) as ResultSetHeader[]
    request.setData(result[0].insertId)
    return request
  }

  async updateBlogEntryById(request: Request): Promise<Request> {
    const data = request.getData()
    
    const q = `UPDATE blogs SET title = '${prepareStringForMySQL(data.title)}', components = '${prepareStringForMySQL(data.components)}', dateLastModified = '${data.dateLastModified}' WHERE id = ${data.id}`
    const result = await this.db.query(q)
    request.setData(result)
    return request
  }

  async deleteBlogEntryById(request: Request): Promise<Request> {
    const data = request.getData()
    const q = `DELETE FROM blogs WHERE id = ${data.id}`
    const result = await this.db.query(q)
    request.setData(result)
    return request
  }
}

export default BlogModel