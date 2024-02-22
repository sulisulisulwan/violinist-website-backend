import * as express from 'express'
import AudioModel from '../../../models/audio'
import Request from '../../../Request'
import * as path from 'path'
import * as fs from 'fs/promises'
import UploadHandler from '../../../middleware/multer'
import MySQL from '../../../db/db'
import config from '../../../db/config'
import { PlaylistItemAPI, PlaylistItemMYSQL, PlaylistTrackAPI, PlaylistTrackMYSQL } from 'suli-violin-website-types/src'

const Audio = express.Router()
const audioModel = new AudioModel(new MySQL(config))
const audioUpload = new UploadHandler('audio')

Audio.get('/', async(req, res) => {
  let request = new Request()

  const { id } = req.query

  if (id === undefined) {
    res.sendStatus(400)
    return
  }

  
  request.setData({ id })
  
  try {
    
    const results = (await audioModel.getAudioTrackRecordById(request)).getData()
    
    // Check if audio track record exists in DB
    if (!results[0].length) {
      request.setError('404')
      throw request
    }

    // Check if file path returned from DB exists in file system
    const dir = await fs.readdir(path.resolve(__dirname, '../uploads/audio'))
    const targetFileName = results[0][0].src
    const fileExists = dir.includes(targetFileName)

    if (!fileExists) {
      request.setData({ id })
      await audioModel.deleteAudioTrackRecordById(request)
      request.setError('404')
      throw request
    }

    
    res.status(200).sendFile(path.resolve(__dirname, '../uploads/audio/' + targetFileName))
    
  } catch(request) {
    request instanceof Request ? console.error(request.getError()) : console.error(request)

    if (request.getError().message === '404') {
      res.sendStatus(404)
      return
    }

    res.sendStatus(400)
  }


})

Audio.post('/', audioUpload.single('audio-track'), async(req, res) => {
  console.log('[POST] /media/audio')
  let request = new Request()
  
  const src = req.file.filename
  const { title, author } = req.body

  request.setData({ src, title, author, originalFileName: req.file.originalname })

  try {
    const insertId = (await audioModel.createAudioTrackRecord(request)).getData()[0].insertId
    res.status(201).json({ insertId })
  } catch(request) {
    request instanceof Request ? console.error(request.getError()) : console.error(request)
    res.sendStatus(400)
  }
})

Audio.patch('/', async(req, res) => {
  console.log('[PATCH] /media/audio')
  let request = new Request()
  const { title, author, id } = req.body
  request.setData({ title, author, id })
  
  try {
    (await audioModel.updateAudioTrackRecordById(request)).getData()
    res.sendStatus(201)
  } catch(request) {
    request instanceof Request ? console.error(request.getError()) : console.error(request)
    res.sendStatus(400)
  }
})

Audio.delete('/', async(req, res) => {
  console.log('[DELETE] /media/audio')
  let request = new Request()
  const { id } = req.query
  request.setData({ id })

  try {
    const audioTrackData = (await audioModel.getAudioTrackRecordById(request)).getData()
    const src = audioTrackData[0][0].src
    const filePath = path.resolve(__dirname + '/uploads/audio/', src)
    await fs.unlink(filePath);
    request.setData({ id });
    (await audioModel.deleteAudioTrackRecordById(request)).getData()
    res.sendStatus(204)
  } catch(request) {
    request instanceof Request ? console.error(request.getError()) : console.error(request)
    res.sendStatus(400)
  }
})

Audio.get('/playlists', async(req, res) => {
  console.log('[GET] /media/audio/playlists')
  let request = new Request()

  
  try {
    
    let data: PlaylistItemAPI[] = []
    
    if (req.query.hasOwnProperty('id')) {
      
      request.setData({ id: req.query.id })
      
      const playlistResult: PlaylistItemMYSQL[] = (await audioModel.getPlaylistById(request)).getData()

      if (playlistResult.length) {
        request.setData({ playlistId: req.query.id })
        const playlistTracksResult: PlaylistTrackMYSQL[] = (await audioModel.getAllPlaylistTracksByPlaylistId(request)).getData()
  
        const tracksSorted = playlistTracksResult.sort((a: PlaylistTrackMYSQL, b: PlaylistTrackMYSQL) => {
          return a.position - b.position
        })

        data.push({
          id: playlistResult[0].id,
          name: playlistResult[0].name,
          playlistTracks: tracksSorted
        })
      }
    } else {
      const allPlaylists = (await audioModel.getAllPlaylists(request)).getData()
      if (allPlaylists.length) {
        request.setData({ playlistId: allPlaylists[0].id })

        const playlistTracksResult = (await audioModel.getAllPlaylistTracksByPlaylistId(request)).getData()
        data.push({
          id: allPlaylists[0].id,
          name: allPlaylists[0].name,
          playlistTracks: playlistTracksResult[0] || []
        })
      }
    }

    res.status(200).json(data)

  } catch(e) {
    console.error(e)
    res.sendStatus(400)
  }
})

Audio.post('/playlists', async(req, res) => {
  console.log('[POST] /media/audio/playlists')
  let request = new Request()
  const { name, playlistTracks } = req.body

  try {
    request.setData({ name, playlistTracks })
    const insertId = (await audioModel.createPlaylist(request)).getData()[0].insertId
    
    for (let i = 0; i < playlistTracks.length; i += 1) {
      request.setData({ position: i, playlistId: insertId, audioTrackId: playlistTracks[i].audioTrackId });
      (await audioModel.createPlaylistTrack(request)).getData()
    }

    res.status(201).json({ insertId })
  } catch(e) {
    console.error(e)
    res.sendStatus(400)
  }
})

Audio.patch('/playlists', async(req, res) => {
  console.log('[PATCH] /media/audio/playlists')
  const { id, name, playlistTracks } = req.body
  let request = new Request()
  request.setData({ id, name } )

  try {
    (await audioModel.updatePlaylistById(request)).getData()
    request.setData({ playlistId: id });
    const allTracksInDbForPlaylist: PlaylistTrackMYSQL[] = (await audioModel.getAllPlaylistTracksByPlaylistId(request)).getData()

    const newPlaylistTrackMap = playlistTracks.reduce((map: Record<string, boolean>, track: PlaylistTrackAPI) => {
      map[track.id] = true
      return map
    }, {})

    const tracksToDelete = allTracksInDbForPlaylist.filter((trackInDb: PlaylistTrackMYSQL) => {
      return !newPlaylistTrackMap[trackInDb.id]
    })

    for(let i = 0; i < tracksToDelete.length; i++) {
      const track = tracksToDelete[i]
      request.setData({ id: track.id });
      (await audioModel.deletePlaylistTrack(request)).getData()
    }

    for (let i = 0; i < playlistTracks.length; i++) {
      const track = playlistTracks[i]
      if (track.id === null) {
        request.setData({
          audioTrackId: track.audioTrackId,
          playlistId: id,
          position: i
        });
        (await audioModel.createPlaylistTrack(request)).getData()
        continue 
      }

      request.setData({
        id: track.id,
        position: i
      });
      (await audioModel.updatePlaylistTrackPositions(request)).getData()
    }

    res.sendStatus(200)
  } catch(e) {
    console.error(e)
    res.sendStatus(400)
  }
})

Audio.delete('/playlists', async(req, res) => {
  console.log('[DELETE] /media/audio/playlists')
  let request = new Request()
  request.setData({ id: req.query.id })
  try {
    (await audioModel.deletePlaylistByID(request)).getData()
    res.sendStatus(204)
  } catch(e) {
    console.error(e)
    res.sendStatus(400)
  }
})

Audio.get('/playlists/tracks', async(req, res) => {
  console.log('[GET] /media/audio/playlists/tracks')
  let request = new Request()
  try {
    let data = []
    if (req.query.hasOwnProperty('id')) {
      request.setData({ id: req.query.id })
      data = (await audioModel.getPlaylistTrackById(request)).getData()[0]
    } else if (req.query.hasOwnProperty('playlistId')) {
      request.setData({ id: req.query.playlistId })
      data = (await audioModel.getAllPlaylistTracksByPlaylistId(request)).getData()[0]
    }

    res.status(200).json(data)

  } catch(e) {
    console.error(e)
    res.sendStatus(400)
  }
})

Audio.post('/playlists/tracks', async(req, res) => {
  console.log('[POST] /media/audio/playlists/tracks')
  let request = new Request()
  request.setData({
    audioTrackId: req.body.audioTrackData, 
    playlistId: req.body.playlistId, 
    position: req.body.position
  })
  try {
    const insertId = (await audioModel.createPlaylistTrack(request)).getData()[0].insertId
    res.status(201).json({ insertId })
  } catch(e) {
    console.error(e)
    res.sendStatus(400)
  }
})

Audio.delete('/playlists/tracks', async(req, res) => {
  console.log('[DELETE] /media/audio/playlists/tracks')
  let request = new Request()
  request.setData({ id: req.query.id })

  try {
    (await audioModel.deletePlaylistTrack(request)).getData()
    res.sendStatus(204)
  } catch(e) {
    console.error(e)
    res.sendStatus(400)
  }
})


export default Audio