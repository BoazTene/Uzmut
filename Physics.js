

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
            var result = [[], [false]];
            for (let location = 0; location < locations.length; location++){

                for (let i = 0; i < this.NOT_PERMITTED.length; i++){
                    if (this.check_location(locations[location], this.NOT_PERMITTED[i])) result[0].push(location);

                    if (this.check_fall(locations[location], this.NOT_PERMITTED[i]) && result[1][0] ==  false) 
                        result[1] = [true, i, this.calc_fall_height(locations[location], this.NOT_PERMITTED[i])];
                }
           }   

            resolve(result)
        });
    }

    check_location(location1, location2){
        return (location1[0] > location2[0] && location1[0] < location2[2]+location2[0]) &&  (location1[1] > location2[1] && location1[1] < location2[1] + location2[3])
    }

}