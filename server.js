const BODIES = [];
const COLLISIONS = [];
const SCOUTERS = [];

const dev_mode = true
//************************* END OF PHYSICS ENGINE ***/

const express = require('express')
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const session = require("express-session")
const app = express()
//const io = require('socket.io')(5500)
const gp = require('./Server/gamePieces')
const fw = require('./Server/fileWriter')
const ref = require('./Server/referee') 

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

//import { MarkerColor } from './gamePieces'
//MarkerColor = require('./gamePieces')

const http = require("http")
const socketio = require("socket.io")
const path = require("path")
const httpserver = http.Server(app)
const io = socketio(httpserver)

const sessionMiddleware = session({
    secret: "54119105",
    saveUninitialized: false,
    cookie: { maxAge: 3600000 },
    resave: false
})

app.use(sessionMiddleware)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

express.static('public');
app.use(express.static(__dirname + "/Rooms"))

app.post('/scoutdata', (req, res) => {
    let scoutData = fw.getScoutData()
    res.json(scoutData)
})

app.post("/signin", (req, res) => {
    if (fw.getAlliance(req.body.names)) {
        req.session.authenticated = true
        req.session.scout = req.body.names
        req.session.allianceColor = fw.getAlliance(req.body.names)
        res.redirect('/' + req.session.allianceColor)
    } else {
        res.send(`Sorry, but that name was not found in the scouter list, for testing purposes use: 'David', 'Sterling', 'Scott', or 'blue2'. <a href=\'/lobby'>Click here to go back to the lobby</a>`)
    }
})

app.get('/', (req, res) => res.send('Hello World!'))

app.get('/game', function(req, res) {
    if (dev_mode) {
        req.session.authenticated = true
        req.session.scout = 'Scott'
        req.session.allianceColor = "blue"
    }
    res.sendFile(path.join(__dirname, 'Rooms/index.html'))
})

app.get('/blue', function(req, res) {
    res.sendFile(path.join(__dirname, 'Rooms/index.html'))
})

app.get('/red', function(req, res) {
    res.sendFile(path.join(__dirname, 'Rooms/red.html'))
})

app.get('/lobby', function(req, res) {
    res.sendFile(path.join(__dirname, 'Rooms/lobby.html'))
})

app.get('*', function(req, res) {
    res.redirect('/lobby')
})

let playerPos = {}
let gamePlay = {
    blue: {},
    red: {}
}

//let scoutDatas
//let score = new ref.ScoreLive(gamemarkers);



const wrap = middleware => (socket, next) => middleware(socket.request, {}, next)

io.use(wrap(sessionMiddleware))

io.use((socket, next) => {
    const session = socket.request.session;
    if (session && session.authenticated) {
        next();
    } else {
        console.log("unauthorized user joined")
        next(new Error("unauthorized"))
    }
})

initGame();
io.on('connection', connected);

function connected(socket) {
    console.log(socket.request.session)
    //console.log("session id: " + socket.request.session.id + "\n")
    //console.log("scout name: " + socket.request.session.scout + "\n")
    socket.on('newScouter', data => {
        socket.leaveAll()
        //socket.join(gamePlay.findTeam(socket.request.session.scout).allianceColor)
        socket.join(socket.request.session.allianceColor)
        console.log("New client connected, with id (yeah): " + socket.id)
        let team = gamePlay[socket.request.session.allianceColor].findTeam(socket.request.session.scout)
        let scoreData = fw.getScoreData()
        io.to(team.allianceColor).emit('AssignRobot', team, scoreData)
    })

    socket.on('drawMarker', data => {
        let team = gamePlay[socket.request.session.allianceColor].findTeam(socket.request.session.scout)
        let drawMarker = {
            x: data.x,
            y: data.y,
            markerColor: team.markerColor
        }
        let markerId = "x" + drawMarker.x + "y" + drawMarker.y;
        if(!(markerId in gamePlay[socket.request.session.allianceColor].telopMarkers))
        {
            //console.log(score);
            gamePlay[socket.request.session.allianceColor].addTelopMarker(drawMarker, markerId)
            io.to(team.allianceColor).emit('placeMarker', drawMarker);
        } else if (
            gamePlay[socket.request.session.allianceColor].telopMarkers[markerId].markerColor.red == team.markerColor.red && 
            gamePlay[socket.request.session.allianceColor].telopMarkers[markerId].markerColor.green == team.markerColor.green && 
            gamePlay[socket.request.session.allianceColor].telopMarkers[markerId].markerColor.blue == team.markerColor.blue
            ) {
            gamePlay[socket.request.session.allianceColor].deleteTelopMarker(markerId)
            io.to(team.allianceColor).emit('redraw', gamePlay[socket.request.session.allianceColor].telopMarkers)
        }
        score = new ref.ScoreLive(gamePlay["blue"].ReturnTeleOpMarkers(), gamePlay["red"].ReturnTeleOpMarkers());

        score.UpdateMarkers();
        console.log("Blue:" + score.TeamScore("blue"));
        console.log("Red: " + score.TeamScore("red"));
    })

    socket.on('disconnect', function() {
        console.log("Goodbye client with id " + socket.id);
        console.log("Current number of players: " + Object.keys(playerPos).length);
        //io.emit('updatePlayers', playerPos);
    })

}

function initGame()
{
    //let markerColor = new gp.MarkerColor(235,255,137,0.5)
    //scoutData = new gp.Team('Scott', '5411', 'Red', markerColor)
    //score = new ref.ScoreLive(gamemarkers)
    gamePlay.blue = new gp.GamePlay()
    gamePlay.red = new gp.GamePlay() 
    const data = fw.getScoutData()
    for (let scout in data.blue) {
        gamePlay.blue.teams.push(new gp.Team(data.blue[scout].name, '', 'blue', new gp.MarkerColor(Number(data.blue[scout].color.red), Number(data.blue[scout].color.green), Number(data.blue[scout].color.blue), 0.5)))
    }
    for (let scout in data.red) {
        gamePlay.red.teams.push(new gp.Team(data.red[scout].name, '', 'red', new gp.MarkerColor(Number(data.red[scout].color.red), Number(data.red[scout].color.green), Number(data.red[scout].color.blue), 0.5)))
    }
    //fw.addScout(scoutData.name, scoutData);
    fw.addNewGame('match1');
}

function addMarker(gameMarker, markerId)
{
    let newMarker = new gp.Markers(gameMarker.x, gameMarker.y);
    newMarker.markerColor = gameMarker.markerColor;
    gamePlay.telopMarkers[markerId] = newMarker
    let scoreData = fw.getScoreData()
    scoreData["telop"] = gamePlay.telopMarkers
    fw.saveScoreData(scoreData)
}

function deleteMarker(markerId) {
    delete gamePlay.telopMarkers[markerId]
    let scoreData = fw.getScoreData()
    scoreData["teleop"] = gamePlay.telopMarkers
    fw.saveScoreData(scoreData)
}

httpserver.listen(5500)