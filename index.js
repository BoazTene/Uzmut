var player = undefined;
var background = undefined;

on_start()



document.addEventListener('keypress', function(evt){
    evt = evt || window.event;
    var charCode = evt.keyCode || evt.which;
    var charStr = String.fromCharCode(charCode);
    if ((charStr == "a" || charStr =="A" || charStr == "ש") && !player.move) {
        player.moveToLeft();
    } else if(charStr == " " && !player.jumping){
        player.jump();
    } else if((charStr == 'd' || charStr == 'D' || charStr == "ג") && !player.move) {
        player.moveToRight()
    }
})