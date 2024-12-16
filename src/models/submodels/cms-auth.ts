import MySQL from "../../db/db.js";
import Request from "../../request/Request.js";
import RequestRequired from "../../request-required-wrapper/RequestRequired.js";

class CmsAuthModel extends RequestRequired {

  protected db: typeof MySQL

  constructor(dbInstance: typeof MySQL) {
    super()
    this.db = dbInstance
  }

  async getUserByUsername(request: Request) {
    const { username } = request.getData()
    const q = `SELECT * FROM users WHERE username = '${username}'`
    const result = await this.db.query(q)
    request.setData(result[0])
    return request
  }

}

export default CmsAuthModel