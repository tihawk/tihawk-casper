function setup() {

	this.c = createCanvas(windowWidth || 1366, windowHeight || 768, WEBGL);
	c.parent('vicsek-wrapper')

	this.yPressed = 0;
	this.xPressed = 0;

    this.yAngle = 0;
    this.xAngle = 0;
	this.zoom = 1;

	this.N = 256;
	this.L = createVector(1000., 1000., 1000.);
	this.timeDelay = 0;
	this.eta = 45.;
	this.r = 100.;
	this.vel = 5.;
	this.deltaT = 1;

	this.steps = 0;

	this.particles = [];
	for (let i = 0; i < N; i++) {
		particles[i] = new Particle();
	}

    //html elements
		const buttonColor = ['color', 'black']

    this.parentDiv = createDiv('');
    parentDiv.style('background-color', 'rgba(150, 150, 150, 0.6)');
    parentDiv.style('color', 'white');
    parentDiv.style('display', 'none');
    // parentDiv.position(0, 0);
		parentDiv.parent('options-wrapper')

    this.hideOptionsBtn = createButton('Hide Options');
		this.hideOptionsBtn.style(...buttonColor)
    parentDiv.child(hideOptionsBtn);
    hideOptionsBtn.mouseClicked(optionsButtonClicked);

    this.stepCountParent = createP();
    stepCountParent.style('font-size', '12');
    parentDiv.child(stepCountParent);

    this.fr = createP();
    fr.style('font-size', '12')
    parentDiv.child(fr);

    
    this.nP = createP('Number of particles:');
    nP.style('font-size', '12');
    parentDiv.child(nP);
    this.nInput = createInput(N, 'number');
		this.nInput.style(...buttonColor)
    nInput.size(120);
    parentDiv.child(nInput);

    this.lP = createP('Size of box:');
    lP.style('font-size', '12');
    parentDiv.child(lP);
    this.lInputX = createInput(L.x/100, 'number');
		this.lInputX.style(...buttonColor)
    lInputX.size(40);
    parentDiv.child(lInputX);
    this.lInputY = createInput(L.y/100, 'number');
		this.lInputY.style(...buttonColor)
    lInputY.size(40);
    parentDiv.child(lInputY);
    this.lInputZ = createInput(L.z/100, 'number');
		this.lInputZ.style(...buttonColor)
    lInputZ.size(40);
    parentDiv.child(lInputZ);

    this.startP = createP('Restart with new vars:');
    startP.style('font-size', '13');
    parentDiv.child(startP);
    this.restartBtn = createButton('Start');
		this.restartBtn.style(...buttonColor)
    parentDiv.child(restartBtn);
    restartBtn.mouseClicked(restart);
  
    this.isShowControls = false;
    this.btnDiv = createDiv('');
    btnDiv.style('background-color', 'rgba(150, 150, 150, 0.1)');
    btnDiv.style('color', 'white');
    btnDiv.style('font-size', '12');
    this.stepCount = createP();
    btnDiv.child(stepCount);
		btnDiv.parent('options-wrapper')
    // btnDiv.position(0, 0);
    this.optionsBtn = createButton('Show Options');
		this.optionsBtn.style(...buttonColor)
    btnDiv.child(optionsBtn);
    optionsBtn.mouseClicked(optionsButtonClicked);
    this.restartBtn = createButton("Restart");
		this.restartBtn.style(...buttonColor)
    btnDiv.child(restartBtn);
    restartBtn.mouseClicked(restart);
    //html elements end

}

function draw() {
	scale(zoom);
	rotateY(yAngle);
	rotateX(xAngle);
	background(15,35,83);

	fr.html('FPS: ' + floor(frameRate()));
	stepCount.html('Steps: ' + steps);
	stepCountParent.html('Steps: ' + steps);

	translate(-L.x/2, -L.y/2, -L.z/2);

	push();
	noFill();
	stroke(255);
	translate(L.x/2, L.y/2, L.z/2);
	box(L.x, L.y, L.z);
	pop();

	
	
	distances = getDistances(particles);

	for(let i = 0; i < particles.length; i++) {

		neighbours = getNeighbours(distances, i);
		avg = particles[i].getAvg(neighbours);
		noise = particles[i].getVec().mult(this.eta);
		newDir = avg.add(noise).normalize();
		newPos = particles[i].getPos().add(newDir.mult(this.deltaT*this.vel));

		particles[i].update(newPos, newDir);

		particles[i].show(neighbours);
	}
	steps++;
}

function optionsButtonClicked() {
	if(isShowControls) {
        parentDiv.style('display', 'none');
        btnDiv.style('display', 'block');
      } else {
        parentDiv.style('display', 'block');
        btnDiv.style('display', 'none');
      }
      isShowControls = !isShowControls;
}

function restart() {
  c.resize(windowWidth, windowHeight);
	background(0, 0, 0);
	N = nInput.value();

	L.x = lInputX.value()*100;
	L.y = lInputY.value()*100;
	L.z = lInputZ.value()*100;

	particles = [];
	for (let i = 0; i < N; i++) {
		particles[i] = new Particle();
	}

	steps = 0;
	xAngle = 0;
	yAngle = 0;
}

function mousePressed() {
	yPressed = mouseY;
	xPressed = mouseX;
}

function mouseDragged() {
    yAngleTemp = atan( (mouseX - xPressed)*0.0001 );
    xAngleTemp = atan( (yPressed - mouseY)*0.0001 );

    yAngle += yAngleTemp;
    xAngle += xAngleTemp;

    //yAngle = map(yAngle, -HALF_PI, HALF_PI, -PI, PI);
    //xAngle = map(xAngle, -HALF_PI, HALF_PI, -PI, PI);
}

function mouseWheel(e) {
	zoom -= e.delta*0.001;
	//console.log(zoom);
}

function keyPressed() {
	if (keyCode === 107) {
		zoom += 0.1
	} else if (keyCode === 109) {
		zoom -= 0.1
	}

	return false
}

function getDistances(particles) {
	this.distances = [];
	for (let i = particles.length - 1; i >= 0; i--) {
		distances[i] = [];
	}

	for(let i = 0; i < particles.length; i++){
		parI = particles[i].getPos();
		for(let j = 0; j < particles.length; j++){
			parJ = particles[j].getPos();
			dx = abs(parI.x - parJ.x);
			dy = abs(parI.y - parJ.y);
			dz = abs(parI.z - parJ.z);
			dx = dx - round(dx/L.x)*L.x;
			dy = dy - round(dy/L.y)*L.y;
			dz = dz - round(dz/L.z)*L.z;

			this.distances[i][j] = sqrt(dx**2+dy**2+dz**2)
		}
	}

	return this.distances;
}

function getNeighbours(distances, index) {

	neighbours = [];

	for (let i = 0; i < distances.length; i++) {
		if(distances[index][i] < this.r)
			neighbours.push(i);
	}

	//console.log(neighbours);
	return neighbours;

}

function Particle() {
	this.pos = createVector(random(L.x), random(L.y), random(L.z));
	this.theta = random(0, TWO_PI);
	this.zed = random(-1, 1);
	this.vec = createVector(cos(this.theta) * sqrt(1 - this.zed**2), sin(this.theta) * sqrt(1 - this.zed**2), this.zed);

	this.getAvg = function(neighbours) {
		n = neighbours.length;
		vecs = createVector(0, 0, 0);

		for (let i = neighbours.length - 1; i >= 0; i--) {
			vecs.add(particles[neighbours[i]].getVec());
		}
		
		avgVector = vecs.div(n);

		return avgVector;
	}

	this.getPos = function() {
		return this.pos;
	}

	this.getVec = function() {
		return this.vec;
	}

	this.update = function(position, vector) {
		this.pos = position;
		this.vec = vector;

		if(this.pos.x > L.x)
			this.pos.x = 0;
		if(this.pos.x < 0)
			this.pos.x = L.x;
		if(this.pos.y > L.y)
			this.pos.y = 0;
		if(this.pos.y < 0)
			this.pos.y = L.y;
		if(this.pos.z > L.z)
			this.pos.z = 0;
		if(this.pos.z < 0)
			this.pos.z = L.z;
	}

	this.show = function(neighbours) {
		rgb = map(neighbours.length, 0, N*0.1, 0, 255);
		stroke(255 - rgb, rgb, 0);
		//scl = (vel + 10)%10;
		//console.log(scl);
		push();
		fill(255 - rgb, rgb, 0);
		translate(this.pos);
		box(5);
		pop();
	}
}