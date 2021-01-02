var keys = []

document.onkeyup = e => {keys.splice(keys.indexOf(e.keyCode), 1)}

document.onkeydown = function (event){
    if (!keys.includes(event.keyCode) && [87, 68, 65].includes(event.keyCode)) keys.push(event.keyCode);

}

setInterval(function(){ console.log(keys); }, 100);