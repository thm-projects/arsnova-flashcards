class Vector2 {
	constructor (x, y) {
		this.x = x;
		this.y = y;
	}

	Length () {
		return Math.sqrt(this.SqrLength());
	}

	SqrLength () {
		return this.x * this.x + this.y * this.y;
	}

	Add (vec) {
		this.x += vec.x;
		this.y += vec.y;
	}

	Sub (vec) {
		this.x -= vec.x;
		this.y -= vec.y;
	}

	Div (scalar) {
		this.x /= scalar;
		this.y /= scalar;
	}

	Mul (scalar) {
		this.x *= scalar;
		this.y *= scalar;
	}

	Normalize () {
		let sqrLen = this.SqrLength();
		if (sqrLen !== 0) {
			const factor = 1.0 / Math.sqrt(sqrLen);
			this.x *= factor;
			this.y *= factor;
		}
	}

	Normalized () {
		let sqrLen = this.SqrLength();
		if (sqrLen !== 0) {
			const factor = 1.0 / Math.sqrt(sqrLen);
			return new Vector2(this.x * factor, this.y * factor);
		}
		return new Vector2(0, 0);
	}

	static Lerp (vec0, vec1, factor) {
		return new Vector2((vec1.x - vec0.x) * factor + vec0.x, (vec1.y - vec0.y) * factor + vec0.y);
	}

	static Distance (vec0, vec1) {
		return Math.sqrt(Vector2.SqrDistance(vec0, vec1));
	}

	static SqrDistance (vec0, vec1) {
		const x = vec0.x - vec1.x;
		const y = vec0.y - vec1.y;
		return x * x + y * y;
	}

	static Scale (vec0, vec1) {
		return new Vector2(vec0.x * vec1.x, vec0.y * vec1.y);
	}

	static Min (vec0, vec1) {
		return new Vector2(Math.min(vec0.x, vec1.x), Math.min(vec0.y, vec1.y));
	}

	static Max (vec0, vec1) {
		return new Vector2(Math.max(vec0.x, vec1.x), Math.max(vec0.y, vec1.y));
	}

	static ClampMagnitude (vec, len) {
		const vecNorm = vec.Normalized();
		return new Vector2(vecNorm.x * len, vecNorm.y * len);
	}

	static Sub (vec0, vec1) {
		return new Vector2(vec0.x - vec1.x, vec0.y - vec1.y, vec0.z - vec1.z);
	}
}

class EulerMass {
	constructor (x, y, mass, drag) {
		this.position = new Vector2(x, y);
		this.mass = mass;
		this.drag = drag;
		this.force = new Vector2(0, 0);
		this.velocity = new Vector2(0, 0);
	}

	AddForce (forceVec) {
		this.force.Add(forceVec);
	}

	Integrate (dt) {
		const acc = this.CurrentForce(this.position);
		acc.Div(this.mass);
		const posDelta = new Vector2(this.velocity.x, this.velocity.y);
		posDelta.Mul(dt);
		this.position.Add(posDelta);
		acc.Mul(dt);
		this.velocity.Add(acc);
		this.force = new Vector2(0, 0);
	}

	CurrentForce () {
		const totalForce = new Vector2(this.force.x, this.force.y);
		const vecSpeed = this.velocity.Length();
		const dragVel = new Vector2(this.velocity.x, this.velocity.y);
		dragVel.Mul(this.drag * this.mass * vecSpeed);
		totalForce.Sub(dragVel);
		return totalForce;
	}
}

const retina = window.devicePixelRatio,
	DEG_TO_RAD = Math.PI / 180,
	colors = [
		["#df0049", "#660671"],
		["#00e857", "#005291"],
		["#2bebbc", "#05798a"],
		["#ffd200", "#b06c00"]
	];

class ConfettiPaper {
	constructor (x, y) {
		this.pos = new Vector2(x, y);
		this.rotationSpeed = (Math.random() * 600 + 800);
		this.angle = DEG_TO_RAD * Math.random() * 360;
		this.rotation = DEG_TO_RAD * Math.random() * 360;
		this.cosA = 1.0;
		this.size = 5.0;
		this.oscillationSpeed = (Math.random() * 1.5 + 0.5);
		this.xSpeed = 40.0;
		this.ySpeed = (Math.random() * 60 + 50.0);
		this.corners = [];
		this.time = Math.random();
		let ci = Math.round(Math.random() * (colors.length - 1));
		this.frontColor = colors[ci][0];
		this.backColor = colors[ci][1];
		for (let i = 0; i < 4; i++) {
			const dx = Math.cos(this.angle + DEG_TO_RAD * (i * 90 + 45));
			const dy = Math.sin(this.angle + DEG_TO_RAD * (i * 90 + 45));
			this.corners[i] = new Vector2(dx, dy);
		}
	}

	Update (dt) {
		this.time += dt;
		this.rotation += this.rotationSpeed * dt;
		this.cosA = Math.cos(DEG_TO_RAD * this.rotation);
		this.pos.x += Math.cos(this.time * this.oscillationSpeed) * this.xSpeed * dt;
		this.pos.y += this.ySpeed * dt;
		if (this.pos.y > ConfettiPaper.bounds.y) {
			this.pos.x = Math.random() * ConfettiPaper.bounds.x;
			this.pos.y = 0;
		}
	}

	Draw (g) {
		if (this.cosA > 0) {
			g.fillStyle = this.frontColor;
		} else {
			g.fillStyle = this.backColor;
		}
		g.beginPath();
		g.moveTo((this.pos.x + this.corners[0].x * this.size) * retina,
			(this.pos.y + this.corners[0].y * this.size * this.cosA) * retina);
		for (let i = 1; i < 4; i++) {
			g.lineTo((this.pos.x + this.corners[i].x * this.size) * retina,
				(this.pos.y + this.corners[i].y * this.size * this.cosA) * retina);
		}
		g.closePath();
		g.fill();
	}
}

ConfettiPaper.bounds = new Vector2(0, 0);

class ConfettiRibbon {
	constructor (x, y, count, dist, thickness, angle, mass, drag) {
		this.particleDist = dist;
		this.particleCount = count;
		this.particleMass = mass;
		this.particleDrag = drag;
		this.particles = [];
		let ci = Math.round(Math.random() * (colors.length - 1));
		this.frontColor = colors[ci][0];
		this.backColor = colors[ci][1];
		this.xOff = (Math.cos(DEG_TO_RAD * angle) * thickness);
		this.yOff = (Math.sin(DEG_TO_RAD * angle) * thickness);
		this.position = new Vector2(x, y);
		this.prevPosition = new Vector2(x, y);
		this.velocityInherit = (Math.random() * 2 + 4);
		this.time = Math.random() * 100;
		this.oscillationSpeed = (Math.random() * 2 + 2);
		this.oscillationDistance = (Math.random() * 40 + 40);
		this.ySpeed = (Math.random() * 40 + 80);
		for (let i = 0; i < this.particleCount; i++) {
			this.particles[i] = new EulerMass(x, y - i * this.particleDist, this.particleMass, this.particleDrag);
		}
	}

	Update (dt) {
		this.time += dt * this.oscillationSpeed;
		this.position.y += this.ySpeed * dt;
		this.position.x += Math.cos(this.time) * this.oscillationDistance * dt;
		this.particles[0].position = this.position;
		let dX = this.prevPosition.x - this.position.x;
		let dY = this.prevPosition.y - this.position.y;
		let delta = Math.sqrt(dX * dX + dY * dY);
		this.prevPosition = new Vector2(this.position.x, this.position.y);
		for (let i = 1; i < this.particleCount; i++) {
			let dirP = Vector2.Sub(this.particles[i - 1].position, this.particles[i].position);
			dirP.Normalize();
			dirP.Mul((delta / dt) * this.velocityInherit);
			this.particles[i].AddForce(dirP);
		}
		for (let i = 1; i < this.particleCount; i++) {
			this.particles[i].Integrate(dt);
		}
		for (let i = 1; i < this.particleCount; i++) {
			let rp2 = new Vector2(this.particles[i].position.x, this.particles[i].position.y);
			rp2.Sub(this.particles[i - 1].position);
			rp2.Normalize();
			rp2.Mul(this.particleDist);
			rp2.Add(this.particles[i - 1].position);
			this.particles[i].position = rp2;
		}
		if (this.position.y > ConfettiRibbon.bounds.y + this.particleDist * this.particleCount) {
			this.Reset();
		}
	}

	Reset () {
		this.position.y = -Math.random() * ConfettiRibbon.bounds.y;
		this.position.x = Math.random() * ConfettiRibbon.bounds.x;
		this.prevPosition = new Vector2(this.position.x, this.position.y);
		this.velocityInherit = Math.random() * 2 + 4;
		this.time = Math.random() * 100;
		this.oscillationSpeed = Math.random() * 2.0 + 1.5;
		this.oscillationDistance = (Math.random() * 40 + 40);
		this.ySpeed = Math.random() * 40 + 80;
		let ci = Math.round(Math.random() * (colors.length - 1));
		this.frontColor = colors[ci][0];
		this.backColor = colors[ci][1];
		this.particles = [];
		for (let i = 0; i < this.particleCount; i++) {
			this.particles[i] = new EulerMass(this.position.x, this.position.y - i * this.particleDist, this.particleMass, this.particleDrag);
		}
	}

	DrawSubLine (g, index, point) {
		g.lineTo((this.particles[index].position.x + point.x) * 0.5 * retina,
			(this.particles[index].position.y + point.y) * 0.5 * retina);
		g.closePath();
		g.stroke();
		g.fill();
	}

	Draw (g) {
		for (let i = 0; i < this.particleCount - 1; i++) {
			let p0 = new Vector2(this.particles[i].position.x + this.xOff, this.particles[i].position.y + this.yOff);
			let p1 = new Vector2(this.particles[i + 1].position.x + this.xOff, this.particles[i + 1].position.y + this.yOff);
			if (this.Side(this.particles[i].position.x, this.particles[i].position.y, this.particles[i + 1].position.x, this.particles[i + 1].position.y, p1.x, p1.y) < 0) {
				g.fillStyle = this.frontColor;
				g.strokeStyle = this.frontColor;
			} else {
				g.fillStyle = this.backColor;
				g.strokeStyle = this.backColor;
			}
			g.beginPath();
			g.moveTo(this.particles[i].position.x * retina, this.particles[i].position.y * retina);
			g.lineTo(this.particles[i + 1].position.x * retina, this.particles[i + 1].position.y * retina);
			if (i === 0) {
				this.DrawSubLine(g, i + 1, p1);
				g.beginPath();
				g.moveTo(p1.x * retina, p1.y * retina);
				g.lineTo(p0.x * retina, p0.y * retina);
				this.DrawSubLine(g, i + 1, p1);
			} else if (i === this.particleCount - 2) {
				this.DrawSubLine(g, i, p0);
				g.beginPath();
				g.moveTo(p1.x * retina, p1.y * retina);
				g.lineTo(p0.x * retina, p0.y * retina);
				this.DrawSubLine(g, i, p0);
			} else {
				g.lineTo(p1.x * retina, p1.y * retina);
				g.lineTo(p0.x * retina, p0.y * retina);
				g.closePath();
				g.stroke();
				g.fill();
			}
		}
	}

	Side (x1, y1, x2, y2, x3, y3) {
		return ((x1 - x2) * (y3 - y2) - (y1 - y2) * (x3 - x2));
	}
}

ConfettiRibbon.bounds = new Vector2(0, 0);

const speed = 50,
	duration = (1.0 / speed),
	confettiRibbonCount = 11,
	ribbonPaperCount = 30,
	ribbonPaperDist = 8.0,
	ribbonPaperThick = 8.0,
	confettiPaperCount = 95;

const cancel = window.cancelAnimationFrame ||
	window.webkitCancelAnimationFrame ||
	window.clearTimeout;

const currentTime = Date.now || function () {
	return new Date().getTime();
};

let prev = currentTime();

const request = window.requestAnimationFrame ||
	window.webkitRequestAnimationFrame ||
	function fallback(fn) {
		const curr = currentTime();
		const ms = Math.max(0, 16 - (curr - prev));
		const req = setTimeout(fn, ms);
		prev = curr;
		return req;
	};

class Confetti {
	constructor (domId) {
		this.canvas = document.getElementById(domId);
		this.canvasParent = this.canvas.parentNode;
		this.canvasWidth = this.canvasParent.offsetWidth;
		this.canvasHeight = this.canvasParent.offsetHeight;
		this.canvas.width = this.canvasWidth * retina;
		this.canvas.height = this.canvasHeight * retina;
		this.context = this.canvas.getContext('2d');
		this.interval = null;
		this.confettiRibbons = [];
		ConfettiRibbon.bounds = new Vector2(this.canvasWidth, this.canvasHeight);
		for (let i = 0; i < confettiRibbonCount; i++) {
			this.confettiRibbons[i] = new ConfettiRibbon(Math.random() * this.canvasWidth,
				-Math.random() * this.canvasHeight * 2,
				ribbonPaperCount,
				ribbonPaperDist,
				ribbonPaperThick,
				45, 1, 0.05);
		}
		this.confettiPapers = [];
		ConfettiPaper.bounds = new Vector2(this.canvasWidth, this.canvasHeight);
		for (let i = 0; i < confettiPaperCount; i++) {
			this.confettiPapers[i] = new ConfettiPaper(Math.random() * this.canvasWidth,
				Math.random() * this.canvasHeight);
		}
		const self = this;
		this.eventListener = function () {
			self.resize();
		};
	}

	resize () {
		this.canvasWidth = this.canvasParent.offsetWidth;
		this.canvasHeight = this.canvasParent.offsetHeight;
		this.canvas.width = this.canvasWidth * retina;
		this.canvas.height = this.canvasHeight * retina;
		ConfettiPaper.bounds = new Vector2(this.canvasWidth, this.canvasHeight);
		ConfettiRibbon.bounds = new Vector2(this.canvasWidth, this.canvasHeight);
	}

	start () {
		if (this.interval !== null) {
			return;
		}
		window.addEventListener("resize", this.eventListener);
		this.stop();
		this.update();
	}

	stop () {
		if (this.interval === null) {
			return;
		}
		window.removeEventListener("resize", this.eventListener);
		cancel.call(window, this.interval);
		this.interval = null;
	}

	update () {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		for (let i = 0; i < confettiPaperCount; i++) {
			this.confettiPapers[i].Update(duration);
			this.confettiPapers[i].Draw(this.context);
		}
		for (let i = 0; i < confettiRibbonCount; i++) {
			this.confettiRibbons[i].Update(duration);
			this.confettiRibbons[i].Draw(this.context);
		}
		const self = this;
		this.interval = request(function () {
			self.update();
		});
	}
}

export function backgroundTrophyAnimation(containerId) {
	const confetti = new Confetti(containerId);
	confetti.start();
	return confetti;
}
