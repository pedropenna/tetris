'use strict';

var ccc =    document.getElementById('ccc');
var ctx =      ccc.getContext('2d');

function bar() {
  console.log('bar');
  var frameId = requestAnimationFrame(bar);
  var cor = 'rgb(' + randomShade() + ',' + randomShade() +
            ',' + randomShade() + ')';
  console.log('cor', cor);
  ctx.strokeStyle  = cor;
  ctx.fillStyle  = cor;
  //ctx.strokeStyle = 'blue';
  //ctx.rect(20,20,150,100);
  ctx.beginPath();
  ctx.rect(800 * Math.random(),
           599 * Math.random(),
           70 * Math.random(),
           80 * Math.random());
  ctx.fillRect(799 * Math.random(),
          599 * Math.random(),
          70 * Math.random(),
          80 * Math.random());
  ctx.stroke();

  //context.arc(context.canvas.width * 0.5, context.canvas.height * 0.5, 10, 0, 2*Math.PI, false);

}

function randomShade() {
  return Math.ceil(254 * Math.random());
}

var blockSize = 30;

//bar();
var ccc =    document.getElementById('ccc');
var ctx =      ccc.getContext('2d');
ctx.beginPath();
ctx.strokeStyle  = 'gray';
ctx.rect(0,0,ccc.width - 1,ccc.height - 1);
ctx.stroke();
ctx.strokeStyle  = 'rgb(220, 220, 220)';
ctx.beginPath();

var rightBorderX = (ctx.canvas.width / 2) + (10 * blockSize / 2);
var leftBorderX = (ctx.canvas.width / 2) - (10 * blockSize / 2);
var y = 10;

for (var x1 = leftBorderX; x1 <= rightBorderX; x1 += blockSize) {
  ctx.moveTo(x1, y);
  ctx.lineTo(x1, y + (20 * blockSize));
  ctx.stroke();
}

for (var y1 = y; y1 <= y + (20 * blockSize); y1 += blockSize) {
  ctx.moveTo(leftBorderX, y1);
  ctx.lineTo(rightBorderX, y1);
  ctx.stroke();
}
// ctx.rect(leftBorderX, y, 10 * blockSize, (20 * blockSize));
//   ctx.stroke();

y = 5;
var cor = 'rgb(' + randomShade() + ',' + randomShade() +
          ',' + randomShade() + ')';
console.log('cor', cor);
ctx.strokeStyle  = cor;
ctx.fillStyle  = cor;

ctx.save();

ctx.restore();
