
"use strict";

let cnv 	= document.getElementById('canv'),
	ctx		= cnv.getContext('2d');

cnv.width   = window.innerWidth;
cnv.height  = window.innerHeight;

let imgOpt = {
	src: 'https://pbs.twimg.com/media/D3O0RSBXsAEey1U.jpg:large',
	sx: 0,
	sy: 0, 
	sWidth: cnv.width,
	sHeight: cnv.height,
	dx: 0,
	dy: 0,
	update: true,
	dWidth: cnv.width,
	dHeight: cnv.width/1.6
}

let oldImg = {
	sx: imgOpt.sx,
	sy: imgOpt.sy,
	sWidth: imgOpt.sWidth,
	sHeight: imgOpt.sHeight,
	dWidth: imgOpt.dWidth,
	dHeight: imgOpt.dHeight
}

let img = new Image(imgOpt.sWidth, imgOpt.sHeight);
img.src = imgOpt.src;

img.onload = function() { draw() }

let magnifier = {
	x:0,
	y:0,
	w:0,
	h:0,
	show: false
}

function draw() {
	ctx.clearRect(0,0,cnv.width,cnv.height);
	ctx.drawImage(img, oldImg.sx, oldImg.sy, oldImg.sWidth, oldImg.sHeight, imgOpt.dx, imgOpt.dy, oldImg.dWidth, oldImg.dHeight);
	ctx.fillStyle = 'rgba(0,0,0,.7)';
	ctx.fillRect(0,0,cnv.width,cnv.height);

	if(imgOpt.update)
		ctx.drawImage(img, imgOpt.sx, imgOpt.sy, imgOpt.sWidth, imgOpt.sHeight, imgOpt.dx, imgOpt.dy, imgOpt.dWidth, imgOpt.dHeight);		
	
	if(magnifier.show) {
		ctx.fillStyle = 'rgba(50,50,250,.3)';
		ctx.fillRect(magnifier.x, magnifier.y, magnifier.w, magnifier.h);
	}
	
	requestAnimationFrame(draw);
}

document.addEventListener('mousedown', (e)=>{
	imgOpt.update = false;

	imgOpt.sx	= 300;
	imgOpt.sy 	= 300; 

	magnifier.x = e.x;
	magnifier.y = e.y;
	magnifier.show = true;
});

document.addEventListener('mousemove', (e)=>{

	magnifier.w = e.x - magnifier.x;
	magnifier.h = e.y - magnifier.y;
});

document.addEventListener('mouseup', (e)=>{

	imgOpt.sWidth	= e.x - imgOpt.sx;
	imgOpt.sHeight	= e.y - imgOpt.sy;

	imgOpt.dWidth 	= imgOpt.sWidth;
	imgOpt.dHeight 	= imgOpt.sHeight;

	imgOpt.update  = true;
	magnifier.show = false;


});
