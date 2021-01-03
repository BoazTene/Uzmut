

class ProgressBar{
    constructor(x, y, height, time){
        this.x = x;
        this.y = y;
        this.width = 0;
        this.max_width = canvas.width - 30;
        this.height = height;
        this.time = time;

        this.update = time/10;

        this.color = "#ff0800"; // red
        this.radius = 5;
    }

    async drawBar(){
        return new Promise(resolve => {
            var color = ctx.fillStyle;
            ctx.fillStyle = this.color;
            ctx.roundRect(this.x, this.y, this.width, this.height, {upperLeft:this.radius, upperRight:this.radius, lowerRight:this.radius, lowerLeft:this.radius}, true, true);
            ctx.fillStyle = color;
            resolve("Done")
        })
    }

    async draw(){
        let canceled = false;
        let cancel = () => {
            console.log("d")
            canceled = true;
        }
        var promise = new Promise(async (resolve, reject) => {
            if (canceled){
                reject("")
            }

            for (let i = 0; i < this.update && !canceled; i++){
                this.width += this.max_width/this.update;
                await this.drawBar();
                await timeout(this.update);
            }
            
            resolve("Done")
        })
        
        return { promise, cancel };
        
        
    }
}


// question example:
// question = new Question("What is the coolest thing alive?", [["lahoh", true], ["shaul", false], ["test", false]], 10);
// test = await question.draw();
// console.log(test)
class Question{
    // The question answers in this format [["text", true or false], ...] true for currect and false for wrong
    constructor(question_text, answers, time){
        this.text = question_text;
        this.answers = answers;
        this.number_of_answers = answers.length;
        this.time = time;
        this.radius = 20;
        this.font =  '48px serif';
        this.timeup = false;

        this.answers_coords = [];

        ctx.save();
        ctx.font = this.font;
        
        this.question_x = (canvas.width/2) - (ctx.measureText(this.text).width/2);
        console.log((canvas.height/2))
        console.log(ctx.measureText(this.text).height)
        this.question_y = (canvas.height/6) + 15;
        ctx.restore()

        this.progressBar = new ProgressBar(10, 10, 20, 1000)
    }

    async draw_answers(){
        var x = this.question_x * 1.2;
        var y =  this.question_y * 2;
        var height = 100;
        var font =  '40px serif';
        return new Promise(async resolve => {    
            for (let i = 0; i < this.number_of_answers; i++){
                
                await new Promise(resolve => {
                    ctx.save();
                    ctx.font = font;
                    var width = ctx.measureText(this.answers[i][0]).width;
                    ctx.fillStyle = "#0015ff";
                    ctx.roundRect(x, y, width+100, height, 
                        {upperLeft:this.radius, upperRight:this.radius, lowerRight:this.radius, lowerLeft:this.radius}, true, true);
                    
                    this.answers_coords.push([x, y, width+100, height])
                    
                    ctx.fillStyle = "#000000";
                    ctx.fillText(this.answers[i][0], x+(width/2), y+(height/2)+10);
                    resolve("done");
                })

                // if (i == 1) return

                await new Promise(resolve => {
                    x += 200;
                
                    if ((i % 2) != 0){
                        y += height * 1.4; x -= 400;
                    }
                    console.log(i)
                    ctx.restore()
                    resolve("done")
                })
            }
            this.timeup = true;
            resolve("done")
        })
    }

    async draw(){
        return new Promise(async (resolve, reject) => {
            var progressBar = (await this.progressBar.draw());
            console.log(progressBar)
            progressBar.promise.then(() =>{
                resolve(false)
            })
            ctx.font = this.font;
            
            ctx.fillText(this.text, this.question_x, this.question_y);

            await this.draw_answers()
            var that = this;

            canvas.onmousemove = function (event) {
                var hover = false;
                for (let i = 0; i < that.number_of_answers; i++){
                    if ((event.clientX < that.answers_coords[i][2]+that.answers_coords[i][0] && event.clientX > that.answers_coords[i][0]) 
                    && (event.clientY > that.answers_coords[i][1] && event.clientY < that.answers_coords[i][1] + that.answers_coords[i][3])) {
                        canvas.style.cursor = "pointer"; 
                        hover = true; 
                    }  
                    if (canvas.style.cursor == "pointer" && hover == false) {
                        canvas.style.cursor = "auto";
                        
                    }
                }
            };

            canvas.onmousedown = function (event) {
                for (let i = 0; i < that.number_of_answers; i++){
                    if ((event.clientX < that.answers_coords[i][2]+that.answers_coords[i][0] && event.clientX > that.answers_coords[i][0]) 
                    && (event.clientY > that.answers_coords[i][1] && event.clientY < that.answers_coords[i][1] + that.answers_coords[i][3])) {
                            console.log(progressBar)
                            progressBar.cancel();
                            if (that.check_answer(i)) {
                                resolve(true);
                            } else {
                                resolve(false);
                            }
                    } 
                }
                
            };
        })
    }

    check_answer(i){
        return this.answers[i][1]
    }
}