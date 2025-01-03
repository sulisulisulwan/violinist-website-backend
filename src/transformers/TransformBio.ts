import { BiographyAPIData, BiographyItemAPI, BiographyItemMYSQL, ParsedHTMLComponent } from "suli-violin-website-types/src"
import { getDoubleQuotesEscapedString, traverseToTextComponents } from "../routes/utils.js"

class TransformBio {

  public transformGetWithoutId(allBioData: any): BiographyAPIData {

    const {
      longFormBioResults,
      shortFormBioResults,
      bioResults
    } = allBioData

    return {
      longFormId: longFormBioResults[0]?.id || null,
      shortFormId: shortFormBioResults[0]?.id || null,
      results: bioResults.map((bioItem: BiographyItemMYSQL) => {
        const parsed = JSON.parse(bioItem.components)
        return {
          id: bioItem.id,
          name: bioItem.name,
          components: parsed
        }
      })
    }
  }

  public transformGetWithId(dbData: any) {

    const bioData: BiographyItemAPI = {
      id: null,
      name: null,
      components: []
    }

    if (dbData[0]) {
      bioData.id = dbData[0].id
      bioData.name = dbData[0].name
      bioData.components = JSON.parse(dbData[0].components)
    }

    return bioData
  }

  public transformPost(req: any, res: any, next: any) {

    const { name, components } = req.body
    const escaped = traverseToTextComponents(components)
    const asString = JSON.stringify(escaped)
    
    const data = {
      name,
      components: asString
    }

    req.requestObj.setData(data)

    next()
  }

  public transformPatch(req: any, res: any, next: any) {
    const { id, name, components } = req.body

    const escaped = traverseToTextComponents(components)
    const asString = JSON.stringify(escaped)
    const data: BiographyItemMYSQL = {
      id,
      name,
      components: asString
    }

    req.requestObj.setData(data)
    next()
  }

}



export default TransformBio