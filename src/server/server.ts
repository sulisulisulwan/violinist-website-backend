import express from 'express'
import apiRoutes from '../routes/index.js'
import cors from 'cors'

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors())

/***********
*  ROUTES
************/

app.use('/v2', apiRoutes)

export default app