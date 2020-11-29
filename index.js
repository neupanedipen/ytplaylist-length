require('dotenv').config();
const path = require('path')
const express = require('express');
const PlaylistSummary = require('youtube-playlist-summary');
const moment = require('moment')
const fetch = require('node-fetch');
const bodyParser = require('body-parser')

const port = process.env.PORT || 3000;

const app = express();

const publicDirectoryPath = path.join(__dirname, './public')

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static(publicDirectoryPath))


const config = {
    GOOGLE_API_KEY: process.env.API_KEY, // require
    PLAYLIST_ITEM_KEY: ['publishedAt', 'title', 'description', 'videoId', 'videoUrl'], // option
}

const ps = new PlaylistSummary(config)

let allVideoIds = [];
let allDurations = [];
var len;

app.get('/', (req, res) => {
    res.render('index')
})

app.get('/duration', (req, res) => {
    const playlistID = req.query.playlistId;
    console.log(playlistID)
    if (!playlistID) {
        return res.json({
            error: "You must provide an address"
        })
    }
    try {
        const getVideoDuration = (id, len) => {
            const getData = async () => {
                const response = await fetch(`https://youtube.googleapis.com/youtube/v3/videos?part=contentDetails%2Cstatistics&id=${id}&key=${process.env.API_KEY}`)
                const data = await response.json()
                timeInMS = moment.duration(data.items[0].contentDetails.duration).asMilliseconds();

                allDurations.push(timeInMS)
                if (allDurations.length === len) {
                    const totalDuration = allDurations.reduce((acc, curr) => {
                        return acc + curr;
                    })
                    const totalDurationinSec = (totalDuration / 1000);
                    console.log(totalDurationinSec)
                    res.json({
                        totalDurationinSec: totalDurationinSec
                    })
                }
            }

            getData()
        }
        // 
        const getVideoIds = async () => {
            const result = await ps.getPlaylistItems(playlistID);
            len = result.items.length

            allVideoIds = result.items.map(item => item.videoId)
            allVideoIds.map(id => {
                getVideoDuration(id, len)
            })

        }

        console.log(getVideoIds());
    }
    catch (err) {
        res.json({
            error: err.message
        })
    }
})

app.listen(port, () => {
    console.log("listenting")
})