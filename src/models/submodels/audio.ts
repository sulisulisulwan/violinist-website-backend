import MySQL from "../../db/db.js";
import Request from "../../request/Request.js";
import RequestRequired from "../../request-required-wrapper/RequestRequired.js";

class AudioModel extends RequestRequired {

  protected db: typeof MySQL

  constructor(dbInstance: typeof MySQL) {
    super()
    this.db = dbInstance
  }

  async getAllAudioTrackRecords(request: Request): Promise<Request> {
    const q = `SELECT * FROM audioTracks`
    const result = await this.db.query(q)
    request.setData(result)
    return request
  }

  async getAudioTrackRecordById(request: Request): Promise<Request> {
    const data = request.getData()
    const q = `SELECT * FROM audioTracks WHERE id = ${data.id}`
    const result = await this.db.query(q)
    request.setData(result)
    return request
  }

  async createAudioTrackRecord(request: Request): Promise<Request> {
    const data = request.getData()
    const q = `INSERT INTO audioTracks (src, author, title, originalFileName) VALUES ('${data.src}', '${data.author}', '${data.title}', '${data.originalFileName}')`
    const result = await this.db.query(q)
    request.setData(result)
    return request
  }

  async updateAudioTrackRecordById(request: Request): Promise<Request> {
    const data = request.getData()
    const q = `UPDATE audioTracks SET author = '${data.author}', title = '${data.title}' WHERE id = ${data.id}`
    const result = await this.db.query(q)
    request.setData(result)
    return request
  }

  async deleteAudioTrackRecordById(request: Request): Promise<Request> {
    const data = request.getData()
    const q = `DELETE FROM audioTracks WHERE id = ${data.id}`
    const result = await this.db.query(q)
    request.setData(result)
    return request
  }

  /******************
   *    PLAYLISTS
   ******************/

  async getAllPlaylists(request: Request): Promise<Request> {
    const data = request.getData()
    const q = `SELECT * FROM playlists`
    const result = await this.db.query(q)
    request.setData(result[0])
    return request
  }

  async getPlaylistById(request: Request): Promise<Request> {
    const data = request.getData()
    const q = `SELECT * FROM playlists WHERE id=${data.id}`
    const result = await this.db.query(q)
    request.setData(result[0])
    return request
  }

  async createPlaylist(request: Request): Promise<Request> {
    const data = request.getData()
    const q = `INSERT INTO playlists (name) VALUES ('${data.name}')`
    const result = await this.db.query(q)
    request.setData(result)
    return request
  }

  async updatePlaylistById(request: Request): Promise<Request> {
    const data = request.getData()
    const q = `UPDATE playlists SET name = '${data.name}' WHERE id=${data.id}`
    const result = await this.db.query(q)
    request.setData(result)
    return request
  }

  async deletePlaylistByID(request: Request): Promise<Request> {
    const data = request.getData()
    const q = `DELETE FROM playlists WHERE id = ${data.id}`
    const result = await this.db.query(q)
    request.setData(result)
    return request
  }

  /** PLAYLIST TRACKS!! */
  
  async getAllPlaylistTracksByPlaylistId(request: Request): Promise<Request> {
    const data = request.getData()
    const q = `SELECT * FROM playlistTracks WHERE playlistId = ${data.playlistId} ORDER BY position`
    const result = await this.db.query(q)
    request.setData(result[0])
    return request
  }

  async getPlaylistTrackById(request: Request): Promise<Request>{
    const data = request.getData()
    const q = `SELECT * FROM playlistTracks WHERE id = ${data.id}`
    const result = await this.db.query(q)
    request.setData(result)
    return request
  }
  
  async createPlaylistTrack(request: Request): Promise<Request> {
    const data = request.getData()
    const q = `INSERT INTO playlistTracks (audioTrackId, playlistId, position) VALUES (${data.audioTrackId}, ${data.playlistId}, ${data.position})`
    const result = await this.db.query(q)
    request.setData(result)
    return request
  }

  async updatePlaylistTrackPositions(request: Request): Promise<Request> {
    const data = request.getData()
    const q = `UPDATE playlistTracks SET position = ${data.position} WHERE id = ${data.id}`
    const result = await this.db.query(q)
    request.setData(result)
    return request
  }

  async deletePlaylistTrack(request: Request): Promise<Request> {
    const data = request.getData()
    const q = `DELETE FROM playlistTracks WHERE id = ${data.id}`
    const result = await this.db.query(q)
    request.setData(result)
    return request
  }


}

export default AudioModel