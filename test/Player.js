class Player{
    constructor(x, y, width, height){
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;

        this.move_speed = 40;
        this.move_total_time = 400; // ms
        this.jump_height = 90;

        this.jumping = false;
        this.move = false;
        this.flip = false;

        this.image = new Image();
    }

    async stand(func=undefined){

        var result = await physics.check_locations([[this.x, this.y, this.width, this.height]])

        if ((result[1][0]) & result[1][1] == 0){
            //fall
            this.fall(result[1][2])
            return
        } else if (result[0].length == 1 || result[0].includes(0)){
            // collosion
            return
        }

        if (!this.flip){
            var stand = new DrawImage(this.image);
            await stand.draw('images/standing.png', this.x, this.y, this.width, this.height);
        } else {
            var stand = new DrawImage(this.image);
            await stand.draw('images/standing.png', this.x, this.y, this.width, this.height, 0, -1, 0, false);
        }
        this.move = false;
        if (func != 'jump'){
            this.jumping = false;

        }
    }
    
    async moveToRight(){
        this.flip = true;
        this.move = true;

        var result = await physics.check_locations([[this.x + this.move_speed/3, this.y, this.width, this.height], [this.x + (2*(this.move_speed/3)), 
            this.y, this.width, this.height], [this.x + (3*(this.move_speed/3)), this.y, this.width, this.height]])

        if ((result[1][0] & result[1][1] == 0)){
            //fall
            this.fall(result[1][2])
            return
        } else if (result[0].length == 3 || result[0].includes(0)){
            // collosion
            return
        }

        await this.clear()

        this.x += this.move_speed/3;
        var walk1 = new DrawImage(this.image);
        await walk1.draw('images/walk//walking1.png', this.x, this.y, this.width, this.height, 0, -1, 0, false);

        await timeout(this.move_total_time/3);
         
        await this.clear()

        if ((result[1][0] & result[1][1] == 1)){
            //fall
            this.fall(result[1][2])
            return
        } else if (result[0].includes(1)){
            stand()
            return 
        }

        this.x += this.move_speed/3;

        var walk1 = new DrawImage(this.image);
        await walk1.draw('images/walk//walking2.png', this.x, this.y, this.width, this.height, 0, -1, 0, false);

        await timeout(this.move_total_time/3);
        
        await this.clear()

        if ((result[1][0] & result[1][1] == 2)){
            //fall
            this.fall(result[1][2])
            return
        } else if (result[0].includes(2)){
            stand()
            return 
        }

        this.x += this.move_speed/3;

        var walk1 = new DrawImage(this.image);
        await walk1.draw('images/walk//walking3.png', this.x, this.y, this.width, this.height, 0, -1, 0, false);

        await timeout(this.move_total_time/3);
        
        await this.clear()
 
        this.stand();
        this.move = false;
    }

    async clear(){
        return new Promise(async resolve => {
            var clear = new Clear("background_test.jpg", this.x, this.y-(canvas.height-1624), this.width, this.height, this.x, this.y, this.width,this.height)
            await clear.draw;
            resolve("Clear");
        })
    }

    async fall(fall_distance){
        if (this.flip){
            var flip = -1;
        } else {
            var flip = 0;
        }

        var jumps = Math.round(fall_distance/this.jump_height);

        await new Promise(async resolve => {
            for (let i = 0; i < jumps-1; i++){
                await this.clear()

                this.y += this.jump_height;
                fall_distance -= this.jump_height;
                var jump2 = new DrawImage(this.image);
                await jump2.draw('images/jump/jumping2.png', this.x, this.y, this.width, this.height, 0, flip, 0, false);

                await timeout(150);

                
            }
            resolve("finished")
        });
        
        await this.clear()
        
        this.y += fall_distance;
 
        fall_distance -= fall_distance;

        var jump1 = new DrawImage(this.image);
        await jump1.draw('images/jump/jumping1.png', this.x, this.y, this.width, this.height, 0, flip, 0, false);

        await timeout(150);

        await this.clear()

        this.stand()
    }

    async moveToLeft(){
        var result = await physics.check_locations([[this.x - this.move_speed/3, this.y, this.width, this.height], [this.x - (2*(this.move_speed/3)), 
            this.y, this.width, this.height], [this.x - (3*(this.move_speed/3)), this.y, this.width, this.height]])

        if ((result[1][0] & result[1][1] == 0)){
            //fall
            this.fall(result[1][2])
            return
        } else if (result[0].length == 3 || result[0].includes(0)){
            // collosion
            return
        }

        this.flip = false;
        this.move = true;
        await this.clear()

        this.x -= this.move_speed/3;
        var walk1 = new DrawImage(this.image);
        await walk1.draw('images/walk//walking1.png', this.x, this.y, this.width, this.height);

        await timeout(this.move_total_time/3);
         
        await this.clear()

        if ((result[1][0] & result[1][1] == 1)){
            //fall
            this.fall(result[1][2])
            return
        } else if (result[0].includes(1)){
            stand()
            return 
        }

        this.x -= this.move_speed/3;

        var walk1 = new DrawImage(this.image);
        await walk1.draw('images/walk//walking2.png', this.x, this.y, this.width, this.height);

        await timeout(this.move_total_time/3);
        
        await this.clear()

        if ((result[1][0] & result[1][1] == 2)){
            //fall
            this.fall(result[1][2])
            return
        } else if (result[0].includes(2)){
            stand()
            return 
        }

        this.x -= this.move_speed/3;

        var walk1 = new DrawImage(this.image);
        await walk1.draw('images/walk//walking3.png', this.x, this.y, this.width, this.height);

        await timeout(this.move_total_time/3);
        
        await this.clear()
        

        this.stand()
        this.move = false;
        
    }

    async jump(flip=0){
        if (this.flip){
            var flip = -1;
        } else {
            var flip = 0;
        }
        var starting_y = this.y;
        this.jumping = true;
        
        var result = await physics.check_locations([[this.x, this.y, this.width, this.height], [this.x, 
            this.y-this.jump_height, this.width, this.height]])

        if ((result[1][0] && result[1][2] != this.jump_height) & result[1][1] == 1){
            //fall
            this.fall(result[1][2])
            return
        } else if (result[0].length == 2 || result[0].includes(0)){
            // collosion
            return
        }

        await this.clear()

        var jump1 = new DrawImage(this.image);
        await jump1.draw('images/jump/jumping1.png', this.x, this.y, this.width, this.height, 0, flip, 0, false);
        
        await timeout(230);

        await this.clear()

        this.y -= this.jump_height;

        var jump2 = new DrawImage(this.image);
        await jump2.draw('images/jump/jumping2.png', this.x, this.y, this.width, this.height, 0, flip, 0, false);

        await timeout(150);

        await this.clear()
        
        this.y += this.jump_height;

        if (this.y != starting_y) this.y = starting_y
   
        jump1 = new DrawImage(this.image);
        await jump1.draw('images/jump/jumping1.png', this.x, this.y, this.width, this.height, 0, flip, 0, false);

        await timeout(150);

        await this.clear()

        this.stand("jump");
        await timeout(200)
        this.jumping = false;
    }
}