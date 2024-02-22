import * as express from 'express'
import apiRoutes from '../routes/index'
import * as cors from 'cors'

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors())

/***********
*  ROUTES
************/


app.use('/v1', apiRoutes)

export default app