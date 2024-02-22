import MySQL from "../db/db";
import { prepareStringForMySQL } from "./utils";
import Request from "../Request";
import RequestRequired from "../request-required-wrapper/RequestRequired";
import { BiographyItemMYSQL } from 'suli-violin-website-types/src'

class BioModel extends RequestRequired{

  protected db: MySQL

  constructor(dbInstance: MySQL) {
    super()
    this.db = dbInstance
  }

  async getAll(request: Request): Promise<Request> {
    const q = 'SELECT * FROM bio;'
    const results = await this.db.query(q)
    request.setData(results[0] as BiographyItemMYSQL[])
    return request
  }

  async getPaginated(request: Request): Promise<Request> {
    const data = request.getData()
    const limit = data.limit
    const q = `SELECT * FROM bio LIMIT ${limit};`
    const results = await this.db.query(q)
    request.setData(results[0] as BiographyItemMYSQL[])
    return request
  }

  async getById(request: Request): Promise<Request> {
    const data = request.getData()
    const id = data.id
    const q = `SELECT * FROM bio WHERE id=${id};`
    const results = await this.db.query(q)
    request.setData(results[0] as BiographyItemMYSQL[])
    return request
  }

  async getByName(request: Request): Promise<Request> {
    const data = request.getData()
    const name = data.name
    const q = `SELECT * FROM bio WHERE name='${name}'`
    const results = await this.db.query(q)
    request.setData(results[0] as BiographyItemMYSQL[])
    return request
  }

  async getLongForm(request: Request): Promise<Request> {
    const q = 'SELECT * FROM bio WHERE id = (SELECT bioId FROM longFormBio WHERE id = 1)'
    const results = await this.db.query(q)
    request.setData(results[0] as BiographyItemMYSQL[])
    return request
  }
  
  async getLongFormId(request: Request): Promise<Request> {
    const q = 'SELECT * FROM longFormBio WHERE id = 1'
    const results = await this.db.query(q)
    request.setData(results)
    return request
  }

  async updateLongFormById(request: Request): Promise<Request> {
    const data = request.getData()
    const id = data.id
    const q = `UPDATE longFormBio SET bioId = ${id === null ? 'NULL' : id} WHERE id = 1`
    const results = await this.db.query(q)
    request.setData(results)
    return request
  }
  async getShortForm(request: Request): Promise<Request> {
    const q = 'SELECT * FROM bio WHERE id = (SELECT bioId FROM shortFormBio WHERE id = 1)'
    const results = await this.db.query(q)
    request.setData(results[0] as BiographyItemMYSQL[])
    return request
  }
  
  async getShortFormId(request: Request): Promise<Request> {
    const q = 'SELECT * FROM shortFormBio WHERE id = 1'
    const results = await this.db.query(q)
    request.setData(results)
    return request
  }

  async updateShortFormById(request: Request): Promise<Request> {
    const data = request.getData()
    const id = data.id
    const q = `UPDATE shortFormBio SET bioId = ${id === null ? 'NULL' : id} WHERE id = 1`
    const results = await this.db.query(q)
    request.setData(results)
    return request
  }
  
  async updateById(request: Request): Promise<Request> {
    const data = request.getData()
    const q = `UPDATE bio SET name = '${prepareStringForMySQL(data.name)}', components = '${prepareStringForMySQL(data.components)}' WHERE id = ${data.id}`
    const results = await this.db.query(q)
    request.setData(results)
    return request
  }

  async create(request: Request): Promise<Request> {
    const data = request.getData()
    const q = `INSERT INTO bio (name, components) VALUES ('${prepareStringForMySQL(data.name)}', '${prepareStringForMySQL(data.components)}');`
    const result = await this.db.query(q)
    request.setData(result[0])
    return request
  }

  async deleteById(request: Request): Promise<Request> {
    const data = request.getData()
    const id = data.id
    const q = `DELETE FROM bio WHERE id = ${id}`
    const result = await this.db.query(q)
    request.setData(result)
    return request
  }
}

export default BioModel