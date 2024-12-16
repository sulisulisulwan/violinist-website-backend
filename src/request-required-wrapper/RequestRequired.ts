import Request from "../request/Request.js"


class RequestRequired {
  constructor () {
    return new Proxy(this, {
      get(target: any, prop) {
        if (typeof target[prop] === 'function') {
          return function () { 
            let request = arguments[0]
            if (!(request instanceof Request)) {
              throw `Tried to pass invalid argument of type (${typeof request}) with value (${request}) to a method of class "${target.constructor.name}".  All methods of class "${target.constructor.name}" require that first argument be an instance of the Request class.`
            }

            try {
              const method = target[prop]
              request = method.call(this, request) 
              return request
            } catch(e) {
              const newError = new Error(e.message)
              request.setError(newError)
              return request
            }
          } 
        }
        return target[prop]
      }    
    })
  }
}

export default RequestRequired
