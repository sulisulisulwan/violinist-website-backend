import * as express from 'express'
import AudioModel from '../../models/audio'
import VideosModel from '../../models/videos'
import PhotosModel from '../../models/photos'

import Request from '../../Request'
import Audio from './subroutes/audio'
import Photos from './subroutes/photos'
import Videos from './subroutes/videos'
import MySQL from '../../db/db'
import config from '../../db/config'
import { 
  AudioTrackDataAPI, 
  AudioTrackDataMYSQL, 
  PhotoDataAPI, 
  PhotoDataMYSQL, 
  PlaylistItemAPI, 
  PlaylistTrackMYSQL, 
  VideoDataAPI, 
  VideoDataMYSQL 
}  from 'suli-violin-website-types/src'

const audioModel = new AudioModel(new MySQL(config))
const videosModel = new VideosModel(new MySQL(config))
const photosModel = new PhotosModel(new MySQL(config))

const Media = express.Router()

Media.use('/audio', Audio)
Media.use('/photos', Photos)
Media.use('/videos', Videos)
Media.get('/', async (req, res) => {
  console.log('[GET] /media/')
  let request = new Request()

  try {

    const photoResults =  (await photosModel.getAllPhotoIds(request)).getData()
    const videoResults = (await videosModel.getAllVideos(request)).getData()
    const audioResults = (await audioModel.getAllAudioTrackRecords(request)).getData()
    const playlistResults = (await audioModel.getAllPlaylists(request)).getData()
  
    const photoIds: PhotoDataAPI[] = photoResults[0].map((photoData: PhotoDataMYSQL) => ({ id: photoData.id, photoCred: photoData.photoCred, originalFileName: photoData.originalFileName}))
    const videoUrls: VideoDataAPI[] = videoResults[0].map((videoData: VideoDataMYSQL) => ({ id: videoData.id, youtubeCode: videoData.youtubeCode, caption: videoData.caption }))
    const audioData: AudioTrackDataAPI[] = audioResults[0].map((audioData: AudioTrackDataMYSQL) => ({ id: audioData.id, author: audioData.author, title: audioData.title, originalFileName: audioData.originalFileName }))
    const playlistsData: PlaylistItemAPI[] = []

    
    for (let i = 0; i < playlistResults.length; i++) {
      const playlistData = playlistResults[i]
      request.setData({ playlistId: playlistData.id })
      const playlistTracks: PlaylistTrackMYSQL[] = (await audioModel.getAllPlaylistTracksByPlaylistId(request)).getData()
      const transformedPlaylists = playlistTracks.map((track: PlaylistTrackMYSQL) => {
        const audioTrack = audioData.find((audioTrack: AudioTrackDataAPI) => audioTrack.id === track.audioTrackId)
        return {
          id: track.id,
          audioTrackId: track.audioTrackId,
          playlistId: track.playlistId,
          author: audioTrack.author,
          title: audioTrack.title,
        }
      })
      
      const data: PlaylistItemAPI = {
        id: playlistData.id,
        name: playlistData.name,
        playlistTracks: transformedPlaylists
      }
      
      playlistsData.push(data)
    }
  
    const resData = {
      photos: photoIds,
      videos: videoUrls,
      audio: audioData,
      playlists: playlistsData,
    }

    res.status(200).json(resData)

  } catch(request) {
    request instanceof Request ? console.error(request.getError()) : console.error(request)
    res.sendStatus(400)
  }
})

export default Media
