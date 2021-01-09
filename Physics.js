



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
            [0, canvas.height, canvas.width, 500], 
            [878, 28443, 400, 45],
            [1038, 28274, 400, 45], 
            [1338, 28079, 400, 45], 
            [1318, 27934, 400, 45], 
            [1358, 27683, 400, 45], 
            [472, 27473, 800, 45], 
            [0, 27283, 400, 45], 
            [558, 27068, 400, 45], 
            [1138, 26867, 400, 45], 
            [838, 26625, 400, 45], 
            [608, 26391, 400, 45], 
            [1134, 26160, 550, 45], 
            [1713, 25925, 400, 45], 
            [1384, 25685, 400, 45], 
            [721, 25449, 600, 45], 
            [371, 25214, 400, 45], 
            [880, 24977, 770, 45], 
            [1694, 24749, 400, 45], 
            [410, 24742, 400, 45], 
            [31, 24506, 400, 45], 
            [1408, 24268, 400, 45], 
            [1900, 24027, 400, 45], 
            [1600, 23786, 400, 45], 
            [1964, 23545, 400, 45], 
            [1728, 23304, 400, 45], 
            [1200, 23123, 400, 45], 
            [461, 24268, 400, 45], 
            [64, 24030, 400, 45], 
            [934, 22948, 400, 45],
            [342, 22784, 400, 45],
            [803, 22550, 400, 45],
            [1348, 22311, 400, 45],
            [1442, 22074, 400, 45],
            [876, 21845, 400, 45],
            [1449, 21613, 400, 45],
            [868, 21381, 400, 45],
            [1441, 21149, 400, 45],
            [895, 20909, 400, 45],
            [1468, 20677, 400, 45],
            [1427, 20439, 400, 45],
            [2007, 20237, 400, 45],
            [1707, 19996, 400, 45],
            [1477, 19762, 400, 45],
            [1026, 19617, 400, 45],
            [647, 19381, 400, 45],
            [1077, 19143, 400, 45],
            [680, 18905, 400, 45],
            [1184, 18626, 300, 45],
            [1654, 18385, 300, 45],
            [2053, 18144, 300, 45],
            [2094, 17903, 300, 45],
            [2064, 17759, 300, 45],
            [2107, 17518, 300, 45],
            [1748, 17289, 300, 45],
            [1450, 17518, 300, 45],
            [1150, 17804, 300, 45],
            [988, 18058, 300, 45],
            [680, 18340, 300, 45],
            [380, 18104, 300, 45],
            [172, 17868, 300, 45],
            [0, 17631, 300, 45],
            [380, 17429, 300, 45],
            [810, 17192, 300, 45],
            [726, 16956, 300, 45], //s
            [1338, 16738, 300, 45],
            [1841, 16501, 300, 45],
            [1350, 16263, 300, 45],
            [1827, 16029, 300, 45],
            [2107, 15788, 300, 45],
            [2020, 15499, 300, 45],
            [1577, 15272, 300, 45],
            [2057, 15031, 300, 45],
            [1568, 14790, 300, 45],
            [1078, 14549, 300, 45],
            [584, 14310, 300, 45]
            
        ]
        this.ml = 50;
        this.fall = false;
        this.jump = undefined;
        this.scale()
        this.interval = setInterval(this.check, this.ml, this)
    }

    async scale(){
        for (let i = 0; i < this.NOT_PERMITTED.length; i++){
            this.NOT_PERMITTED[i][0] /= ((await background.pos)[0]/(window.innerWidth))
            this.NOT_PERMITTED[i][2] /= ((await background.pos)[0]/(window.innerWidth))
        }
    }

    check_fall(location, jump=false){
        if (!jump && player.jumping) return false
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
        // return Math.abs((player.y+player.width)- );
    }

    check_hit(location){
        return false
        var space = 30;

        var x = player.x - space/2;
        var y = player.y    ;
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

    check(that, jump=false){
        return new Promise(async resolve => {
            var fall = [that.check_fall(that.NOT_PERMITTED[0], jump),  0, that.calc_fall_height(that.NOT_PERMITTED[0])]
            var hit = [that.check_hit(that.NOT_PERMITTED[0]), that.find_closest_line(that.NOT_PERMITTED[0])]
            for (let i = 1; i < that.NOT_PERMITTED.length; i++){
                if (that.check_fall(that.NOT_PERMITTED[i], jump) && that.calc_fall_height(that.NOT_PERMITTED[i]) < fall[2]){
                    fall = [true, i, that.calc_fall_height(that.NOT_PERMITTED[i]) ];
                }
                if(that.check_hit(that.NOT_PERMITTED[i])) hit = [true, that.find_closest_line(that.NOT_PERMITTED[i])]
            }

            if (player.jumping && that.jump != undefined & performance.now() - that.jump > 2000){player.jumping = false; that.jump = undefined;}
            if (hit[0]) {player.physics_stop = true;} else player.physics_stop = false;
            if (fall[1] != 0) fall[2] -= 70;
            if (fall[0] && !that.fall && fall[2] != 0 && fall[2] != player.jump_height){
                player.physics_stop = true
                player.physics_stop_jump = true;
                that.fall = true;
                // player.y += fall[2]-player.jump_height;
                await player.fall(fall[2])
                if (jump) resolve(false)

                // player.fall(fall[1])
            } 
            if (player.x < -30) player.x = canvas.width + 30  
            if (player.x > canvas.width + 30) player.x = -30      
            if (jump) resolve(false)
            resolve()
        })
    }
            
        
}