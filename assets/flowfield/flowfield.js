function setup() {
    this.c = createCanvas(windowWidth || 1366, windowHeight || 768);
    c.parent('flowfield-wrapper')

    this.gridX = width;
    this.gridY = height;
    
    this.scl = 40;
    this.zoom = 1;

    this.rows = floor(gridY/scl);
    this.cols = floor(gridX/scl);

    this.coarse = 0.1;

    this.isShowingVectors = false;
    this.isTimeDep = true;
    this.zoff = 0.0;

    this.vectorMagnitude = 1;
    this.maxVelocity = 2;
    this.flowfield = [];
    this.particles = [];
    for(let i = 0; i < 2000; i++){
        particles[i] = new Particle();
    }   

    this.hue = 0;
    this.satur = 0;
    this.c;
    this.isPsychedelia = false;
    this.bgc = 200;
    background(bgc);

    //html elements
    this.parentDiv = createDiv('Controls');
    parentDiv.style('background-color', 'rgba(150, 150, 150, 0.6)');
    parentDiv.style('color', 'white');
    parentDiv.style('display', 'none');
    // parentDiv.position(0, 20);
    parentDiv.parent('options-wrapper')
    this.fr = createP();
    parentDiv.child(fr);
    this.isTimeDepCheck = createCheckbox('Time-dependent field', isTimeDep);
    parentDiv.child(isTimeDepCheck);
    isTimeDepCheck.changed(()=>{
        isTimeDep = !isTimeDep;
    });
    isShowingVectorsCheck = createCheckbox('Show vector field', isShowingVectors);
    parentDiv.child(isShowingVectorsCheck);
    isShowingVectorsCheck.changed(()=>{
        isShowingVectors = !isShowingVectors;
        background(bgc);
    });
    this.magSliderP = createP('Vector Magnitude:');
    parentDiv.child(magSliderP);
    this.magnitudeSlider = createSlider(0.01, 10, vectorMagnitude);
    parentDiv.child(magnitudeSlider);
    this.velSliderP = createP('Particle Velocity:');
    parentDiv.child(velSliderP);
    this.velocitySlider = createSlider(1, 10, 2);
    parentDiv.child(velocitySlider);
    this.partNumSliderP = createP('Particle Number:');
    parentDiv.child(partNumSliderP);
    this.particleNumberSlider = createSlider(500, 10000, 2000);
    parentDiv.child(particleNumberSlider);
    this.setPartNumBtn = createButton('Set');
    parentDiv.child(setPartNumBtn);
    setPartNumBtn.mousePressed(setParticleNumber);
    isPsychedeliaCheck = createCheckbox('Psychedelia!', isPsychedelia);
    parentDiv.child(isPsychedeliaCheck);
    isPsychedeliaCheck.changed(()=>{
        isPsychedelia = !isPsychedelia;
    });
    this.clearBtn = createButton('Clear');
    parentDiv.child(clearBtn);
    clearBtn.mousePressed(clearScreen);
    this.closeBtn = createButton('Close');
    parentDiv.child(closeBtn);
    closeBtn.mousePressed(clearScreen);
    closeBtn.mouseClicked(()=>{
        parentDiv.style('display', 'none');
        isShowControls = false;
      });
  
    this.isShowControls = false;
    this.optionsBtn = createButton('Show Options');
    // optionsBtn.position(0, 0);
    optionsBtn.parent('options-wrapper')
    optionsBtn.mouseClicked(()=>{
      if(isShowControls) {
        parentDiv.style('display', 'none');
      } else {
        parentDiv.style('display', 'block');
      }
      isShowControls = !isShowControls;
    });
    //html elements end
}

function draw() {

    //scale(zoom);
    if(isShowingVectors) {background(bgc);}
    fr.html('FPS: ' + floor(frameRate()));
    vectorMagnitude = magnitudeSlider.value();
    maxVelocity = velocitySlider.value();
    partNumSliderP.html('Particle Number: ' + particleNumberSlider.value());
    //console.log(frameRate());
    if(isTimeDep){
        zoff += 0.01;
    }
    let yoff = 0;
    stroke(0, 100);
    for(let i = 0; i < rows; i++) {
        let xoff = 0;
        for(let j = 0; j < cols; j++) {
            let index = j + i * cols;
            let flow = noise(xoff, yoff, zoff) * TWO_PI * 2;
            xoff += coarse;
            // fill(flow);
            // rect(j*scl, i*scl, scl, scl);
            let v = p5.Vector.fromAngle(flow);
            v.setMag(vectorMagnitude);
            flowfield[index] = v;

            if(isShowingVectors) {
                //stroke(0, 100);
                push();
                translate(j * scl, i * scl);
                rotate(v.heading());
                line(0, 0, scl, 0);
                pop();
            }
            
        }
        yoff += coarse;
    }

    if(isPsychedelia) {
        let c = color('hsla('+hue++%360+',100%,50%,255)');
        stroke(c);
    } else {
        stroke(0, 100);
    }      
    // strokeWeight(1) ;
    // if(isShowingVectors) {
    //     strokeWeight(2);
    // }
    for(let i = 0; i < particles.length; i++) {    
        particles[i].update();
        particles[i].show();
        particles[i].follow(flowfield);  
    }  
    
}

function clearScreen() {
    background(bgc);
}

function setParticleNumber() {
    background(bgc);
    particles = [];
    for(let i = 0; i < particleNumberSlider.value(); i++){
        particles[i] = new Particle();
    }
}

function windowResized() {
  c.resize(windowWidth, windowHeight);
  parentDiv.position(0, 20);
  background(bgc);
  rows = floor(windowHeight/scl);
  cols = floor(windowWidth/scl);
}

function Particle() {
    this.pos = createVector(random(width), random(height));
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.prevPos = createVector(0, 0);//this.pos;
    //this.prevPos.x= this.pos.x;
    //this.prevPos.y = this.pos.y;

    this.update = function() {
        this.vel.add(this.acc);
        this.vel.limit(maxVelocity);
        this.prevPos.x = this.pos.x;
        this.prevPos.y = this.pos.y;
        //console.log(this.prevPos);
        this.pos.add(this.vel);
        this.acc.mult(0);

        this.pos.x = (this.pos.x + width) % width;
        this.pos.y = (this.pos.y + height) % height;
        if(abs(this.pos.x-this.prevPos.x) > width/2 || abs(this.pos.y-this.prevPos.y) > height/2) {
            this.prevPos.x = this.pos.x;
            this.prevPos.y = this.pos.y;
        }
    }

    this.applyForce = function(force) {
        this.acc.add(force);
    }

    this.follow = function(vectors) {
        let x = floor(this.pos.x / scl);
        let y = floor(this.pos.y / scl);
        let index = x + y * cols;
        let force = vectors[index];
        this.applyForce(force);
    }

    this.show = function() {
        //push();
        //translate(this.pos.x, this.pos.y);
        line(this.pos.x, this.pos.y, this.prevPos.x, this.prevPos.y);
        //point(this.pos.x, this.pos.y);
        //pop();
    }
}