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
                ctx.drawImage(this, 0, canvas.height - (await that.pos)[1]);
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
        this.onStart()

        this.scroll(0);
    }

    async onStart(){
        divCanvas.style.maxWidth = (window.innerWidth - 30) + "px";
        divCanvas.style.maxHeight = this.background_height + "px";
        divCanvas.style.width =  window.innerWidth - 30  + "px";
        divCanvas.style.height = window.innerHeight - 35  + "px";
    }

    scroll(px){
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
        ctx.fillRect(this.x, this.y, this.width, this.height)
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
                
                console.log("resolve")
                resolve("f");
            }
            this.image.src = src;
        })
    }

}

class keyBoard{
    constructor(){
        this.keys = []

        var that = this;

        document.onkeyup = e => {that.keys.splice(that.keys.indexOf(e.keyCode), 1)}

        document.onkeydown = function (event){
            if (!that.keys.includes(event.keyCode) && [87, 68, 65].includes(event.keyCode)) that.keys.push(event.keyCode);
        }

        setInterval(function(){
            that.checkKeys();
         }, 150);
    }

    async checkKeys(){
        if (this.keys.includes(87) && !player.jumping){
            // w is down
            player.jump();
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

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function on_start(){
    return new Promise(async resolve => {
        canvas.style.position = "relative";
        
        var background = new Background('background_test.jpg');

        ctx.canvas.width  = window.innerWidth - 30 ;
        ctx.canvas.height = (await background.pos)[1];
        
        await background.draw()

        scroll = new Scroll((await background.pos)[1]);
        
        player = new Player(100, 700, 100, 100);

        physics = new Physics();

        player.stand()
        resolve("done")
    })
}