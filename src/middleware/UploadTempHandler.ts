import multer from 'multer'
import * as crypto from 'crypto'
import Config from '@sulimantekalli/configlib'


class UploadTempHandler {

  protected config
  protected upload
  protected storage
  protected dest: string

  constructor(config: Config) {
    this.config = config
    this.dest = this.config.getField('UPLOAD_TEMP_DIRECTORY')

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
      },
    })
    this.upload = multer({ 
      storage: this.storage,
      fileFilter: function(req, file, cb) {
        // console.log(req)
        cb(null, true)
      }
    })
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

export default UploadTempHandler

