class Platform{
    constructor(x, y, width, height, color="#00000"){
        this.width = width;
        this.height = height;
        this.y = y;
        this.x = x;

        this.rect = new Rect(x, y, width, height);
        this.rect.setColor(color);
    } 

    async draw(){
        return new Promise(async resolve => {
            await this.rect.draw();
            resolve();
        })
    }
}

class PlatformGenerator{
    constructor(width, height){
        this.width = width;
        this.height = height;
        this.last_x;
        this.last_y;
    }
    
    async generate1(){
        var y = this.last_y;
        var x = this.last_x;
        y -= Math.random() * 10 + 100;
        x = Math.random() * (( x+150 )- (x-150)) - x-150;
        while (((x > this.last_x - 100 && x < this.width+this.last_x + 100))) {
            x = Math.random() * (( x+190 )- (x-190)) - x-190;
        }
        console.log(x, y)
        var platform = new Platform(-x, y, this.width, this.height);
        await platform.draw();

        physics1.NOT_PERMITTED.push([-x, y, this.width, this.height])

        this.last_y = y;
    }

    async generate(starting_y, start=false){
        
        var y = starting_y;
        var x = Math.random() * canvas.width - this.width;
        while (((player.x > x && player.x < this.width+x) &&  (player.y + player.height > y && player.y < y + this.height))) {
            y = starting_y;
            x = Math.random() * canvas.width - this.width;
        }

        if (start) x = canvas.width/2;
        x = 20;
        y = 1995;
        var platform = new Platform(x, y, this.width, this.height);
        await platform.draw();
        physics.NOT_PERMITTED.push([x, y, this.width, this.height])
        physics1.NOT_PERMITTED.push([x, y, this.width, this.height])
        
        this.last_x = x;
        this.last_y = y;
        console.log(physics1.NOT_PERMITTED)
        
         
        while (y-starting_y > -window.innerHeight+400){
            y -= Math.random() * 10 + 100;
            x = Math.random() * (( x+200 )- (x-200)) - x-200;
            while (((x > this.last_x - 150 && x < this.width+this.last_x + 150))) {
                x = Math.random() * (( x+200 )- (x-200)) - x-200;
            }
           
            
            var platform = new Platform(x, y, this.width, this.height);
            await platform.draw();

            physics1.NOT_PERMITTED.push([x, y, this.width, this.height])
            console.log(x, y)
            this.last_x = x;
            this.last_y = y;
        }

        console.log(physics1.NOT_PERMITTED)
    }
}