import MySQL from "../db/db.js";
import Request from "../Request.js";
import RequestRequired from "../request-required-wrapper/RequestRequired.js";

class VideosModel extends RequestRequired {

  protected db: MySQL

  constructor(dbInstance: MySQL) {
    super()
    this.db = dbInstance
  }
  
  async getAllVideos(request: Request): Promise<Request> {
    const data = request.getData()
    const q = 'SELECT * FROM videos;'
    const results = await this.db.query(q)
    request.setData(results)
    return request
  }
  
  async getVideoThumbnailById(request: Request): Promise<Request> {
    const data = request.getData()
    const q = `SELECT thumbnail FROM videos WHERE id = ${data.id}`
    const results = await this.db.query(q)
    request.setData(results)
    return request
  }

  async createVideo(request: Request): Promise<Request> {
    const data = request.getData()
    const q = `INSERT INTO videos (youtubeCode, thumbnail, caption) VALUES ('${data.youtubeCode}', '${data.thumbnail}', '${data.caption}');`
    const result = await this.db.query(q)
    request.setData(result)
    return request
  }

  async updateVideosRecordById(request: Request): Promise<Request> {
    const data = request.getData()

    const youtubeCode = data.youtubeCode ? `youtubeCode = '${data.youtubeCode}'`: ``
    const thumbnail = data.thumbnail ? `thumbnail = '${data.thumbnail}'`: ``
    const caption = data.caption ? `caption = '${data.caption}'`: ``

    const values = [youtubeCode, thumbnail, caption]

    let baseQuery = 'UPDATE videos SET '
    let addedFirstValue = false

    for (let value of values) {
      
      if (value) {
        if (addedFirstValue) {
          baseQuery += ', '
        }
        baseQuery += value
        addedFirstValue = true
      }

    }

    const result = await this.db.query(baseQuery)
    request.setData(result)
    return request
  }
  
  async deleteVideoById(request: Request): Promise<Request> {
    const data = request.getData()
    const q = `DELETE FROM videos WHERE id = ${data.id}`
    const result = await this.db.query(q)
    request.setData(result)
    return request
  }
}

export default VideosModel