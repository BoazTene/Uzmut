



class Physics{
    constructor(){
        this.NOT_PERMITTED = [
            [0, canvas.height, canvas.width, 300]
        ]
    }

    check_fall(location1, location2){
        return  (location1[1] < location2[1] - location2[3]) && (location1[0] > location2[0] && location1[0] < location2[2]+location2[0])
    }

    calc_fall_height(location1, location2){
        return (location2[1] - location2[3]) - location1[1]
    }

    check_locations(locations){
        return new Promise(resolve =>{
            var result = [[], [undefined]];
            for (let location = 0; location < locations.length; location++){

                for (let i = 0; i < this.NOT_PERMITTED.length; i++){
                    if (this.check_location(locations[location], this.NOT_PERMITTED[i])) {result[0].push(location)}

                    if (this.check_fall(locations[location], this.NOT_PERMITTED[i]) && result[1][0] != false && this.check_fall(locations[location], this.NOT_PERMITTED[i]) < result[1][1]) 
                        result[1] = [true, i, this.calc_fall_height(locations[location], this.NOT_PERMITTED[i])];
                    else
                        result[1] = [false];
                }
           }   
            if (result[1][0] == undefined) result[1][0] = false;
            resolve(result)
        });
    }

    check_location(location1, location2){
        return ((location1[0] > location2[0] && location1[0] < location2[2]+location2[0]) && location1[1] > (location2[1]-location2[3]) && (location1[1]-location1[3]*2) < location2[1])
    }

}

class Physics1{
    
    constructor(){
        this.NOT_PERMITTED = [
            [0, canvas.height, canvas.width, 300]
        ]
        this.ml = 50;
        this.fall = false;
        setInterval(this.check, this.ml, this)
    }

    check_fall(location){
        var x = player.x + player.width;
        var x1 = player.x;
        // if (player.flip) x = player.x ;
        // console.log((player.y < location[1]) && (x > location[0] && x < location[2]+location[0]), 2)
        // 
        // (player.y < location[1]) && (x > location[0] && x < location[2]+location[0]) 
        if (!player.flip){
            var player_x = player.x;
            // if (player.flip) player_x = player.x + player.width;

            var left_right = (location[2]/100)*(player_x-location[0]);
            if (left_right < location[2]/5) left_right = 2; else left_right = 3;

            if (left_right == 3){
                return  (player.y+player.height < location[1]) && (x1 > location[0] && x1 < location[2]+location[0])
            } else {
                return (player.y+player.height < location[1]) && (x > location[0] && x < location[2]+location[0])
            }
        } else {
            x = player.x;
            x1 = player.x + player.width;
            var player_x = player.x + player.width;
            // if (player.flip) player_x = player.x + player.width;
            var left_right = (location[2]/100)*(player_x - location[0]);
            if (Math.abs(left_right) - location[2] >= location[2]/5) left_right = 2; else left_right = 3;
            
            if (left_right == 3){
                return  (player.y+player.height < location[1]) && (x1 > location[0] && x1 < location[2]+location[0])
            } else {
                return (player.y+player.height < location[1]) && (x > location[0] && x < location[2]+location[0])
            }
        }
        // return  (player.y < location[1] - location[3]) && (x > location[0] && x < location[2]+location[0])
    }

    calc_fall_height(location){
        return Math.abs(player.y- (location[1] - location[3]));
    }

    check_hit(location){
        var space = 30;

        var x = player.x - space/2;
        var y = player.y 
        ;
        var width = player.width ;
        if (player.flip) x = player.x + width + space/2;

        return (x > location[0] && x < location[2]+location[0]) &&  (y + player.height > location[1] && y < location[1] + location[3])
    }

    find_closest_line(location){
        // The follwing rect reprsent an obstical
        // on each line of the rect will be a number that represent the number that will return if the line is the closest to the player
        //               1
        //   --------------------------- 
        //   |                         |
        //  2|                         |3
        //   |                         |
        //   |                         |
        //   ---------------------------
        //                0
        var player_x = player.x;
        if (player.flip) player_x = player.x + player.width;

        var left_right = (location[2]/100)*(player_x-location[0]);
        var up_down = (location[3]/100)*(location[1]-player.y);

        var x;
        var y;

        if (left_right < location[2]/2) x = [2, left_right]; else x = [3, location[2]-left_right];
        if (up_down < location[3]/2) y = [1, up_down]; else y = [1, location[3]-up_down];

        if (x[1] > y[1] && player.y < location[1]) return y[0]; else return x[0];
    }

    check(that){
        return new Promise(resolve => {
            var fall = [that.check_fall(that.NOT_PERMITTED[0]),  0, that.calc_fall_height(that.NOT_PERMITTED[0])]
            var hit = [that.check_hit(that.NOT_PERMITTED[0]), that.find_closest_line(that.NOT_PERMITTED[0])]
            for (let i = 1; i < that.NOT_PERMITTED.length; i++){
                if (that.check_fall(that.NOT_PERMITTED[i]) && that.calc_fall_height(that.NOT_PERMITTED[i]) < fall[2]){
                    fall = [true, i, that.calc_fall_height(that.NOT_PERMITTED[i]) ];
                }
                if(that.check_hit(that.NOT_PERMITTED[i])) hit = [true, that.find_closest_line(that.NOT_PERMITTED[i])]
            }

            if (hit[0]) {player.physics_stop = true;} else player.physics_stop = false;
            if (fall[1] != 0) fall[2] -= 70;
            if (fall[0] && !that.fall && fall[2] != 0 && fall[2] != player.jump_height){
                player.physics_stop = true
                player.physics_stop_jump = true;
                that.fall = true;
                // player.y += fall[2]-player.jump_height;
                player.fall(fall[2])
                
                // player.fall(fall[1])
            } else {
                
                
            }
            resolve()
            })
            }
            
        
}