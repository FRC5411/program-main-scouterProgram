
//Parent class of the bodies (Ball, Capsule, Box, Star, Wall)
class MarkerColor {
    constructor(red, green, blue, alpha) {
        this.red = red;
        this.green = green;
        this.blue = blue;
        this.alpha = alpha;
    }
}

//*** GET NEW Robot to scout */
class Markers{
    constructor(x,y){
        this.x = x;
        this.y = y;
        this.markerColor;
        this.markeType; // item, parked, docked, link
        this.gameState = '';
    }
}

class Team{
    constructor(id, scout, team, allianceColor, markerColor){
        this.markers = [];
        this.id = id;
        this.scout = scout;
        this.team = team;
        this.allianceColor = allianceColor;
        this.markerColor = markerColor;
        //SCOUTERS.push(this);
    }

}

class ScoreBoard{
    constructor(){
        this.redAllianceScore = 0;
        this.blueAllianceScore = 0;
        this.redAllianceLinks = 0;
        this.blueAllianceLinks = 0;
        this.redAllianceAutonScore = 0;
        this.blueAllianceAutonScore = 0;
        this.redAllianceTelopScore = 0;
        this.blueAllianceTelopScore = 0;
        this.redCoopScore = 0;
        this.blueCoopScore = 0;
    }
}

class GamePlay{
    constructor(){
        this.scoreBoard = new ScoreBoard();
        this.teams = [];
        this.autonMarkers = {};
        this.telopMarkers = {};
        this.preGameMarkers = {};
        this.links = [];
    }
    findTeam(id) {
        return this.teams.find(item => item.id === id)
    }
    addAutonMarker(marker, markerId) {
        this.autonMarkers[markerId] = marker
    }
    deleteAutonMarker(markerId) {
        delete this.autonMarkers[markerId]
    }
    addTelopMarker(marker, markerId) {
        this.telopMarkers[markerId] = marker
    }
    deleteTelopMarker(markerId) {
        delete this.telopMarkers[markerId]
    }
    addPreGameMarker(marker, markerId) {
        this.preGameMarkers[markerId] = marker
    }
    deletePreGameMarker(markerId) {
        delete this.preGameMarkers[markerId]
    }
}


module.exports = {MarkerColor, Team, Markers, GamePlay}