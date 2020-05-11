//Just a shorthand since there's a lot of selectors
const get = arg => document.querySelector(arg);

//Select all the things
const tracker = get('#tracker');
const button = get('button');
const paw = get('#Paw');
const tail = get('#Tail');
const leftEye = get('#Left-eye-pupil');
const rightEye = get('#Right-eye-pupil');
const cat = get('svg');
const cursor = get('#cursor');

//What happens when mousing over the button
const mouseOver = () => {
	paw.style.transform = 'rotate(-185deg)';
	if(!paw.classList.value.includes('swat')) {
		paw.classList.add('swat');
		cursor.classList.add('swatted');
		document.body.style.cursor = 'none';
		cat.style.animation = 'none';
		tail.style.animation = 'none';
		document.body.style.cursor = 'none';
		button.style.marginRight = '-11rem';
	}
}

//What happens when mousing out from the button
const mouseOut = () => {
	if(paw.classList.value.includes('swat')) {
		paw.classList.remove('swat');
		cursor.classList.remove('swatted');
		cat.style.animation = 'tail 7s infinite alternate';
		tail.style.animation = 'tail 2s ease infinite alternate';
		document.body.style.cursor = 'unset';
		button.style.marginRight = '-10rem';
	}
}

//What happens when we're near the button
const mouseNear = (coords, x, y) => {
	const minY = coords.y - coords.height;
	const maxY = coords.y + (coords.height * 2);
	const minX = coords.x - coords.width;
	const maxX = coords.x + (coords.width * 2);
	const zeroX = (maxX + minX) / 2;
	const zeroY = (maxY + minY) / 2;
	paw.style.transform = `rotate(-${60 / (zeroX + zeroY) * (x + y)}deg)`;
}

//Boolean; whether the cursor is over the button
const overTheButton = (coords, x, y) => {
	return y >= coords.y && y <= coords.y + coords.height && x >= coords.x && x <= coords.x + coords.width;
}

//Boolean; whether the cursor is near the button
const nearTheButton = (coords, x, y) => {
	return y >= coords.y - (coords.height * 2) && y <= coords.y + (coords.height * 3) && x >= coords.x - coords.width && x <= coords.x + (coords.width * 2)
}


//The actual event listener that tracks the mouse (see the HTML note)
tracker.addEventListener('mousemove', e => {
	const btnCoords = button.getBoundingClientRect();
	const x = e.offsetX;
	const y = e.offsetY;
	const windowHeight = window.innerHeight;
	const windowWidth = window.innerWidth;
	const max = 3;
	
	//Execute the proper function(s) from above based on cursor placement
	if(overTheButton(btnCoords, x, y)) {
		mouseOver();
	} else { 
		mouseOut();
		if (nearTheButton(btnCoords, x, y)){
			mouseNear(btnCoords, x, y);
		} else {
			paw.style.transform = 'rotate(-185deg)';
		}
	}
	
	//Eye movement
	[leftEye, rightEye].forEach(eye => {
		eye.style.transform = 
		`translate(
			${max / (windowWidth / x)}%,
			${max / (windowHeight / y)}%
		)`;
	});
});