import { MasterModel } from "../../../models/index.js"
import BaseRoute from "../../BaseRoute.js"
import { Request as ExpressRequest, Response as ExpressResponse } from "express-serve-static-core";

class GetVideosValidateYoutubeCode extends BaseRoute {

  protected model: MasterModel
  
  constructor(model: MasterModel) {
    super()
    this.model = model
  }

  async exec(req: ExpressRequest, res: ExpressResponse) {
    const { youtubeCode } = req.query
    let isValid = true

    try {

      try {
        const result = await fetch(`https://img.youtube.com/vi/${youtubeCode}/0.jpg`)
        if (result.status !== 200) {
          isValid = false
        }
      } catch(e) {
        isValid = false
      }

      res.status(200).json({ isValid })
    } catch(e) {
      (req as any).logger.log(e.stack)
      res.sendStatus(400)
    }

  }
  
}

export default GetVideosValidateYoutubeCode