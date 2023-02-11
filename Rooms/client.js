const socket = io.connect('http://localhost:5500');

let clientBalls = {}
let scoutData = {}

function gameChange() {
    socket.emit('gameChange')
}

socket.on('connect', () => {
    socket.emit('newScouter');
})

socket.on('AssignRobot', (data, scoreData) => {
    scoutData = data;
    //document.getElementById("robot1").style.backgroundColor = "rgb(" + data.markerColor.red + "," + data.markerColor.green + "," + data.markerColor.blue + ")"
    console.log('markerColor: ' + scoutData.markerColor.red);
    for (let property in scoreData["telop"]) {
        let marker = scoreData["telop"][property]
        grid.placeMarker(marker.x, marker.y, marker.markerColor)
    }
})

socket.on('placeMarker', data => {
    console.log('data:' + data.markerColor.red);
    grid.placeMarker(data.x, data.y, data.markerColor)
})

socket.on('redraw', (telopMarkers, autonMarkers) => {
    field.clear()
    field.draw()
    grid.draw()
    
    console.log("teleop markers: ")
    for (let marker in telopMarkers) {
        console.log(telopMarkers[marker])
        grid.placeMarker(telopMarkers[marker].x, telopMarkers[marker].y, telopMarkers[marker].markerColor)
    }
    console.log("auton markers: ")
    for (let marker in autonMarkers) {
        console.log(autonMarkers[marker])
        grid.placeMarker(autonMarkers[marker].x, autonMarkers[marker].y, autonMarkers[marker].markerColor)
    }
})

socket.on('clear', () => {
    field.clear()
    field.draw()
    grid.draw()
})

socket.on('draw', markers => {
    for (let index in markers) {
        let marker = markers[index]
        grid.placeMarker(marker.x, marker.y, marker.markerColor)
    }
})

/*socket.on('toggleGameMode', () => {
    document.getElementById('gamestate').checked = ''
})*/

socket.on('getRobot', robots => {
    //ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    /*playersFound = {};
    for(let id in players){
        if(clientBalls[id] === undefined && id !== socket.id){
            clientBalls[id] = new Capsule(players[id].x, players[id].y, players[id].x+40, players[id].y, 40, 5);
            clientBalls[id].maxSpeed = 5;
        }
        playersFound[id] = true;
    }
    for(let id in clientBalls){
        if(!playersFound[id]){
            clientBalls[id].remove();
            delete clientBalls[id];
        }
    }*/
})
/*
socket.on('updatePlayers', players => {
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    playersFound = {};
    for(let id in players){
        if(clientBalls[id] === undefined && id !== socket.id){
            clientBalls[id] = new Capsule(players[id].x, players[id].y, players[id].x+40, players[id].y, 40, 5);
            clientBalls[id].maxSpeed = 5;
        }
        playersFound[id] = true;
    }
    for(let id in clientBalls){
        if(!playersFound[id]){
            clientBalls[id].remove();
            delete clientBalls[id];
        }
    }
})*/
/*
socket.on('positionUpdate', playerPos => {
    for(let id in playerPos){
        if(clientBalls[id] !== undefined){
            clientBalls[id].setPosition(playerPos[id].x, playerPos[id].y, playerPos[id].angle);
        }
    }
})*/


/*function placeMarker(canvas, x, y, markerColor)
{
    var width = grid.boxWidth //canvas.width/gridWidth;
    var height = grid.boxHeight //canvas.height/gridHeight
    var posx = x*width;
    var posy = y*height;
    ctx.fillStyle = 'rgba('+markerColor.red+','+markerColor.green+','+markerColor.blue+','+markerColor.alpha+')'; //markerColor;
    ctx.fillRect(posx+3,posy+3,width-2, height-2);
}*/


//requestAnimationFrame(renderOnly);






