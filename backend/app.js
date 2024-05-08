const express = require('express')
const morgan = require('morgan')

const cors = require('cors')
const cookieParser = require('cookie-parser')
const adminRoutes = require('./routes/adminRoutes')


const app = express()
app.use(cors({
	origin: true,
	credentials: true,
	exposedHeaders: ["token"]
}))


app.listen(3001)
//middleware and static fields
app.use(morgan('dev'))
app.use(express.json());
// app.use(urlencoded({ extended: true, limit: '50mb' }))
app.use(cookieParser())

app.get('/isconnected', (req, res) => res.status(200).json({ msg: "server online" }))
app.use(adminRoutes)


app.use((req, res) => res.status(400).json({ msg: "wrong endpoint" }))