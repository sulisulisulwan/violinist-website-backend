import { BlogItemAPI, BlogItemMYSQL, ParsedHTMLComponent } from "suli-violin-website-types/src"
import { createMySqlDatetimeOfNow, getDoubleQuotesEscapedString } from "../routes/utils.js"

class TransformBlog {

  public transformGet(dataRow: BlogItemMYSQL): BlogItemAPI {
    return {
      id: dataRow.id,
      title: dataRow.title,
      components: JSON.parse(dataRow.components).map(((component: ParsedHTMLComponent) => {
        return {
          type: component.type,
          content: component.content
        }
      })),
      dateCreated: dataRow.dateCreated,
      dateLastModified: dataRow.dateLastModified,
    }

  }

  public transformPost(req: any, res: any, next: any) {
    const { title, components } = req.body 
  
    const doubleQuotesEscapedComponents = components.map((component: ParsedHTMLComponent) => { 
      component.content = getDoubleQuotesEscapedString(component.content)
      return component
    })
  
    const dateNow = createMySqlDatetimeOfNow()
  
    const data = {
      title,
      components: JSON.stringify(doubleQuotesEscapedComponents),
      dateCreated: dateNow,
      dateLastModified: dateNow
    }
  
    req.requestObj.setData(data)
    next()
  }
  
  
  public transformPatch(req: any, res: any, next: any) {
  
    const { id, title, components } = req.body 
      
    const doubleQuotesEscapedComponents = components.map((component: ParsedHTMLComponent) => { 
      component.content = getDoubleQuotesEscapedString(component.content)
      return component
    })
    
    const dateModified = createMySqlDatetimeOfNow()
    const data = {
      id,
      title,
      components: JSON.stringify(doubleQuotesEscapedComponents),
      dateLastModified: dateModified
    }
  
    req.requestObj.setData(data)
    next()
  
  }
}

export default TransformBlog