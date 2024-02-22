class Request {

  protected data: any | null
  protected error: {
    isError: boolean,
    message: null | string
  }

  constructor() {
    this.data = null
    this.error = {
      isError: false,
      message: null
    }
  }

  get hasError() {
    return this.error.isError
  }

  getData() {
    const error = this.getError()
    if (error.isError) throw this
    return this.data
  }

  setData(data: any | null) {
    this.data = data
  }

  getError() {
    return this.error
  }

  setError(message: any) {
    this.error.isError = true
    this.error.message = message
  }

}

export default Request