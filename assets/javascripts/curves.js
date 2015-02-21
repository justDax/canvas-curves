//
//  CURVES JS
//      
//  just some playing around with canvas and math by dax
//


// TODO LIST
// 1 - better touch controls: i want to be able to scroll canvas with 1 finger and page with 2 fingers
// 2 - when moving the lines on touchscreens i want to calculate the difference between the starttouch point and the current touch point to move the lines
//     now the plugin beheaves as if the touch event is the position of mouse cursor
// 3 - smooth virtual mouse animation, now i too linear and i don't like it



var canvasId = "intro";         // id of canvas element
var fps = 60;

var canvasWidth, canvasHeight;  // dimensions of canvas
var canvasResizeTimeout;        // timout when resizing window


var canvasX;
var canvasY;
var inputX, inputY;
var mouseIsDown = 0;



// calc and set canvas size
function calcCanvasSize(){
  canvasHeight = $(window).height();
  $('#'+canvasId).css({"height": canvasHeight+"px", "width": "100%"});
  canvasWidth = $('#'+canvasId).width();
  ctx.canvas.width  = window.innerWidth;
  ctx.canvas.height = window.innerHeight;
}


function setOtherVars(){
  canvasX = inputX = ctx.canvas.width / 2;
  canvasY = inputY = ctx.canvas.height / 2;
}

// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel

var lastTime = 0;
var vendors = ['ms', 'moz', 'webkit', 'o'];
for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
  window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
  window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
}

if (!window.requestAnimationFrame){
  window.requestAnimationFrame = function(callback, element) {
    var currTime = new Date().getTime();
    var timeToCall = Math.max(0, 16 - (currTime - lastTime));
    var id = window.setTimeout(function() { 
      callback(currTime + timeToCall);
    },  timeToCall);
    lastTime = currTime + timeToCall;
    return id;
  };
}

if (!window.cancelAnimationFrame){
  window.cancelAnimationFrame = function(id) {
    clearTimeout(id);
  };
}

// end requestAnimationFrame polyfill

var canvas = document.getElementById(canvasId);
var ctx = canvas.getContext('2d');

var wavesQuantity = 10;
var waves = [];



// manipulate functions

function updateColor(color){
  for (var i = 0; i < waves.length; i++){
    waves[i].strokeStyle = color;
  }
}

// end manipulate functions


function createWaves(){
  for (var i=0; i < wavesQuantity; i++){
    waves.push(new Wave());
  }
}

function drawshapes(){
  for (var i=0; i < waves.length; i++){
    var wave = waves[i];
    wave.update();
    wave.draw();
  }
}


// TODO Smooth virtual mouse movement, now is too linear
function updateVirtualMousePosition(){
  // var increaseValue = 10;
  // if (canvasX !== inputX){
  //   if (Math.abs(canvasX - inputX) <= increaseValue){
  //     canvasX = inputX;
  //   } else {
  //     canvasX = canvasX > inputX ? canvasX - increaseValue : canvasX + increaseValue;
  //   }
  // }
  // if (canvasY !== inputY){
  //   if (Math.abs(canvasY - inputY) <= increaseValue){
  //     canvasY = inputY;
  //   } else {
  //     canvasY = canvasY > inputY ? canvasY - increaseValue : canvasY + increaseValue;
  //   }
  // }
  canvasY = inputY;
  canvasX = inputX;
}



// Wave constructor

function Wave(){
  var cursorInfluence = 0.2;
  // axis origin is chosen at random between 0 and half canvas for X and 0 to height for Y
  
  // this.axisOriginX = Math.random()*(ctx.canvas.width / 2);
  this.axisOriginX = ctx.canvas.width / 4;
  this.axisOriginY = (ctx.canvas.height * 3/4) - Math.random()*(ctx.canvas.height / 2);
  // this.axisOriginY = ctx.canvas.height / 2;
  
  this.originY = this.axisOriginY;
  this.originX = this.axisOriginX;
  this.lineWidth = 10;
  this.strokeStyle = 'rgb(200, ' + Math.round(Math.random()*255) + ',' + Math.round(Math.random()*255) + ')'; 
  this.shadowColor = this.strokeStyle; //'#' + Math.round(Math.random()*999999);
  this.shadowBlur = 0;
  this.shadowOffsetX = 0; 
  this.shadowOffsetY = 0;
  this.angle = 0 - ( 1 - Math.random()*2)*0.25; // -1 to 1
  
  this.updateOrigin = function(){
    if ( (canvasY !== undefined) && (canvasX !== undefined) ){
      this.originY = this.axisOriginY - ((canvasHeight/2 - canvasY) * cursorInfluence);
      this.originX = this.axisOriginX - ((canvasWidth/2 - canvasX) * cursorInfluence);
    }
  }
  
  this.update = function(){
    this.updateOrigin();
    this.updateShape();
  }
    
  this.calcY = function(x){
    return Math.sin(x/this.horizontalWaveMultiplier)*this.verticalWaveMultiplier;
  }
  
  
  var sinValueAtCursorX = this.calcY(this.originX);
  var verticalOffset = this.originY - sinValueAtCursorX;
  
  this.draw = function(){
    ctx.beginPath();
    ctx.moveTo(0, this.calcY(0)+verticalOffset);
    for (var i = 0; i < canvasWidth; i++){
      var x = i - this.originX;
      var y = this.originY + (this.calcY(x) + x * this.angle);
      ctx.lineTo( i, y );
    }
    ctx.lineWidth = this.lineWidth;
    ctx.strokeStyle = this.strokeStyle;
    ctx.shadowColor = this.shadowColor;
    ctx.shadowBlur = this.shadowBlur;
    ctx.shadowOffsetX = this.shadowOffsetX; 
    ctx.shadowOffsetY = this.shadowOffsetY;
    ctx.stroke();
  }
  
  
  
  // wave shape update
  this.lastUpdateChange = Date.now();
  this.updateIncrease = true;
  this.maxIncrease = 20;
  this.horizontalWaveMultiplier = 100 + Math.round(Math.random()*10);
  this.verticalWaveMultiplier = 50 + Math.round(Math.random()*10);
  this.timeOffset = (Math.random()*3000) + 3000; //ms
  this.updateAmount = Math.floor((Math.random() + 0.09)*3)/10;
  this.initialHorizontalWaveMultiplier = this.horizontalWaveMultiplier;
  this.initialVerticalWaveMultiplier = this.verticalWaveMultiplier;
  
  this.updateShape = function(){
    var horizontalMax = this.initialHorizontalWaveMultiplier + this.maxIncrease;
    var horizontalMin = this.initialHorizontalWaveMultiplier - this.maxIncrease;
    var verticalMax = this.initialVerticalWaveMultiplier + this.maxIncrease;
    var verticalMin = this.initialVerticalWaveMultiplier - this.maxIncrease;
    var now = Date.now();
    
    if (this.lastUpdateChange + this.timeOffset < now){
      this.updateIncrease = !this.updateIncrease;
      this.lastUpdateChange = now;
    }
    if (this.updateIncrease){
      this.horizontalWaveMultiplier += Math.random()*this.updateAmount;
      this.verticalWaveMultiplier += Math.random()*this.updateAmount;
    } else {
      this.horizontalWaveMultiplier -= Math.random()*this.updateAmount;
      this.verticalWaveMultiplier -= Math.random()*this.updateAmount;
    }

    // limit multipliers to prevent values too far from the initials
    if (this.horizontalWaveMultiplier > horizontalMax){
      this.horizontalWaveMultiplier = horizontalMax;
    } else if (this.horizontalWaveMultiplier < horizontalMin){
      this.horizontalWaveMultiplier = horizontalMin;
    }

    if (this.verticalWaveMultiplier > verticalMax){
      this.verticalWaveMultiplier = verticalMax;
    } else if (this.verticalWaveMultiplier < verticalMin){
      this.verticalWaveMultiplier = verticalMin;
    }
  }
  

}





////////////////////////////////////////
// canvas input methods
////////////////////////////////////////

function bindCanvasInputs(){
  canvas.addEventListener("mousedown", mouseDown, false);
  canvas.addEventListener("mousemove", mouseXY, false);
  canvas.addEventListener("touchstart", touchDown, false);
  canvas.addEventListener("touchmove", touchXY, true);
  canvas.addEventListener("touchend", touchUp, false);

  document.body.addEventListener("mouseup", mouseUp, false);
  document.body.addEventListener("touchcancel", touchUp, false);
}

function mouseUp() {
  mouseIsDown = 0;
  mouseXY();
}

var touchStartX, touchStartY, inputStartX, inputStartY;

function touchUp() {
  mouseIsDown = 0;
  touchStartX = undefined;
  touchsSartY = undefined;

}

function mouseDown() {
  mouseIsDown = true;
  mouseXY();
}

function touchDown() {
  mouseIsDown = true;
  console.log(event);
  touchStartX = event.touches[0].pageX;
  touchStartY = event.touches[0].pageY;
  // todo input start
  touchXY();
}

function mouseXY(e) {
  if (!e) var e = event;
  inputX = e.pageX - canvas.offsetLeft;
  inputY = e.pageY - canvas.offsetTop;
}

function touchXY(e) {
  if (!e) var e = event;
  if (e.targetTouches.length === 1){
    e.preventDefault();
    // inputX = e.targetTouches[0].pageX - canvas.offsetLeft;
    // inputY = e.targetTouches[0].pageY - canvas.offsetTop;
    inputX = e.targetTouches[0].pageX - touchStartX;
    inputY = e.targetTouches[0].pageY - touchStartY;
  }
}




// refreshes canvas at every frame
function everyFrame(){
  setTimeout(function(){
    requestAnimationFrame(everyFrame);

    // updates virtual mouse position smoothly
    updateVirtualMousePosition();
    // clear canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // updates and draw shapes
    drawshapes();    
  }, 1000/fps)
}



function start(){
  // set canvas size
  calcCanvasSize();
  // set other variables
  setOtherVars();
  // bin canvas touch click and position
  bindCanvasInputs();
  
  // create waves
  createWaves();
  
  // bind canvas size on window resize
  $(window).resize(function(){
    clearTimeout(canvasResizeTimeout);
    canvasResizeTimeout = setTimeout(calcCanvasSize, 100);
  })
  
  // starts refresh function
  everyFrame();
}


start();
