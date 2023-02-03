let image = new Image();
image.src = "Assets/FRC_PlayingField_blue.png";

let field = new Field(image, 800, 755)
const grid = new Grid(field.width, field.height, 47, 58)
let scoreboard = new ScoreBoard()

window.onload = function() {
    canvas.width = field.width;
    canvas.height = field.height;
    field.draw()
    grid.draw()
}