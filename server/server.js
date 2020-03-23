const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const shortid = require('shortid')

require('dotenv').config()
const app = express()
const router = express.Router()
// ------------------------------------------------------------------------------------------------------------------
mongoose.connect(process.env.DBURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log('Connected to DB')
    })
    .catch(() => {
        console.log('Connecttion to DB FAILED')
    })
// ------------------------------------------------------------------------------------------------------------------
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: false
}))
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', "*")
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
    res.setHeader("Feature-Policy", "microphone 'none'; camera 'none'; vibrate 'none'; payment 'none'; gyroscope 'none'; push 'none'; geolocation 'none'")
    res.setHeader("x-xss-protection", "1; mode=block")
    res.setHeader("Referrer-Policy", "no-referrer-when-downgrade")
    res.setHeader("X-Content-Type-Options", "nosniff")
    res.setHeader("Accept-Encoding", "gzip")
    res.setHeader("X-Frame-Options", "sameorigin")
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains")
    next()
})
// ------------------------------------------------------------------------------------------------------------------
const ShortUrlSchema = mongoose.Schema({
    url: {
        type: String,
        required: true
    },
    shorturl: {
        type: String,
        required: true,
        default: shortid.generate
    }
})
var ShortUrl = mongoose.model("ShortUrl", ShortUrlSchema)
// ------------------------------------------------------------------------------------------------------------------
router.post('', (req, res, next) => {
    ShortUrl.findOne({
            url: req.body.url
        })
        .then(shorturlobj => {
            if (shorturlobj) {
                res.status(200).json({
                    message: 'Short Url Exists',
                    shortUrl: shorturlobj.shorturl,
                })
            } else {
                const tobeshort = new ShortUrl({
                    url: req.body.url
                })
                tobeshort.save().then(createdShortUrl => {
                        res.status(201).json({
                            message: 'Short Url created succesfully',
                            shortUrl: createdShortUrl.shorturl,
                        })
                    })
                    .catch(error => {
                        res.status(500).json({
                            message: "Short Url Creation Failed"
                        })
                    })
            }
        })
        .catch(error => {
            res.status(500).json({
                message: "Short Url Creation Failed"
            })
        })
})
// ------------------------------------------------------------------------------------------------------------------
router.get('/:id', (req, res, next) => {
    ShortUrl.findOne({
            shorturl: req.params.id
        })
        .then(shorturl => {
            if (shorturl) {
                res.status(200).json({
                    message: 'Long Url fetched',
                    longUrl: shorturl.url
                })
            } else {
                res.status(404).json({
                    message: 'No such Url not Found'
                })
            }
        })
        .catch(error => {
            res.status(500).json({
                message: "Fetching Url Failed"
            })
        })
})
// ------------------------------------------------------------------------------------------------------------------
app.use("/api/shorten/", router)
// ------------------------------------------------------------------------------------------------------------------
app.listen(process.env.PORT || 3000)