var canvas = document.getElementById("canvas");
var ctx = canvas.getContext('2d');
var dragging = false;
var lastX;
var marginTop = 0;


var image = new Image()
image.onload = function () {
    ctx.drawImage(this, 0, 0, 600,  600)
}
image.src = "image.jpg"


addEventListener("wheel", function(event) {
    marginTop -= 10;
    canvas.style.marginTop = marginTop + "px";
    console.log(canvas.style.marginTop);

})