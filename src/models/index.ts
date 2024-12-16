import db from "../db/db.js"
import MasterModel from "./master-model/MasterModel.js"

const masterModelSingleton = new MasterModel(db)

export {
  masterModelSingleton,
  MasterModel
}