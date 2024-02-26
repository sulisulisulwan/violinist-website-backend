import multer from 'multer'
import * as crypto from 'crypto'


class UploadHandler {

  protected config
  protected upload
  protected storage
  protected dest: string

  constructor(directory: string, config: any) {
    this.config = config
    this.dest = this.config.getField('UPLOAD_DIRECTORY') + directory 
    this.storage = multer.diskStorage({
      destination: this.dest,
      filename: function(req, file, cb) {
        
        const split = file.originalname.split('.')
        const fileSuffix = split[split.length - 1]
        const dateNow = Date.now().toString()

        const hash = crypto.createHash('sha256')
        const hashValue = hash.update(dateNow + file.originalname).digest('hex')

        let customFilename = hashValue + '.' + fileSuffix
        
        cb(null, customFilename)
      }
    })
    this.upload = multer({ storage: this.storage })
  }


  public single(formFieldName: string) {
    return this.upload.single(formFieldName)
  }

  public createFileName(name: string, suffix: string) {
    const dateNow = Date.now().toString()
    const hash = crypto.createHash('sha256')
    const hashValue = hash.update(dateNow + name).digest('hex')
    return hashValue + '.' + suffix
  }

}

export default UploadHandler

