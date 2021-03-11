class YBParticles {
  constructor(config) {
    this.execTime = config.speed;
    this.quantity = config.quantity;
    this.fireblock = document.querySelector("#fire-block");
  }

  create() {
    var rotateAngle = 1;
    var fire_index = 0;
    for (var i = 0; i < this.quantity; i++) {
      let f = document.createElement("div");
      f.classList.add("fire-particle");
      rotateAngle++;
      let wiiidth = 0.14;
      f.style.width = wiiidth * i + "px";
      f.style.height = wiiidth * i + "px";
      let rotate = rotateAngle * 15;
      f.style.transform = "rotate(" + rotate + "deg)";
      f.style.transform += "translateX(" + rotateAngle + "px)";
      f.style.transform += "translateY(" + rotateAngle + "px)";
      f.classList.add("animate");
      f.style.backgroundColor = this.getRandomColor();
      fire_index++;
      setTimeout(() => {
        this.fireblock.appendChild(f);
      }, fire_index * this.execTime);
    }
  }

  getRandomColor() {
    var letters = "0123456789ABCDEF";
    var color = "#";
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
}

var particles = new YBParticles({ quantity: 200, speed: 20 });
particles.create();