import app from './server/server.js'

const port = 1337;
app.listen(port, () => {
  console.log(`listening on ${port}`)
})
