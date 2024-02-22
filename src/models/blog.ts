import MySQL from "../db/db";
import Request from "../Request";
import RequestRequired from "../request-required-wrapper/RequestRequired";

class BlogModel extends RequestRequired {

  protected db: MySQL

  constructor(dbInstance: MySQL) {
    super()
    this.db = dbInstance
  }

  async getAllBlogEntries(request: Request): Promise<Request> {
    const q = `SELECT * FROM blogs`
    const result = await this.db.query(q)
    request.setData(result)
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
    const q = `INSERT INTO blogs (title, components, dateCreated, dateLastModified) VALUES ('${data.title}', '${data.components}', '${data.dateCreated}', '${data.dateLastModified}')`
    const result = await this.db.query(q)
    request.setData(result)
    return request
  }

  async updateBlogEntryById(request: Request): Promise<Request> {
    const data = request.getData()
    const q = `UPDATE blogs SET title = '${data.title}', components = '${data.components}', dateLastModified = '${data.dateLastModified}' WHERE id = ${data.id}`
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