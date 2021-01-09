

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
            canceled = true;
        }
        var promise = new Promise(async (resolve, reject) => {
            if (canceled){
                resolve(true)
            }

            for (let i = 0; i < this.update && !canceled; i++){
                this.width += this.max_width/this.update;
                await this.drawBar();
                await timeout(this.update);
            }
            
            resolve(false)
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

        this.question_y = (this.canvas.height/6) + 15;
        this.ctx.restore()

        this.progressBar = new ProgressBar(10, 10, 20, 1000, this.ctx)
    }

    async change_from_question(){
        console.log("damn")
        document.body.removeChild(this.canvas);
        divCanvas.style.maxWidth = (window.innerWidth - 30) + "px";

        divCanvas.style.maxHeight = scroll.background_height + "px";
        divCanvas.style.width =  window.innerWidth - 30  + "px";
        divCanvas.style.height = window.innerHeight - 35  + "px";

        ctx.canvas.width  = window.innerWidth - 30 ;

        ctx.canvas.height = (await background.pos)[1];
        console.log(questions)
        await new Promise(resolve => {
            questions.push(setInterval(async function(){
                console.log(questioning)
                
                if(!questioning){
                questioning = true;
                var question = new Question();
                await question.random_question()
                var result = await question.draw()
                console.log(result)
                if (!result) {gameOver();}
            

                if (result) questioning = false;
                }
            }, 9000));
            resolve()    
        })
        

        keyboard.interval = setInterval(function(){
            keyboard.checkKeys();
         }, 20);

         physics1.interval = setInterval(physics1.check, physics1.ml, physics1)

        // scroll.scroll(0)

        await background.draw()

        await (new Move(player, player.flip)).drawPlayer("images/standing.png")
        

    }

    drawDetail() {
        this.container = document.createElement('div');
        this.container.setAttribute("class", "container");
        this.container.innerHTML = `
        <div class="row">
        <div class="column left">
          <span class="dot" style="background:#ED594A;" onclick="this.parentElement.parentElement.parentElement.style.display='none';"></span>
          <span class="dot" style="background:#FDD800;" onclick="this.parentElement.parentElement.parentElement.style.display='none';"></span>
          <span class="dot" style="background:#5AC05A;" onclick="this.parentElement.parentElement.parentElement.style.display='none';"></span>
        </div>
        <div class="column middle">
          <p id ="url">http://www.google.com</p>
        </div>
        <div class="column right">
          <div style="float:right">
            <span class="bar"></span>
            <span class="bar"></span>
            <span class="bar"></span>
          </div>
        </div>
      </div>
    
      <div class="content">
        <h3>` + this.text + `</h3>
        <p>` + this.detail + `</p>
      </div>
        `;
        // this.container.style = " border: 7px solid #f1f1f1; border-top-left-radius: 4px; border-top-right-radius: 4px; display: block; position: fixed; z-index: 1; left: 25%; top: 2%; width: 45%; height: 45%; overflow: auto; background-color: rgb(236, 186, 186); background-color: rgba(255, 255, 255, 0.4);"
        var styleEl = document.createElement('style');

        document.head.appendChild(styleEl);
        var styleSheet = styleEl.sheet;

        console.log(this.container.style)
        // var stylesheet = document.getElementById("style");
        document.body.appendChild(this.container)
        this.container = document.getElementById('container');
        styleSheet.insertRule(".container {border: 7px solid #f1f1f1; border-top-left-radius: 4px; border-top-right-radius: 4px; display: block; position: fixed; z-index: 1; left: 25%; top: 2%; width: 45%; height: 45%; overflow: auto; background-color: rgb(255, 255, 255);}", 0)
        styleSheet.insertRule(".row {  padding: 10px;  background: #f1f1f1;  border-top-left-radius: 4px;  border-top-right-radius: 4px; }", 1)        
        styleSheet.insertRule(".column {  float: left;}", 2)
        styleSheet.insertRule(".left {  width: 15%;} ", 3)
        styleSheet.insertRule(".right {  width: 10%;}", 4)
        styleSheet.insertRule(".middle {  width: 75%;}", 5)
        styleSheet.insertRule(".row:after {  content: '';  display: table;  clear: both; }", 6)
        styleSheet.insertRule(".dot {  margin-top: 4px;  height: 12px;  width: 12px;  background-color: #bbb;  border-radius: 50%;  display: inline-block !important;} ", 7)
        styleSheet.insertRule(" #url {  width: 100%;  border-radius: 3px;  border: none;  background-color: white;  margin-top: -8px;  height: 25px;  color: #666;  padding: 5px;}", 8)
        styleSheet.insertRule(".bar {  width: 17px;  height: 3px;  background-color: #aaa;  margin: 3px 0;  display: block;}", 9)
        styleSheet.insertRule(".content {  padding: 10px;  font-size: 120%; background: #fffffff !important;}", 10)
        
    }

    change_to_question(){
        clearInterval(keyboard.interval)
        clearInterval(physics1.interval)
        for (let i = 0; i < questions.length; i++){
            clearInterval(questions[i])
        }
        questions =  []
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
            this.detail = question['detail'];
            this.number_of_answers = this.answers.length;
            this.question_x = (this.canvas.width/6) + (this.ctx.measureText(this.text).width);
            this.question_y = (this.canvas.height/6) + 15;
            this.progressBar.update = this.time/10
            resolve()
        })
    }

    async draw(){
        this.failed = false;
        this.ctx.save();
        this.canvas.height = window.innerHeight;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        // ctx.restore()

        return new Promise(async (resolve, reject) => {
            var progressBar = (await this.progressBar.draw());

            progressBar.promise.then((cancel) =>{
            this.canvas.style.cursor = "auto";
            this.change_from_question()
            
            if (!this.failed) this.drawDetail()
            window.removeEventListener('mousemove', mouseMove)
            window.removeEventListener("mousedown", mouseDown)
            this.ctx.restore()
            resolve(false)
            })
            this.ctx.font = this.font;
            
            this.ctx.fillText(this.text, this.question_x, this.question_y);
            
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
                            that.failed = true;
                            progressBar.cancel();
                            // that.change_from_question()
                            if (that.check_answer(i)) {
                                
                                this.ctx.restore()
                                resolve(true);
                            } else {
                                
                                this.ctx.restore()
                                that.drawDetail()
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