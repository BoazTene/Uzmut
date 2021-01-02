var player = undefined;
var background = undefined;
var physics = undefined;
var map = {};
var scroll = undefined;


async function load(){
    images = [
        'background_test.jpg',
        'images/standing.png',
        'images/walk/walking1.png', 'images/walk/walking2.png', 'images/walk/walking3.png',
        'images/jump/jumping1.png', 'images/jump/jumping2.png',
    ]

    

    return new Promise(async resolve => {
        canvas.style.visibility = "visible";

        await on_start();
        resolve("d")
        var image;
        for (let i = 0; i < 40; i++){
            for (let i = 0; i < images.length; i++){
                image = new Image();
                var img = new DrawImage(image)
                await img.draw(images[i], -1000, -1000, 500, 500, 0, 0, 0, false);
            }
            if (i % 2 == 0) {
                // player.moveToLeft();
                // player.jump();
            } else {
                // player.moveToRight();
                // player.jump();
            }
            
        }

        canvas.style.left = "0px";
        canvas.style.top = "0px";

        canvas.style.visibility = "visible";
        document.getElementsByClassName("loader")[0].style.visibility = "hidden";
        resolve("Loading finished")
    })
    
}

load().then(() =>{
    var keyboard = new keyBoard();
    // document.addEventListener('keydown', async function(evt){
    //     evt = evt || window.event;
    //     var charCode = evt.keyCode || evt.which;
    //     var charStr = String.fromCharCode(charCode);
    //      // to deal with IE
    //     map[evt.keyCode] = evt.type == 'keydown';
    
    //     if ((charStr == "a" || charStr =="A" || charStr == "ש") && !player.move) {
    //         await player.moveToLeft();
    //     } 
    // })
    
    // document.addEventListener('keydown', async function(evt){
    //     evt = evt || window.event;
    //     var charCode = evt.keyCode || evt.which;
    //     var charStr = String.fromCharCode(charCode);
    //     if((charStr == 'd' || charStr == 'D' || charStr == "ג") && !player.move) {
    //         await player.moveToRight()
    //     }
    // });
    
    // document.addEventListener('keydown', async function(evt){
    //     evt = evt || window.event;
    //     var charCode = evt.keyCode || evt.which;
    //     var charStr = String.fromCharCode(charCode);
    //     if((charStr == "w" || charStr == "W" || charStr == "'" )&& !player.jumping){
    //         await player.jump();
    //     } 
    // });
});


