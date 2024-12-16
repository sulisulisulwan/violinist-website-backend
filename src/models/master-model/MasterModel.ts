
import AudioModel from "../submodels/audio.js";
import BioModel from "../submodels/bio.js";
import BlogModel from "../submodels/blog.js";
import CalendarModel from "../submodels/calendar.js";
import CmsAuthModel from "../submodels/cms-auth.js";
import PhotosModel from "../submodels/photos.js";
import VideosModel from "../submodels/videos.js";
import db, { DB } from "../../db/db.js";
export default class MasterModel {

  protected models: Record<string, any>

  constructor(db: DB) {
    this.models = {
      audio: new AudioModel(db),
      bio: new BioModel(db),
      blog: new BlogModel(db),
      calendar: new CalendarModel(db),
      cmsAuth: new CmsAuthModel(db),
      photos: new PhotosModel(db),
      videos: new VideosModel(db)
    }
  }
  
  get audio (): AudioModel {
    return this.models.audio
  }

  get bio (): BioModel {
    return this.models.bio
  }

  get blog (): BlogModel {
    return this.models.blog
  }

  get calendar (): CalendarModel {
    return this.models.calendar
  }

  get cmsAuth (): CmsAuthModel {
    return this.models.cmsAuth
 
  }
  get photos (): PhotosModel {
    return this.models.photos
  }

  get videos (): VideosModel {
    return this.models.videos
  }

}
