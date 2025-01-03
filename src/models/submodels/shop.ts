import MySQL from "../../db/db.js";
import Request from "../../request/Request.js";
import RequestRequired from "../../request-required-wrapper/RequestRequired.js";
import { ResultSetHeader } from "mysql2";

class ShopModel extends RequestRequired {

  protected db: typeof MySQL

  constructor(dbInstance: typeof MySQL) {
    super()
    this.db = dbInstance
  }

  async getAll(request: Request): Promise<Request> {
    const q = ``
    const result = await this.db.query(q)
    request.setData(result[0])
    return request
  }

  async getById(request: Request): Promise<Request> {
    const data = request.getData()
    const q = ``
    const result = await this.db.query(q)
    request.setData(result)
    return request
  }

  async create(request: Request): Promise<Request> {
    const data = request.getData()
    const q = ``
    const result = await this.db.query(q) as ResultSetHeader[]
    request.setData(result[0].insertId)
    return request
  }

  async update(request: Request): Promise<Request> {
    const data = request.getData()
    const q = ``
    const result = await this.db.query(q)
    request.setData(result)
    return request
  }

  async delete(request: Request): Promise<Request> {
    const data = request.getData()
    const q = ``
    const result = await this.db.query(q)
    request.setData(result)
    return request
  }
}

export default ShopModel