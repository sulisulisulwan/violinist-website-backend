import MySQL from "../../db/db.js";
import Request from "../../request/Request.js";
import RequestRequired from "../../request-required-wrapper/RequestRequired.js";

class PhotosModel extends RequestRequired {

  protected db: typeof MySQL

  constructor(dbInstance: typeof MySQL) {
    super()
    this.db = dbInstance
  }

  async getAllPhotoIds(request: Request): Promise<Request> {
    const q = 'SELECT id, originalFileName, photoCred, alt, type FROM photos;'
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

  async getPhotosRecordsByType(request: Request): Promise<Request> {
    const data = request.getData()
    const type = data.type
    const q = `SELECT id, originalFileName, photoCred, alt, type FROM photos WHERE type = '${type}';`
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

  async getPhotosByTag(request: Request): Promise<Request> {
    const data = request.getData()
    const tag = data.tag
    const q1 = `SELECT id FROM tags WHERE tagname = '${tag}';`
    const results1 = await this.db.query(q1) as any
    // const q2 = `SELECT photo_asset_id FROM tag_mapping WHERE tagname = '${tag}';`
    if (!results1[0].length) {
      request.setData(null)
      return request
    } 

    const tagId = results1[0][0].id
    const q2 = `SELECT * from tag_mapping WHERE tag_id = ${tagId};`
    const results2 = await this.db.query(q2) as any
    const mediaAssetsWithTag = results2[0]
    request.setData(mediaAssetsWithTag)
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
        originalCroppedFileName,
        type
      ) 
      VALUES (
        '${data.src}',
        '${data.croppedSrc}',
        '${data.photoCred}',
        '${data.originalFileName}',
        '${data.originalCroppedFileName}',
        '${data.type}'
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