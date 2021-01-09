

class ProgressBar{
    constructor(x, y, height, time, ctx){
        this.x = x;
        this.y = y;
        this.width = 0;
        this.max_width = window.innerWidth - 60;
        this.height = height;
        this.time = time;
        this.ctx = ctx
        this.update = time/10;

        this.color = "#ff0800"; // red
        this.radius = 5;
    }

    async drawBar(){
        return new Promise(resolve => {
            var color = this.ctx.fillStyle;
            this.ctx.fillStyle = this.color;
            this.ctx.roundRect(this.x, this.y, this.width, this.height, {upperLeft:this.radius, upperRight:this.radius, lowerRight:this.radius, lowerLeft:this.radius}, true, true);
            this.ctx.fillStyle = color;
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
    constructor(question_text=undefined, answers=undefined, time=undefined){
        this.text = question_text;
        this.answers = answers;

        this.change_to_question()
        
        this.time = time;
        this.radius = 20;
        this.font =  '48px serif';
        this.timeup = false;
        

        this.answers_coords = [];
               
        if (answers != undefined) this.number_of_answers = answers.length;


        this.ctx.save();
        this.ctx.font = this.font;
        
        this.question_x = (this.canvas.width/8) + (this.ctx.measureText(this.text).width);
        console.log((this.canvas.height/2))
        console.log(this.ctx.measureText(this.text).height)
        this.question_y = (this.canvas.height/6) + 15;
        this.ctx.restore()

        this.progressBar = new ProgressBar(10, 10, 20, 1000, this.ctx)
    }

    async change_from_question(){
        document.body.removeChild(this.canvas);
        divCanvas.style.maxWidth = (window.innerWidth - 30) + "px";

        divCanvas.style.maxHeight = scroll.background_height + "px";
        divCanvas.style.width =  window.innerWidth - 30  + "px";
        divCanvas.style.height = window.innerHeight - 35  + "px";

        ctx.canvas.width  = window.innerWidth - 30 ;
        
        ctx.canvas.height = (await background.pos)[1];

        questions = setInterval(async function(){
            var question = new Question();
            await question.random_question()
            var result = await question.draw()
            if (!result) {gameOver()}
        }, 9000);

        keyboard.interval = setInterval(function(){
            keyboard.checkKeys();
         }, 20);

         physics1.interval = setInterval(physics1.check, physics1.ml, physics1)

        // scroll.scroll(0)

        await background.draw()

        await (new Move(player, player.flip)).drawPlayer("images/standing.png")
        

    }

    change_to_question(){
        clearInterval(keyboard.interval)
        clearInterval(physics1.interval)
        clearInterval(questions)
        this.canvas = document.createElement("canvas")
        this.ctx = this.canvas.getContext("2d");
        this.canvas.style.borderColor = "black";
        this.canvas.style.borderStyle = "solid";

        this.canvas.width = window.innerWidth - 35;
        this.canvas.height = window.innerHeight - 35;

        divCanvas.style.maxWidth = "0px";
        divCanvas.style.maxHeight = "0px";
        divCanvas.style.width =  "0px";
        divCanvas.style.height = "0px";

       document.body.appendChild(this.canvas)
    }

    async draw_answers(){

        var x = this.question_x * 1.2;
        var y =  this.question_y * 2;
        var height = 100;
        var font =  '40px serif';

        return new Promise(async resolve => {    
            for (let i = 0; i < this.number_of_answers; i++){
                
                await new Promise(resolve => {
                    
                    this.ctx.font = font;
                    var width = this.ctx.measureText(this.answers[i][0]).width;
                    this.ctx.fillStyle = "#0015ff";
                    this.ctx.roundRect(x, y, width+100, height, 
                        {upperLeft:this.radius, upperRight:this.radius, lowerRight:this.radius, lowerLeft:this.radius}, true, true);
                    
                    this.answers_coords.push([x, y, width+100, height])
                    
                    this.ctx.fillStyle = "#000000";
                    this.ctx.fillText(this.answers[i][0], x+(width/2), y+(height/2)+10);
                    resolve("done");
                })

                // if (i == 1) return

                await new Promise(resolve => {
                    x += 200;
                
                    if ((i % 2) != 0){
                        y += height * 1.4; x -= 400;
                    }
                    console.log(i)
                    
                    resolve("done")
                })
            }
            this.timeup = true;
            resolve("done")
        })
    }

    async random_question(){
        return new Promise(async resolve => {
            var questions = JSON.parse(await (new File("questions.json")).getData())
            var question = questions[Math.floor(Math.random()*questions.length)];
            this.text = question['question'];
            this.answers = question['answers'];
            this.time = question['time'];
            this.number_of_answers = this.answers.length;
            this.question_x = (this.canvas.width/6) + (this.ctx.measureText(this.text).width);
            this.question_y = (this.canvas.height/6) + 15;
            this.progressBar.update = this.time/10
            resolve()
        })
    }

    async draw(){
        this.ctx.save();
        this.canvas.height = window.innerHeight;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        // ctx.restore()

        return new Promise(async (resolve, reject) => {
            var progressBar = (await this.progressBar.draw());

            progressBar.promise.then(() =>{
            this.canvas.style.cursor = "auto";
            this.change_from_question()
            window.removeEventListener('mousemove', mouseMove)
            window.removeEventListener("mousedown", mouseDown)
            this.ctx.restore()
            resolve(false)
            })
            this.ctx.font = this.font;
            
            this.ctx.fillText(this.text, this.question_x, this.question_y);
            console.log(this.text, this.question_x, this.question_y)
            
            await this.draw_answers()
            var that = this;

            window.addEventListener('mousemove', mouseMove, false)
            window.addEventListener("mousedown", mouseDown, false)

            function mouseDown(event){
                for (let i = 0; i < that.number_of_answers; i++){
                    if ((event.clientX < that.answers_coords[i][2]+that.answers_coords[i][0] && event.clientX > that.answers_coords[i][0]) 
                    && (event.clientY > that.answers_coords[i][1] && event.clientY < that.answers_coords[i][1] + that.answers_coords[i][3])) {
                            that.canvas.style.cursor = "auto";
                            window.removeEventListener('mousemove', mouseMove)
                            window.removeEventListener("mousedown", mouseDown)

                            console.log(progressBar)
                            progressBar.cancel();
                            // that.change_from_question()
                            if (that.check_answer(i)) {
                                
                                this.ctx.restore()
                                resolve(true);
                            } else {
                                this.ctx.restore()
                                resolve(false);
                            }
                    } 
                    
                }
            }

            function mouseMove(event){
                var hover = false;
                for (let i = 0; i < that.number_of_answers; i++){
                    if ((event.clientX < that.answers_coords[i][2]+that.answers_coords[i][0] && event.clientX > that.answers_coords[i][0]) 
                    && (event.clientY > that.answers_coords[i][1] && event.clientY < that.answers_coords[i][1] + that.answers_coords[i][3])) {
                        that.canvas.style.cursor = "pointer"; 
                        hover = true; 
                    }  
                    if (that.canvas.style.cursor == "pointer" && hover == false) {
                        that.canvas.style.cursor = "auto";
                        
                    }
                }
            }
        })
    }

    check_answer(i){
        return this.answers[i][1]
    }
}