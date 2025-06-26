import MySQL from "../../db/db.js";
import Request from "../../request/Request.js";
import RequestRequired from "../../request-required-wrapper/RequestRequired.js";
import { ResultSetHeader } from "mysql2";
import { prepareStringForMySQL } from "../utils.js";


class ProgramsModel extends RequestRequired {

  // protected db: typeof MySQL
  protected db: any

  constructor(dbInstance: typeof MySQL) {
    super()
    this.db = dbInstance
  }

  async getAllPrograms(request: Request): Promise<Request> {
    const data = this.db.getData()
    this.db.getData()
    request.setData(data)
    // const q = `SELECT * FROM blogs`
    // const result = await this.db.query(q)
    // request.setData(result[0])
    return request
  }
  
  async getProgramById(request: Request): Promise<Request> {
    const { id } = request.getData()
    const data = this.db.getDataById(id)
    request.setData(data)
    // const q = `SELECT * FROM blogs WHERE id = ${data.id}`
    // const result = await this.db.query(q)
    // request.setData(result)
    return request
  }

  async createProgram(request: Request): Promise<Request> {
    const data = request.getData()
    this.db.postData(data)
    request.setData(data)
    // const q = `INSERT INTO blogs (title, components, dateCreated, dateLastModified) VALUES ('${prepareStringForMySQL(data.title)}', '${prepareStringForMySQL(data.components)}', '${data.dateCreated}', '${data.dateLastModified}')`
    // const result = await this.db.query(q) as ResultSetHeader[]
    // request.setData(result[0].insertId)
    return request
  }

  async updateProgramById(request: Request): Promise<Request> {
    const data = request.getData()
    this.db.patchData(data)
    // const q = `UPDATE blogs SET title = '${prepareStringForMySQL(data.title)}', components = '${prepareStringForMySQL(data.components)}', dateLastModified = '${data.dateLastModified}' WHERE id = ${data.id}`
    // const result = await this.db.query(q)
    return request
  }
  
  async deleteProgramById(request: Request): Promise<Request> {
    const data = request.getData()
    this.db.deleteData(data)
    // const q = `DELETE FROM programs WHERE id = ${data.id}`
    // const result = await this.db.query(q)
    return request
  }
}




export default ProgramsModel