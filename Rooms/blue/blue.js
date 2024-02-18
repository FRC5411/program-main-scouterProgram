let scorecard = new ScoreCard(autonScore, teleopScore, autonParking, teleopParking)
let scoreboard = new ScoreBoard(
    blueAllianceScore,
    redAllianceScore,
    totalScore,
    linksScore,
    coopScore,
    rankingPoints,
    autonAmpCount,
    autonSpeakerCount,
    autonTrapCount,
    teleopAmpCount,
    teleopSpeakerCount,
    teleopTrapCount
)
// let superCharged = 0 Don't need

canvas.addEventListener("mousedown", function(e) {
    socket.emit('drawMarker', 'blue', grid.getMousePosition(e))
})

socket.on('scoreboard', score => 
{
    alert(JSON.stringify(score.team.teleopScore.AmpCount));
   // scoreboard.renderAllianceScore(score.totalScore.blueAllianceScore)
   // scoreboard.renderOpposingScore(score.totalScore.redAllianceScore)
    scoreboard.renderAutonAmpCount(score.team.autonScore.AmpCount)
    scoreboard.renderAutonSpeakerCount(score.team.autonScore.SpeakerCount)
    scoreboard.renderAutonTrapCount(score.team.autonScore.TrapCount)
    scoreboard.renderTeleopAmpCount(score.team.teleopScore.AmpCount)
    scoreboard.renderTeleopSpeakerCount(score.team.teleopScore.SpeakerCount)
    scoreboard.renderTeleopTrapCount(score.team.teleopScore.TrapCount)
    if(score.team.teamNumber === scoutData.teamNumber)
    {
        let teamScore = 0
        if(!(JSON.stringify(score.teleopScore) === '{}'))
        {
           /* scorecard.renderTeleopScore(score.teleopScore.markerScore)
            scorecard.renderTeleopParkingScore(score.teleopScore.parkingScore)
            teamScore += score.teleopScore.markerScore + score.teleopScore.parkingScore*/
        }
        if(!(JSON.stringify(score.autonScore) === '{}'))
        {
            /*scorecard.renderAutonScore(score.autonScore.markerScore)
            scorecard.renderAutonParkingScore(score.autonScore.parkingScore)
            teamScore += score.autonScore.markerScore + score.autonScore.parkingScore*/
        }
        scoreboard.renderTotalScore(teamScore)
    }
    scoreboard.renderCoopScore(score.totalScore.blueCoopScore)
    scoreboard.renderLinksScore(score.totalScore.blueAllianceLinks)
    scoreboard.renderRankingPoints(score.totalScore.blueRankingPoints)
})

// don't need
// document.getElementById("increment").onclick = () => {
//     if (superCharged >= 0)
//     {
//         superCharged++
//     }
//     document.getElementById("superCharged").value = superCharged
//     socket.emit('inc', 'blue')
// }

// document.getElementById("decrement").onclick = () => {
//     if (superCharged > 0)
//     {
//         superCharged--
//     }
//     document.getElementById("superCharged").value = superCharged
//     socket.emit('dec', 'blue')
// }