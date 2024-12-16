class Response {

  protected data: null | any
  protected error: {
    isError: boolean
    message: string
  }

  constructor() {

    this.data = null 
    this.error = {
      isError: false,
      message: null
    }

  }

  getData() {
    return this.data
  }

  setData(data: any) {
    this.data = data
  }

  getError() {
    return this.error
  }

  setError(message: string) {
    this.error.isError = true
    this.error.message = message
  }

  getObj() {
    return {
      data: this.data,
      error: this.error
    }
  }

}

export default Response