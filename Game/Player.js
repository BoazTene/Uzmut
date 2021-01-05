class Player{
    constructor(x, y, width, height){
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;

        this.move_speed = 60;
        this.move_total_time = 200; // ms
        this.jump_height = 250;
        this.jump_time_ground = 160;
        this.jump_time_air = 550;

        this.jumping = false;
        this.move = false;
        this.flip = false;
        this.physics_stop = false;
        this.physics_stop_jump = false;

        this.image = new Image();
    }

    async stand(func=undefined){

        // var result = await physics.check_locations([[this.x, this.y, this.width, this.height]])

        // if (((result[1][0]) & result[1][1] == 0) && !this.jumping){
        //     //fall
        //     this.fall(result[1][2])
        //     return
        // } else if (result[0].length == 1 || result[0].includes(0)){
        //     // collosion
        //     return
        // }

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
        return new Promise(async resolve => {
            this.flip = true;
            this.move = true;
            var move = new Move(this, this.flip);
            var result = await move.moveToRight()
        
            this.move = false;
            if (!this.jumping) this.stand();
            resolve("Done")
        })
        
        
    }

    async clear(sx=this.x, sy=this.y-(canvas.height-5732), sw=this.width, sh=this.height, dx=this.x, dy=this.y, dw=this.width, dh=this.height){
        return new Promise(async resolve => {
            var clear = new Clear()
            //, this.x, this.y-(canvas.height-5732), this.width, this.height, this.x, this.y, this.width, this.height
            await clear.replace("background_test.jpg", sx, sy, sw, sh, dx, dy, dw, dh);
            resolve("Clear");
        })
    }

    async fall(fall_distance){

        var jumps = Math.round(fall_distance/this.jump_height);
        var that = Object.assign({}, this.that)

        await new Promise(async resolve => {
            // scroll.scroll(this.y-200)
            for (let i = 0; i < jumps-1; i++){
                await this.clear(this.x, this.y-(canvas.height-5732), this.width, this.height, this.x, this.y, this.width, this.height)

                this.y += this.jump_height;
                that.y += this.jump_height;
                scroll.scroll(-this.jump_height, true)
                fall_distance -= this.jump_height;
                var jump2 = new DrawImage();
                await jump2.draw('images/jump/jumping2.png', this.x, this.y, this.width, this.height, 0, this.flip, 0, false);

                await timeout(150);

                
            }
            resolve("finished")
        });
        
        await this.clear(this.x, this.y-(canvas.height-5732), this.width, this.height, this.x, this.y, this.width, this.height)
        await this.clear()
        
        this.y += fall_distance;
        that.y += fall_distance;

        scroll.scroll(-fall_distance, true)
 
        fall_distance -= fall_distance;

        
        


        var jump1 = new DrawImage(this.image);
        
        await jump1.draw('images/jump/jumping1.png', this.x, this.y, this.width, this.height, 0, this.flip, 0, false);
        
        await timeout(150);
        

        await this.clear(this.x, this.y-(canvas.height-5732), this.width, this.height, this.x, this.y, this.width, this.height)
        
        physics1.fall = false;
        this.stand('jump')
        
        
    }

    async moveToLeft(){
        return new Promise(async resolve =>{
            this.flip = false;
            this.move = true;
            var move = new Move(this, this.flip);
            var result =  await move.moveToLeft();
            this.move = false;
            if (!this.jumping) this.stand();
            resolve("done")
        })

        
        
    }

    async jump(flip=0){
        return new Promise(async resolve => {
            this.jumping = true;
            var move = new Move(this, this.flip);
            
            var result = await move.jump();

            // if (result[0] == true) this.fall(result[1]-90)
            
            this.jumping = false;
            if (!this.move) this.stand();
            resolve("done");
        })
        
    }
}

class Move{
    constructor(that, flip){
        this.that = that;
        if (flip) this.flip = -1; else this.flip = 0;
    }

    async clear(sx=this.that.x, sy=this.that.y-(canvas.height-5732), sw=this.that.width, sh=this.that.height, dx=this.that.x, dy=this.that.y, dw=this.that.width, dh=this.that.height){
        return new Promise(async resolve => {
            var clear = new Clear()
            //, this.that.x, this.that.y-(canvas.height-5732), this.that.width, this.that.height, this.that.x, this.that.y, this.that.width, this.that.height
            await clear.replace("background_test.jpg", sx, sy, sw, sh, dx, dy, dw, dh);
            resolve("Clear");
        })
    }
    
    physicsResult(locations){
        return new Promise(async resolve => {
            var result = await physics.check_locations(locations);
            
            var returnValue = [[], []];
            if (result[1][0] == false){
                returnValue[1][0] = false;
            } else {
                result[0].push(result[1][1]);
                returnValue[1] = [true, result[1][2]];
            }
            if (result[0] == []) result[0].push(2)
            returnValue[0] = Math.min(...result[0]);
            
            resolve([[3], [false]])
            // resolve(returnValue)
        });
    }

    drawPlayer(image_path, image=undefined){
        return new Promise(async resolve => {
            if (image == undefined) var img = new DrawImage(this.that.image); else var img = new DrawImage(image);
            await img.draw(image_path, this.that.x, this.that.y, this.that.width, this.that.height, 0, this.that.flip, 0, false);
            resolve("draw")
        });
    }

    get_images(images){
        if (!this.that.jumping) {
            return images;
        } else {
            return ['images/jump/jumping2.png', 'images/jump/jumping2.png', 'images/jump/jumping2.png']
        }
    }

    async moveToRight(){
        // var result = await this.physicsResult([[this.that.x + this.that.move_speed/3, this.that.y, this.that.width, this.that.height],
        //     [this.that.x + (2*(this.that.move_speed/3)), this.that.y, this.that.width, this.that.height],
        //     [this.that.x + (3*(this.that.move_speed/3)), this.that.y, this.that.width, this.that.height]])
        this.flip = -1;
        var that = Object.assign({}, this.that)
        var images = this.get_images(['images/walk//walking1.png', 'images/walk//walking2.png', 'images/walk//walking3.png'])

        await this.clear(that.x, that.y-(canvas.height-5732), that.width, that.height, that.x, that.y, that.width, that.height);
        
        for (let i = 0; i < 3; i++){
            if (this.that.physics_stop) return
            if (!this.jumping){
                this.that.x += this.that.move_speed/3;
                that.x += this.that.move_speed/3
            } else {
                this.that.x += this.that.move_speed/5;
                that.x += this.that.move_speed/5;
            }
            // if (!this.that.jumping){
            //     this.that.x += this.that.move_speed/3;
            //     that.x += this.that.move_speed/3
            // } else {
            //     this.that.x += this.that.move_speed/6;
            //     that.x += this.that.move_speed/6;
            // }

            await this.drawPlayer(images[i]);

            //this.that.move_total_time/3
            await timeout(this.that.move_total_time/3);
            
            await this.clear(that.x, that.y-(canvas.height-5732), that.width, that.height, that.x, that.y, that.width, that.height);

            if(this.that.jumping != that.jumping  || this.that.jumping) break;
            images = this.get_images(['images/walk//walking1.png', 'images/walk//walking2.png', 'images/walk//walking3.png'])

        }

        if (this.that.jumping) {await this.drawPlayer(images[2]);}
    

    }

    async moveToLeft() {
        this.flip = 0;
        // var result = await this.physicsResult([[this.that.x - this.that.move_speed/3, this.that.y, this.that.width, this.that.height],
        //     [this.that.x - (2*(this.that.move_speed/3)), this.that.y, this.that.width, this.that.height],
        //     [this.that.x -(3*(this.that.move_speed/3)), this.that.y, this.that.width, this.that.height]])
        
        
        var images = this.get_images(['images/walk//walking1.png', 'images/walk//walking2.png', 'images/walk//walking3.png'])
        var image = new Image();
        var that  = Object.assign({}, this.that)

        await this.clear(that.x, that.y-(canvas.height-5732), that.width, that.height, that.x, that.y, that.width, that.height);

        for (let i = 0; i < 3; i++){
            if (this.that.physics_stop) return

            this.that.x -= this.that.move_speed/3;
            that.x -= this.that.move_speed/3;

            await this.drawPlayer(images[i], image);

            await timeout(this.that.move_total_time/3);

            await this.clear(that.x+5, that.y-(canvas.height-5732), that.width+5, that.height, that.x, that.y, that.width, that.height);

            images = this.get_images(['images/walk//walking1.png', 'images/walk//walking2.png', 'images/walk//walking3.png'])

            if(this.that.jumping != that.jumping  || this.that.jumping) break;
        }
        if (this.that.jumping) await this.drawPlayer(images[2]);

    }

    async jump() {
        // var result = await this.physicsResult([[this.that.x, this.that.y, this.that.width, this.that.height],
        //     [this.that.x - this.that.jump_height, this.that.y, this.that.width, this.that.height],
        //     [this.that.x, this.that.y, this.that.width, this.that.height]])
        
        var images = ['images/jump/jumping1.png', 'images/jump/jumping2.png', 'images/jump/jumping1.png']
        
        var image = new Image();

        // this.that.move = true;
        var that  = Object.assign({}, this.that)
        return new Promise(async resolve => {
            for (let i = 0; i < 3; i++){
                
                if (this.that.physics_stop_jump) {
                    this.that.physics_stop_jump = false;
                    this.that.jumping = false;
                    break
                }

                // await this.clear();
                await this.clear();
                await this.clear(that.x, that.y-(canvas.height-5732), that.width, that.height, that.x, that.y, that.width, that.height);
                
    

                if (i == 1){
                    scroll.scroll(this.that.jump_height);
                     this.that.y -= this.that.jump_height;
                     that.y -= this.that.jump_height
                }
                if (i == 2){
                    // this.that.move = false;
                    scroll.scroll(-this.that.jump_height);
                    this.that.y += this.that.jump_height;
                    that.y += this.that.jump_height;
    
                } 
                
                await this.clear();
                await this.drawPlayer(images[i], image);
                if (i != 1) await timeout(this.that.jump_time_ground); else await timeout(this.that.jump_time_air);
    
                // result = await this.physicsResult([[this.that.x, this.that.y, this.that.width, this.that.height],
                //     [this.that.x - this.that.jump_height, this.that.y, this.that.width, this.that.height],
                //     [this.that.x, this.that.y, this.that.width, this.that.height]])
            }
            // if (this.that.physics_stop) resolve()
            await this.clear();
            if (!this.that.move) player.stand("jump")
            // await timeout(200)
            
            await this.clear(that.x, that.y-(canvas.height-5732), that.width, that.height, that.x, that.y, that.width, that.height);
            // 
    
            // resolve(result)
            resolve()
        })
        
    }
}