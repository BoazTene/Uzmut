var canvas = document.getElementById("canvas");
var ctx = canvas.getContext('2d');


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
    constructor(){
        this.image = new Image();
    }

    draw(src, x, y, width=undefined, height=undefined, deg=undefined, flip=undefined, flop=undefined, center=undefined){
        return new Promise(resolve => {
            this.image.onload = function() {
                if ((width != undefined && height != undefined) && deg == undefined && flip == undefined && flop == undefined && center == undefined){
                    ctx.drawImage(this, x, y, width, height);    
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
                    var rad = 2 * Math.PI - deg * Math.PI / 180;    
                    ctx.rotate(rad);

                    // Flip/flop the canvas
                    if(flip) flipScale = -1; else flipScale = 1;
                    if(flop) flopScale = -1; else flopScale = 1;
                    ctx.scale(flipScale, flopScale);

                    // Draw the image    
                    ctx.drawImage(this, -width/2, -height/2, width, height);

                    ctx.restore();
                } else {
                    ctx.drawImage(this, x, y);
                }
                resolve("f");
            }
            this.image.src = src;
        })
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
    constructor(src, sx, sy, sw, sh, dx, dy, dw, dh){
        this.replace = new Promise((resolve, reject) => {
            var image = new Image();
            image.onload = function(){
               ctx.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
               resolve("Draw");
            }
            image.src = src;

        
        })
    }
}

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function on_start(){
    ctx.canvas.width  = window.innerWidth - 30 ;
    ctx.canvas.height = window.innerHeight - 35 ;
    // canvas.style.top = ((window.innerHeight/100) * 7) + "px";
    canvas.style.position = "relative";
    background = new DrawImage()
    await background.draw("background_test.jpg", 0, canvas.height-1624);
    player = new Player(100, canvas.height - 300, 100, 100);
    player.stand()
}