"use strict";

// Canvas
let cnv 	= document.getElementById('canv'),
		ctx		= cnv.getContext('2d');

// Canvas's sizes
cnv.width   = window.innerWidth;
cnv.height  = window.innerHeight;


// Image
let img = new Image();

// Image's properties
img.isLoaded = false;

img.onload = function() {
	img.dx 	= 0;
	img.dy 	= 0;
	img.sx 	= 0;
	img.sy 	= 0;
	img.sw 	= img.width;
	img.sh 	= img.height;
	img.dw 	= cnv.width;
	img.dh 	= cnv.width/(img.sw / img.sh);
	img.isLoaded = true;
}


// Upload a image
let dropArea		= document.getElementById('image-label'),
		userImage 	= document.getElementById('image');

// Canсel the propagtion for drag'n'drop
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => { dropArea.addEventListener(eventName, (e)=>{e.preventDefault();e.stopPropagation()}, false) });

// Styling drag'n'drop
dropArea.addEventListener('dragleave', unhighlight, false);
dropArea.addEventListener('dragenter', highlight, false);

function highlight(e) { dropArea.classList.add('highlight') }
function unhighlight(e) { dropArea.classList.remove('highlight') }

// processing drag'n'drop
dropArea.addEventListener('drop', uploadImage)
// processing upload from input
userImage.addEventListener('change', uploadImage);

function uploadImage(e) {

	// Take a file from input or using drag'n'drop
	let file = userImage.files[0] || e.dataTransfer.files[0];

	// "Read" received image
	let reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = function() {
				// If the image is successfully loaded, then..
				if(reader.result.search(/data:image\/jpeg|png|ico|tiff|webp|eps|svg|psd|indd|cdr|ai|raw;/) != -1) {
					// New image's source,
					img.src = reader.result;

					draw();

					// Hide the form after successfully uploaded
					dropArea.style.display = 'none';
				}
			};
}


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


// Cropped image properties
let newImg = {};

document.addEventListener('mousedown', (e)=>{

	if(img.isLoaded) {
		newImg.sx	= e.x * (img.width/cnv.width);
		newImg.sy = e.y * (img.height/cnv.height);

		cutArea.x		= e.x;
		cutArea.y 	= e.y;
		cutArea.v 	= true;
	}

});
document.addEventListener('mousemove', (e)=>{

	cutArea.w 	= e.x - cutArea.x;
	cutArea.h 	= e.y - cutArea.y;

});
document.addEventListener('mouseup', (e)=>{

	if(img.isLoaded) {
		newImg.sw = e.x * (img.width/cnv.width) - newImg.sx;
		newImg.sh = e.y * (img.height/cnv.height) - newImg.sy;
		newImg.dw	=	newImg.sw / (img.width/cnv.width);
		newImg.dh	= newImg.sh / (img.height/cnv.height);

		Object.assign(img, newImg);

		cutArea.v = false;
	}

});
