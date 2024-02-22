export const prepareStringForMySQL = (json: string): string => {
  let escaped = ''
  for (let i = 0; i < json.length; i++) {
    const currChar = json[i]
    let toAdd = currChar
    if (currChar === "'") {
      toAdd = "\\'"
    }

    escaped += toAdd
  }

  return escaped

}