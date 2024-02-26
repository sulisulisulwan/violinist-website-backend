import MySQL from "../db/db.js";
import Request from "../Request.js";
import RequestRequired from "../request-required-wrapper/RequestRequired.js";

class PhotosModel extends RequestRequired {

  protected db: MySQL

  constructor(dbInstance: MySQL) {
    super()
    this.db = dbInstance
  }

  async getAllPhotoIds(request: Request): Promise<Request> {
    const q = 'SELECT id, originalFileName, photoCred FROM photos;'
    const results = await this.db.query(q)
    request.setData(results)
    return request
  }
  
  async getPhotosRecordById(request: Request): Promise<Request> {
    const data = request.getData()
    const id = data.id
    const q = `SELECT * FROM photos WHERE id = ${id};`
    const results = await this.db.query(q)
    request.setData(results)
    return request
  }

  async getPhotoFileNameById(request: Request): Promise<Request> {
    const data = request.getData()
    const id = data.id
    const q = `SELECT fileName FROM photos WHERE id = ${id};`
    const results = await this.db.query(q)
    request.setData(results)
    return request
  }

  async createPhoto(request: Request): Promise<Request> {
    const data = request.getData()
    const q = `
      INSERT INTO photos (
        src,
        croppedSrc,
        photoCred,
        originalFileName,
        originalCroppedFileName
      ) 
      VALUES (
        '${data.src}',
        '${data.croppedSrc}',
        '${data.photoCred}',
        '${data.originalFileName}',
        '${data.originalCroppedFileName}'
      );`
    const result = await this.db.query(q)
    request.setData(result)
    return request
  }

  async updatePhotosRecordById(request: Request): Promise<Request> {
    const data = request.getData()

    const q = `UPDATE photos SET photoCred = '${data.photoCred}' WHERE id = ${data.id}`
    const result = await this.db.query(q)
    request.setData(result)
    return request
  }

  async deletePhotosRecordById(request: Request): Promise<Request> {
    const data = request.getData()
    const q = `DELETE FROM photos WHERE id = ${data.id}`
    const result = await this.db.query(q)
    request.setData(result)
    return request
  }
  
}

export default PhotosModel