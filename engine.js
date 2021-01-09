var canvas = document.getElementById("canvas");
var ctx = canvas.getContext('2d');
document.getElementById("div-canvas").scrollTop = 00;
var divCanvas = document.getElementById('div-canvas');

/** 
 * Draws a rounded rectangle using the current state of the canvas.  
 * If you omit the last three params, it will draw a rectangle  
 * outline with a 5 pixel border radius  
 * @param {Number} x The top left x coordinate 
 * @param {Number} y The top left y coordinate  
 * @param {Number} width The width of the rectangle  
 * @param {Number} height The height of the rectangle 
 * @param {Object} radius All corner radii. Defaults to 0,0,0,0; 
 * @param {Boolean} fill Whether to fill the rectangle. Defaults to false. 
 * @param {Boolean} stroke Whether to stroke the rectangle. Defaults to true. 
 */
CanvasRenderingContext2D.prototype.roundRect = function (x, y, width, height, radius, fill, stroke) {
    var cornerRadius = { upperLeft: 0, upperRight: 0, lowerLeft: 0, lowerRight: 0 };
    if (typeof stroke == "undefined") {
        stroke = true;
    }
    if (typeof radius === "object") {
        for (var side in radius) {
            cornerRadius[side] = radius[side];
        }
    }

    this.beginPath();
    this.moveTo(x + cornerRadius.upperLeft, y);
    this.lineTo(x + width - cornerRadius.upperRight, y);
    this.quadraticCurveTo(x + width, y, x + width, y + cornerRadius.upperRight);
    this.lineTo(x + width, y + height - cornerRadius.lowerRight);
    this.quadraticCurveTo(x + width, y + height, x + width - cornerRadius.lowerRight, y + height);
    this.lineTo(x + cornerRadius.lowerLeft, y + height);
    this.quadraticCurveTo(x, y + height, x, y + height - cornerRadius.lowerLeft);
    this.lineTo(x, y + cornerRadius.upperLeft);
    this.quadraticCurveTo(x, y, x + cornerRadius.upperLeft, y);
    this.closePath();
    if (stroke) {
        this.stroke();
    }
    if (fill) {
        this.fill();
    }
} 


function gameOver(){
        return new Promise(async resolve => {
            clearInterval(keyboard.interval)
            clearInterval(physics1.interval)
            console.log(questions, 'questions')
            for (let i = 0; i < questions.length; i++){
                clearInterval(questions[i])
            }
            questions =  []
            ctx.save()
            ctx.fillStyle = "#0015ff";
            ctx.font = '80px bold serif';
            var width = ctx.measureText("Game Over").width;
            var x = window.innerWidth/2-200;
            var radius = 20;


            var width_m = 250;
            var height_m = 150;
            var hover = false;
            var x_m = x+70;
            var y_m = (window.innerHeight/2);


            // var y = canvas.height - (-scroll.marginTop + window.innerHeight/2) + 35;
            // var width = 250 +35;
            // var height = 150-50;
            
            
            window.addEventListener("mousemove", mouseMove, false)


            for (let i =  0; i < 40; i++){
                ctx.globalAlpha = i/40;
                ctx.fillStyle = "#0015ff";
                ctx.font = '80px bold serif';
                ctx.roundRect(x+width/2-125, -scroll.marginTop + window.innerHeight/2, 250, 70, 
                        {upperLeft:radius, upperRight:radius, lowerRight:radius, lowerLeft:radius}, true, true);
                ctx.fillText("Game Over", x, -scroll.marginTop + window.innerHeight/3)
                ctx.strokeText("Game Over", x, -scroll.marginTop + window.innerHeight/3)
                
                ctx.fillStyle = "#000000";
                ctx.font = '40px bold serif';
                ctx.fillText("Play Again", x+width/2-125 + 30, -scroll.marginTop + window.innerHeight/2 + 45)


                await timeout(50)
            }
       
            window.addEventListener("mousedown", mouseDown, false);
            // window.onmousedown = function (event) {
            //     var hover = false;
            //     if ((event.clientX < width_m+x_m && event.clientX > x_m ) &&  (event.clientY > y_m &&  event.clientY < y_m + height_m)) {
            //             window.removeEventListener('onmousedown', this)
            //             ctx.restore();
            //             on_start();
            //             resolve(true);
            //     }
            // }
            function mouseMove(event) {
                var hover = false;
                if ((event.clientX < width_m+x_m && event.clientX > x_m ) &&  (event.clientY > y_m &&  event.clientY < y_m + height_m)) {
                    canvas.style.cursor = "pointer"; 
                    hover = true; 
                }  
                if (canvas.style.cursor == "pointer" && hover == false) {
                    canvas.style.cursor = "auto";
                    
                }
            }
            function mouseDown(event){
                var hover = false;
                if ((event.clientX < width_m+x_m && event.clientX > x_m ) &&  (event.clientY > y_m &&  event.clientY < y_m + height_m)) {
                        window.removeEventListener('mousedown', mouseDown)
                        window.removeEventListener('mousemove', mouseMove)
                        
                        canvas.style.cursor = "auto";
                        ctx.restore();
                        keyboard = new keyBoard();
                        on_start();
                        resolve(true);
                }
            }

        })
}


class File {
    constructor(path){
        this.path = path;
    }

    getData(){
        return new Promise(resolve => {
            var xhttp = new XMLHttpRequest();
            var that = this;
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    resolve(xhttp.responseText);
                }
            };
            xhttp.open("GET", that.path, true);
            xhttp.send();
        })
    }
}       


class Background{
    constructor(src){
        this.image = new Image();
        this.src = src;
        this.image.src = src;
    }

    get pos(){
        return new Promise(resolve =>{
            
            var image = new Image();
            image.onload = function () {
                resolve([this.width, this.height])
            }
            image.src = this.src;
        })
    }

    draw(){
        var that = this;
        return new Promise(resolve => {
            this.image.onload = async function () {
                console.log(window.innerWidth,  (await that.pos))
                
                ctx.drawImage(this, 0, canvas.height - (await that.pos)[1], window.innerWidth, (await that.pos)[1]);
                resolve("draw");
            }
            this.image.src = this.src;
        })
    }
}

class Scroll{
    constructor(background_height){
        this.marginTop = window.innerHeight - 35 - canvas.height;
        this.background_height = background_height;
        this.delta = 0;
        this.onStart()

        this.scroll(0);
    }

    async onStart(){
        divCanvas.style.maxWidth = (window.innerWidth - 30) + "px";
        divCanvas.style.maxHeight = this.background_height + "px";
        divCanvas.style.width =  window.innerWidth - 30  + "px";
        divCanvas.style.height = window.innerHeight - 35  + "px";
    }

    scroll(px, fall=false){
        if (fall && px + this.delta > 0) {
            // platform.generate1();
            this.delta = 0;
        } else {
            this.delta += px;
        }
        
        if (this.marginTop + px < 0) {
            this.marginTop += px;
            canvas.style.marginTop = this.marginTop + "px";
        }
    }
}

class Rect{
    constructor(x, y, width, height){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    setColor(color){
        ctx.fillStyle = color;
    }

    draw(){
        return new Promise(resolve => {
            ctx.fillRect(this.x, this.y, this.width, this.height);
            resolve()
        });
    }
}

class Button {
    constructor(x, y, width, height){
        this.rect = new Rect(x, y, width, height);
    }

    draw(){
        this.rect.draw();
    }

    clicked(){
        canvas.addEventListener('click', this.getMousePos, true);
        
    }

    getMousePos(event) {
        var rect = canvas.getBoundingClientRect();
        var is = event.clientX > rect.x && event.clientX < rect.x+rect.width && event.clientY < rect.y+rect.height && event.clientY > rect.y
    }

    // isInside(pos, rect){
    //     return 
    // }

}

class DrawImage {
    constructor(image = undefined){
        if (!image){
            this.image = new Image();
        } else {
            this.image = image;
        }
    }

    draw(src, x, y, width=undefined, height=undefined, deg=undefined, flip=undefined, flop=undefined, center=undefined){

        return new Promise(resolve => {
            this.image.onload = async function() {
                await new Promise(resolve => {
                    if ((width != undefined && height != undefined) && deg == undefined && flip == undefined && flop == undefined && center == undefined){
                        ctx.drawImage(this, x, y, width, height);    
                        resolve()
                    }  else if (((width != undefined && height != undefined) && deg != undefined && flip != undefined && flop != undefined && center != undefined)){
                        ctx.save();
                        var flipScale;
                        var flopScale;
                        if(typeof width === "undefined") width = this.width;
                        if(typeof height === "undefined") height = this.height;
                        if(typeof center === "undefined") center = false;
    
                        // Set rotation point to center of image, instead of top/left
                        if(center) {
                            x -= width/2;
                            y -= height/2;
                        }
    
                        // Set the origin to the center of the image
                        ctx.translate(x + width/2, y + height/2);
    
                        // Rotate the canvas around the origin
                        // var rad = 2 * Math.PI - deg * Math.PI / 180;    
                        // ctx.rotate(rad);
    
                        // Flip/flop the canvas
                        if(flip) flipScale = -1; else flipScale = 1;
                        if(flop) flopScale = -1; else flopScale = 1;
                        ctx.scale(flipScale, flopScale);
    
                        // Draw the image    
                        ctx.drawImage(this, -width/2, -height/2, width, height);
                        
    
                        ctx.restore();
                        resolve()
                        
                    } else {
                        ctx.drawImage(this, x, y);
                        resolve()
                    }
                })
                
                resolve("f");
            }
            this.image.src = src;
        })
    }

}

class keyBoard{
    constructor(){
        this.keys = []

        this.jump_delay = undefined;

        var that = this;

        document.onkeyup = e => {that.keys.splice(that.keys.indexOf(e.keyCode), 1)}

        document.onkeydown = function (event){
            if (!that.keys.includes(event.keyCode) && [87, 68, 65].includes(event.keyCode)) that.keys.push(event.keyCode);
            if (event.key == "'" ) return false;
            if (event.key == "F5") {on_start(); return false};
            return true;
        }

        this.interval = setInterval(function(){
            that.checkKeys();
         }, 20);
    }

    async checkKeys(){
        if (this.keys.includes(87) && !player.jumping){
            // w is down
            if (this.jump_delay == undefined || performance.now() - this.jump_delay > 1300 ){
                player.jump();
                this.jump_delay = performance.now()
            }
        } 
        if (this.keys.includes(68) && !player.move){
            // d is down
            player.moveToRight();
        }
        if (this.keys.includes(65) && !player.move){
            // a is down
            player.moveToLeft();
        }
    }
}

class Animation {
    constructor(images, background){
        this.draw = new Promise(async (resolve, reject) => {
            for (let i = 0; i < images.length; i++){
                var img = new DrawImage(images[i][0], images[i][1], images[i][2], images[i][3], images[i][4]);
                
                await img.draw;
                await timeout(images[i][5]);
                // var clear = new Clear(background[0], images[i][1]- background[1], images[i][2]- background[2], 100, images[i][4], images[i][1], images[i][2], images[i][3], images[i][4])
                // await clear.replace;
            }
            resolve("")
        })
    }


    clear(x, y, w, h){
        var clear = new Clear();
        clear.replace("index.jpg", x, y, w, h, x, y , w, h)
    }
}

class Clear{
    // sx = source x
    // sy = source y
    // sw = source width
    // sh = source height
    // dx = destention x
    // dy = destention y
    // dw = destention width
    // dh = destetnion height
    // "index.jpg", deleting_img.x - background.x, deleting_img.y - background.y, deleting_img.width, deleting_img.height, deleting_img.x, deleting_img.y, deleting_img.width , deleting_img.height
    constructor(){

    }

    replace(src, sx, sy, sw, sh, dx, dy, dw, dh){
        var image = new Image();
        return new Promise((resolve, reject) => {
            
            image.onload = function(){
               ctx.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
               resolve("Draw");
            }
            image.src = src;

            
        });
    }
}


function play_sound(path) {
    var url = "./" + path;
    window.AudioContext = window.AudioContext||window.webkitAudioContext; //fix up prefixing
    var context = new AudioContext(); //context
    var source = context.createBufferSource(); //source node
    source.connect(context.destination); //connect source to speakers so we can hear it
    var request = new XMLHttpRequest();
    request.open('GET', url, true); 
    request.responseType = 'arraybuffer'; //the  response is an array of bits
    request.onload = function() {
        context.decodeAudioData(request.response, function(response) {
            source.buffer = response;
            source.start(0); //play audio immediately
            source.loop = true;
        }, function () { console.error('The request failed.'); } );
    }
    request.send();
}


function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function on_start(){
    return new Promise(async resolve => {
        
        canvas.style.position = "relative";
        
        background = new Background('background_test.jpg');
        
        ctx.canvas.width  = window.innerWidth - 30 ;
        
        ctx.canvas.height = (await background.pos)[1];
        
        await background.draw();
        
        player = new Player(400, canvas.height - 500, 100, 100);

        scroll = new Scroll((await background.pos)[1]);
        
        physics = new Physics();
        physics1 = new Physics1();
        
        player.stand();

        questions.push(setInterval(async function(){
            if(questioning) return
            question = true;
            var question = new Question();
            await question.random_question()
            var result = await question.draw()
            console.log(result)
            if (!result) {gameOver(); return}

            questioning = false;
        }, 9000));

        // var rect = new Rect(10, 2000, 16, 9, 20)
        // rect.setColor("#FF0000")
        // await rect.draw()

        // window.onmousemove = function (event) {
        //     console.log("x:", event.clientX, "y:", event.clientY);
        // }   

        // platform = new PlatformGenerator(130, 40);
        // platform.generate(canvas.height - 300, true);
        resolve("done");
    })
}