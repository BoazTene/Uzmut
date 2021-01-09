var player = undefined;
var background = undefined;
var physics = undefined;
var physics1 = undefined;
var platform = undefined;
var map = {};
var scroll = undefined;
var keyboard = undefined;
var questioning = false;
var questions = [];


async function load(){
    images = [
        'background_test.jpg',
        'images/standing.png',
        'images/walk/walking1.png', 'images/walk/walking2.png', 'images/walk/walking3.png',
        'images/jump/jumping1.png', 'images/jump/jumping2.png',
    ]

    

    return new Promise(async (resolve, reject) => {
        

        canvas.style.visibility = "visible";
        canvas.style.position = "relative";
        
        canvas.style.left = "-1000px";
        canvas.style.top = "-1000px";
        
        await on_start();
        await new Promise(resolve => {
            caches.open('v1').then(function(cache) {
                resolve()
                return cache.addAll(images);
            });
        })
        
        
        // await new Promise(async resolve => {
        //     var image;
        //     for (let i = 0; i < 40; i++){
        //         for (let i = 0; i < images.length; i++){
        //             image = new Image();
        //             var img = new DrawImage(image)
        //             await img.draw(images[i], -1000, -1000, 500, 500, 0, 0, 0, false);
        //         }
        //         if (i % 15 == 0) {
        //             player.moveToLeft();
        //             await player.jump();
        //         } else if (i % 19 == 0){
        //             player.moveToRight();
        //             await player.jump();
        //         }
                
        //     }
        //     resolve()
        // })
        
        
        
        canvas.style.left = "0px";
        canvas.style.top = "0px";

        canvas.style.visibility = "visible";
        
        canvas.style.position = "relative";

        document.getElementsByClassName("loader")[0].style.visibility = "hidden";


        

        play_sound("music.mp3");


        resolve("Loading finished");
    })
    
}

load().then(async () =>{
    keyboard = new keyBoard();
});


