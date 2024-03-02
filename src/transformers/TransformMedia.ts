import { AudioTrackDataAPI, AudioTrackDataMYSQL, PhotoDataAPI, PhotoDataMYSQL, PlaylistItemAPI, PlaylistTrackMYSQL, VideoDataAPI, VideoDataMYSQL } from "suli-violin-website-types/src"

class TransformMedia {


  public async transformGet(photoResults: any, videoResults: any, audioResults: any, playlistResults: any, request: any, audioModel: any) {

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
  
    return {
      photos: photoIds,
      videos: videoUrls,
      audio: audioData,
      playlists: playlistsData,
    }
  }
}

export default TransformMedia