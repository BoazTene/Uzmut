class Player{
    constructor(x, y, width, height){
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;

        this.move_speed = 15;
        this.move_total_time = 400; // ms

        this.jumping = false;
        this.move = false;
        this.flip = false;
    }

    async stand(){
        if (!this.flip){
            var stand = new DrawImage();
            await stand.draw('images/standing.png', this.x, this.y, this.width, this.height);
        } else {
            var stand = new DrawImage();
            await stand.draw('images/standing.png', this.x, this.y, this.width, this.height, 0, -1, 0, false);
        }
    }
    
    async moveToRight(){
        this.flip = true;
        this.move = true;

        var clear = new Clear("background_test.jpg", this.x, this.y-(canvas.height-1624), this.width, this.height, this.x, canvas.height-300, this.width,this.height)
        await clear.draw;

        this.x += this.move_speed/3;
        var walk1 = new DrawImage();
        await walk1.draw('images/walk//walking1.png', this.x, this.y, this.width, this.height, 0, -1, 0, false);

        await timeout(this.move_total_time/3);
         
        var clear = new Clear("background_test.jpg", this.x, this.y-(canvas.height-1624), this.width, this.height, this.x, canvas.height-300, this.width,this.height)
        await clear.draw;

        this.x += this.move_speed/3;

        var walk1 = new DrawImage();
        await walk1.draw('images/walk//walking2.png', this.x, this.y, this.width, this.height, 0, -1, 0, false);

        await timeout(this.move_total_time/3);
        
        var clear = new Clear("background_test.jpg", this.x, this.y-(canvas.height-1624), this.width, this.height, this.x, canvas.height-300, this.width,this.height)
        await clear.draw;

        this.x += this.move_speed/3;

        var walk1 = new DrawImage();
        await walk1.draw('images/walk//walking3.png', this.x, this.y, this.width, this.height, 0, -1, 0, false);

        await timeout(this.move_total_time/3);
        
        var clear = new Clear("background_test.jpg", this.x, this.y-(canvas.height-1624), this.width, this.height, this.x, canvas.height-300, this.width,this.height)
        await clear.draw;

        this.stand();
        this.move = false;
    }

    async moveToLeft(){
        this.flip = false;
        this.move = true;
        var clear = new Clear("background_test.jpg", this.x, this.y-(canvas.height-1624), this.width, this.height, this.x, canvas.height-300, this.width,this.height)
        await clear.draw;

        this.x -= this.move_speed/3;
        var walk1 = new DrawImage();
        await walk1.draw('images/walk//walking1.png', this.x, this.y, this.width, this.height);

        await timeout(this.move_total_time/3);
         
        var clear = new Clear("background_test.jpg", this.x, this.y-(canvas.height-1624), this.width, this.height, this.x, canvas.height-300, this.width,this.height)
        await clear.draw;

        this.x -= this.move_speed/3;

        var walk1 = new DrawImage();
        await walk1.draw('images/walk//walking2.png', this.x, this.y, this.width, this.height);

        await timeout(this.move_total_time/3);
        
        var clear = new Clear("background_test.jpg", this.x, this.y-(canvas.height-1624), this.width, this.height, this.x, canvas.height-300, this.width,this.height)
        await clear.draw;

        this.x -= this.move_speed/3;

        var walk1 = new DrawImage();
        await walk1.draw('images/walk//walking3.png', this.x, this.y, this.width, this.height);

        await timeout(this.move_total_time/3);
        
        var clear = new Clear("background_test.jpg", this.x, this.y-(canvas.height-1624), this.width, this.height, this.x, canvas.height-300, this.width,this.height)
        await clear.draw;

        this.stand()
        this.move = false;
        
    }

    async jump(flip=0){
        if (this.flip){
            var flip = -1;
        } else {
            var flip = 0;
        }
        this.jumping = true;
        var space = 10;

        var clear = new Clear("background_test.jpg", this.x, (this.y-(canvas.height-1624)), this.width, this.height, this.x-(space/2), this.y-(space/2), this.width+(space/2),this.height+(space/2))
        await clear.draw;

        var jump1 = new DrawImage();
        await jump1.draw('images/jump/jumping1.png', this.x, this.y, this.width, this.height, 0, flip, 0, false);
        
        await timeout(150);

        var clear = new Clear("background_test.jpg", this.x, (this.y-(canvas.height-1624)), this.width, this.height, this.x-(space/2), this.y-(space/2), this.width+(space/2),this.height+(space/2))
        await clear.draw;
        
        this.y -= 20;

        var jump2 = new DrawImage();
        await jump2.draw('images/jump/jumping2.png', this.x, this.y, this.width, this.height, 0, flip, 0, false);

        await timeout(150);

        var clear = new Clear("background_test.jpg", this.x, (this.y-(canvas.height-1624)), this.width, this.height, this.x-(space/2), this.y-(space/2), this.width+(space/2),this.height+(space/2))
        await clear.draw;
        
        this.y += 20;

        jump1 = new DrawImage();
        await jump1.draw('images/jump/jumping1.png', this.x, this.y, this.width, this.height, 0, flip, 0, false);

        await timeout(150);

        var clear = new Clear("background_test.jpg", this.x, (this.y-(canvas.height-1624)), this.width, this.height, this.x-(space/2), this.y-(space/2), this.width+(space/2),this.height+(space/2))
        await clear.replace;

        this.stand();
        await timeout(50)
        this.jumping = false;
    }
}