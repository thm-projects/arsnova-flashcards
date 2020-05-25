// Wobble by @neave

window.requestAnimationFrame =
	window.requestAnimationFrame ||
	window.webkitRequestAnimationFrame ||
	window.mozRequestAnimationFrame ||
	window.msRequestAnimationFrame ||
	function(callback) {
		setTimeout(callback, 1000 / 60);
	};

Array.prototype.shuffle = function() {
	var j, temp;
	for (var i = this.length - 1; i > 0; i--) {
		j = Math.floor(Math.random() * (i + 1));
		temp = this[i];
		this[i] = this[j];
		this[j] = temp;
	}
	return this;
};

Math.clamp = function(n, min, max) {
	return Math.max(min, Math.min(n, max));
};

var get = document.querySelector.bind(document),
	on = document.addEventListener.bind(document),
	mouseOff = -1000,
	mouseX,
	mouseY,
	viscosity = 25,
	damping = 0.1,
	totalPoints,
	dist,
	scale,
	canvas,
	context,
	surfaces,
	palleteNum = 0,
	palleteFirst = ['0cf', '0fc', 'ff0', 'f0c', 'c0f'],
	palletes = [
		['000', 'ff0', 'f0f', '0ff', 'fff'],
		['000', 'fff', '000', 'fff', '000'],
		['333', '666', '999', 'ccc', 'fff'],
		['300', '600', 'f00', '600', '300'],
		['305', '606', '907', 'c08', 'f09'],
		['036', '067', '098', '0c9', '0fa'],
		['00a0b0', '6a4a3c', 'cc333f', 'eb6841', 'edc951'],
		['264653', '2a9d8f', 'e9c46a', 'f4a261', 'e76f51'],
		['300018', '5a3d31', '837b47', 'adb85f', 'e5edb8'],
		['343838', '005f6b', '008c9e', '00b4cc', '00dffc'],
		['3fb8af', '7fc7af', 'dad8a7', 'ff9e9d', 'ff3d7f'],
		['413e4a', '73626e', 'b38184', 'f0b49e', 'f7e4be'],
		['452632', '91204d', 'e4844a', 'e8bf56', 'e2f7ce'],
		['594f4f', '547980', '45ada8', '9de0ad', 'e5fcc2'],
		['5d4157', '838689', 'a8caba', 'cad7b2', 'ebe3aa'],
		['81657e', '3ea3af', '9fd9b3', 'f0f6b9', 'ff1d44'],
		['899aa1', 'bda2a2', 'fbbe9a', 'fad889', 'faf5c8'],
		['99b898', 'fecea8', 'ff847c', 'e84a5f', '2a363b'],
		['ab526b', 'bca297', 'c5ceae', 'f0e2a4', 'f4ebc3'],
		['acdeb2', 'e1eab5', 'edad9e', 'fe4b74', '390d2d'],
		['b9d7d9', '668284', '2a2829', '493736', '7b3b3b'],
		['bbbb88', 'ccc68d', 'eedd99', 'eec290', 'eeaa88'],
		['cff09e', 'a8dba8', '79bd9a', '3b8686', '0b486b'],
		['d1f2a5', 'effab4', 'ffc48c', 'ff9f80', 'f56991'],
		['d3e2b6', 'c3dbb4', 'aaccb1', '87bdb1', '68b3af'],
		['e0ffb3', '61c791', '31797d', '2a2f36', 'f23c55'],
		['e25858', 'e9d6af', 'ffffdd', 'c0efd2', '384252'],
		['e8608c', '71cbc4', 'fff9f4', 'cdd56e', 'ffbd68'],
		['e8ddcb', 'cdb380', '036564', '033649', '031634'],
		['e94e77', 'd68189', 'c6a49a', 'c6e5d9', 'f4ead5'],
		['eee6ab', 'c5bc8e', '696758', '45484b', '36393b'],
		['efffcd', 'dce9be', '555152', '2e2633', '99173c'],
		['f04155', 'ff823a', 'f2f26f', 'fff7bd', '95cfb7'],
		['f8b195', 'f67280', 'c06c84', '6c5b7b', '355c7d'],
		['f8f4d7', 'f4dec2', 'f2b4a8', 'e98977', 'f4b36c'],
		['fad089', 'ff9c5b', 'f5634a', 'ed303c', '3b8183'],
		['fe4365', 'fc9d9a', 'f9cdad', 'c8c8a9', '83af9b'],
		['ff4e50', 'fc913a', 'f9d423', 'ede574', 'e1f5c4'],
		['ff9900', '424242', 'e9e9e9', 'bcbcbc', '3299bb'],
		['ffed90', 'a8d46f', '359668', '3c3251', '341139']
	];

function Point(x, y) {
	this.x = x;
	this.y = y;

	this.ix = x;
	this.iy = y;

	this.vx = 0;
	this.vy = 0;
}

Point.prototype.move = function() {
	var width = canvas.width / scale;
	var height = canvas.height / scale;
	this.vx += (this.ix - this.x) / viscosity * width;
	this.vy += (this.iy - this.y) / viscosity * height;

	var dx = this.x * width - mouseX / scale,
		dy = this.y * height - mouseY / scale;

	if (Math.sqrt(dx * dx + dy * dy) < dist) {
		var a = Math.atan2(dy, dx);
		this.vx += (Math.cos(a) * viscosity - dx) / viscosity;
		this.vy -= (Math.sin(a) * viscosity - dy) / viscosity;
	}

	this.vx *= (1 - damping);
	this.vy *= (1 - damping);
	this.x += this.vx / width;
	this.y += this.vy / height;

	if (this.y < 0) {
		this.y = 0;
	} else if (this.y > 1) {
		this.y = 1;
	}
};

function Surface(y) {
	this.y = y;
	this.resize();
}

Surface.prototype.draw = function() {
	var p = this.points[totalPoints - 1],
		cx,
		cy;

	context.fillStyle = this.color;
	context.beginPath();
	context.moveTo(p.x * canvas.width, p.y * canvas.height);

	for (var i = totalPoints - 1; i > 0; i--) {
		p = this.points[i];
		p.move();

		cx = (p.x + this.points[i - 1].x) / 2 * canvas.width;
		cy = (p.y + this.points[i - 1].y) / 2 * canvas.height;

		if (i === 1) {
			cx = canvas.width;
		} else if (i === totalPoints - 1) {
			context.bezierCurveTo(p.x * canvas.width, p.y * canvas.height, cx, cy, cx, cy);
			p.x = 0;
		}

		context.bezierCurveTo(p.x * canvas.width, p.y * canvas.height, cx, cy, cx, cy);
	}

	context.lineTo(canvas.width, canvas.height);
	context.lineTo(0, canvas.height);
	context.closePath();
	context.fill();
};

Surface.prototype.resize = function() {
	this.points = [];
	for (var i = totalPoints; i--; ) {
		this.points.push(new Point(i / (totalPoints - 3), this.y));
	}
};

Surface.prototype.wobble = function() {
	for (var i = totalPoints - 1; i > 0; i--) {
		this.points[i].vy += (Math.random() - 0.5) * dist * 0.6;
	}
};

function setPallete() {
	canvas.style.backgroundColor = '#' + palletes[palleteNum][0];
	for (var i = surfaces.length; i--; ) {
		surfaces[surfaces.length - i - 1].color = '#' + palletes[palleteNum][i + 1];
	}
}

function nextPallete() {
	palleteNum++;
	if (palleteNum >= palletes.length) {
		palleteNum = 0;
		palletes.shuffle();
	}
	setPallete();
}

function wobbleSuraces() {
	resizeSuraces();

	for (var i = surfaces.length; i--; ) {
		surfaces[i].wobble();
	}
	nextPallete();
}

function drawSurfaces() {
	context.clearRect(0, 0, canvas.width, canvas.height);
	for (var i = surfaces.length; i--; ) {
		surfaces[i].draw();
	}
}

function resizeSuraces() {
	scale = window.devicePixelRatio || 1;

	canvas.width = innerWidth * scale;
	canvas.height = innerHeight * scale;
	canvas.style.width = innerWidth + 'px';
	canvas.style.height = innerHeight + 'px';

	totalPoints = Math.round(Math.clamp(Math.pow(Math.random() * 8, 2), 16, innerWidth / 35));
	dist = Math.clamp(innerWidth / 4, 150, 200);

	for (var i = surfaces.length; i--; ) {
		surfaces[i].resize();
	}
	drawSurfaces();
}

function update() {
	requestAnimationFrame(update);
	drawSurfaces();
}

function init() {
	canvas = get('canvas');
	context = canvas.getContext('2d');

	canvas.ontouchmove = function(event) {
		mouseX = event.targetTouches[0].pageX * scale;
		mouseY = event.targetTouches[0].pageY * scale;
	};

	canvas.ontouchstart = function(event) {
		event.preventDefault();
	};

	canvas.ontouchend = function(event) {
		wobbleSuraces();
		mouseX = mouseY = mouseOff;
	};

	canvas.onmousemove = function(event) {
		mouseX = event.pageX * scale;
		mouseY = event.pageY * scale;
	};

	canvas.onmousedown = wobbleSuraces;

	canvas.onmouseleave = function() {
		mouseX = mouseY = mouseOff;
	};

	surfaces = [
		new Surface(4/5),
		new Surface(3/5),
		new Surface(2/5),
		new Surface(1/5)
	];

	palletes.shuffle();
	palletes.unshift(palleteFirst);
	setPallete(0);

	window.onresize = resizeSuraces;
	resizeSuraces();
	update();
}

on('DOMContentLoaded', init);