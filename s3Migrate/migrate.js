import { masterModelSingleton } from '../build/models/index.js'
import Request from '../build/request/Request.js'
import { s3HandlerSingleton } from '../build/middleware/S3Handler.js'
import config from '../build/configPaths.js'

const request = new Request()


request.setData({ type: 'media-photo' })
const photosResp = (await masterModelSingleton.photos.getPhotosRecordsByType(request)).getData()
request.setData({ type: 'video-thumbnail' })
const videosResp = (await masterModelSingleton.photos.getPhotosRecordsByType(request)).getData()
const audioResp = (await masterModelSingleton.audio.getAllAudioTrackRecords(request)).getData()

const audioDirectory = 'audio-track'
const photoDirectory = 'media-photo'
const videoDirectory = 'video-thumbnail'

const allPhotos = photosResp[0]
const allVideos = videosResp[0]
const allAudio = audioResp[0]


const allFiles = []

for (let i = 0; i < allVideos.length; i++) {
  const videoThumbnailId = allVideos[i].id
  request.setData({ id: videoThumbnailId })

  const data = (await masterModelSingleton.photos.getPhotosRecordById(request)).getData()
  allFiles.push({
    s3Directory: videoDirectory,
    s3Filename: data[0][0].src
  })
}

for (let i = 0; i < allPhotos.length; i++) {
  const photoId = allPhotos[i].id
  request.setData({ id: photoId })
  
  const data = (await masterModelSingleton.photos.getPhotosRecordById(request)).getData()
  allFiles.push({
    s3Directory: photoDirectory,
    s3Filename: data[0][0].src
  })
}

for (let i = 0; i < allAudio.length; i++) {

  allFiles.push({
    s3Directory: audioDirectory,
    s3Filename: allAudio[i].src
  })
}

console.log(allFiles)

// console.log(s3HandlerSingleton.uploadFile())

