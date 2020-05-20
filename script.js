"use strict";

// Canvas
let cnv 	= document.getElementById('canv'),
		ctx		= cnv.getContext('2d');

cnv.width   = window.innerWidth;
cnv.height  = window.innerWidth;

// Image
let img = new Image(cnv.width, cnv.width/1.6);

img.dx 	= 0;
img.dy 	= 0;
img.sx 	= 0;
img.sy 	= 0;
img.dw 	= img.width;
img.dh 	= img.height;
img.sw 	= img.width;
img.sh 	= img.height;

let uploadForm	= document.getElementById('uploadForm'),
		userImage 	= document.getElementById('image');

userImage.addEventListener('change', (e)=>{

	// Достаю файл из формы
	let file = userImage.files[0];

	// "Читаю" полученную картнку
	let reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = function() {

				// Если загружена картинка, то...
				if(reader.result.search(/data:image\/jpeg;/) != -1) {
					// Новый путь к картинке,
					img.src = reader.result;

					draw();

					// Прячу форму после удачной загрузки картинки
					uploadForm.style.display = 'none';
				}

			};

});

// CutArea
let cutArea = {
	x: 0,
	y: 0,
	w: 0,
	h: 0,
	v: false
}

function draw() {

	ctx.clearRect(0, 0, cnv.width, cnv.height);

	ctx.beginPath();

	ctx.drawImage(img, img.sx, img.sy, img.sw, img.sh, img.dx, img.dy, img.dw, img.dh);

	if(cutArea.v) drawCutArea();

	ctx.closePath();

	requestAnimationFrame(draw)
}

function drawCutArea() {
	ctx.fillStyle 	= 'rgba(75, 75, 250, 0.3)';
	ctx.strokeStyle = 'rgba(50, 50, 100, 0.8)';
	ctx.rect(cutArea.x, cutArea.y, cutArea.w, cutArea.h);
	ctx.fill();
	ctx.stroke();
}

let newImg = {};

document.addEventListener('mousedown', (e)=>{

	if(img.src != "") {
		newImg.sx	= e.x;
		newImg.sy 	= e.y;

		cutArea.x	= e.x;
		cutArea.y 	= e.y;
		cutArea.v 	= true;
	}

});

document.addEventListener('mousemove', (e)=>{

	cutArea.w 	= e.x - cutArea.x;
	cutArea.h 	= e.y - cutArea.y;

});

document.addEventListener('mouseup', (e)=>{
	if(img.src != "") {
		newImg.sw 	= e.x - newImg.sx;
		newImg.sh 	= e.y - newImg.sy;
		newImg.dw 	= newImg.sw;
		newImg.dh 	= newImg.sh;
	}
	Object.assign(img, newImg);

	cutArea.v = false;

});
