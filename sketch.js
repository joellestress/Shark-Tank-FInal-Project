let stage = 0;
let character;
let enemies = [];
let enemySpeed = 2;
let spawnRate = 60;
let player2;
let branches;
let branchImage;
let grasped = false;
let tree;
let nextBranchY; // Track position of new branches 
let fall = 0.05; 
let startTime;
let stick;

function preload() {
  branchImage = loadImage('assets/branch.png');
  tree = loadImage('assets/tree.jpg');
  stick = loadImage('assets/stick.png');
}

function setup() {
  new Canvas(1280, 720);
  displayMode('centered');
  
  // Create character sprite for stage 0
  character = new Sprite(width / 2, height - 50, 50, 50);
  character.color = color(255, 0, 0);
  character.vel.y = -2;
  character.friction = 0.5;
}

function draw() {
  switch (stage) {
    case 0: // Drowning stage
      background(0, 150, 255);
      character.vel.y += 0.1;
      if (character.y > height - 25) {
        character.y = height - 25;
        character.vel.y = 0;
      }
      if (kb.pressing('left')) character.vel.x = -2;
      else if (kb.pressing('right')) character.vel.x = 2;
      else character.vel.x = 0;

      if (kb.pressing('up')) character.vel.y -= 0.12;
      if (frameCount % spawnRate === 0) {
        spawnEnemy();
      }
      for (let enemy of enemies) {
        let direction = createVector(character.x - enemy.x, character.y - enemy.y);
        direction.normalize();
        enemy.vel.x = direction.x * enemySpeed;
        enemy.vel.y = direction.y * enemySpeed;

        if (enemy.overlaps(character)) {
          character.position.y += 5;
        }
      }
      if (mouseIsPressed) {
        stage = 1;
        startTime = millis();
        console.log("Transitioning to stage 1");
      }
      break;

    case 1: // Falling stage with branches
      background(tree);

      if (!player2) {
        player2 = new Sprite(200, 100, 50, 50, 'dynamic');
        player2.vel.y = 5;
        branches = new Group();

        for (let i = 0; i < 10; i++) {
          let branch = new Sprite(random(width), i * 100, 100, 20, 'static');
          branch.img = branchImage;
          branches.add(branch);
        }

        // Set initial `nextBranchY` position to just below the last branch
        nextBranchY = player2.y + 300; 
      }

      player2.visible = true;
      branches.visible = true;

      player2.vel.y += fall;
      if (player2.vel.y > 10) { // Optionally set a maximum fall speed
        player2.vel.y = 10;
      }

      player2.vel.y += 0.2;
      if (player2.vel.y > 5) {
        player2.vel.y = 5;
      }
      if (kb.pressing('left')) player2.vel.x = -2;
      else if (kb.pressing('right')) player2.vel.x = 2;

      player2.collides(branches, (branch) => {
        if (!grasped) {
          player2.vel.y = 0;
          grasped = true;
          setTimeout(() => {
            player2.vel.y = 5;
            grasped = false;
          }, 1000);
        }
      });

      if (player2.y > nextBranchY) {
        spawnBranch();
        nextBranchY += 100;
      }

      camera.y = player2.y;

      if (millis() - startTime > 30000) {
        stage = 2;
      }
      break;

    case 2:
      for (let i = branches.length - 1; i >= 0; i--) {
        branches[i].remove(); // Remove sprite from group
      }
    
      console.log("Branches removed");
      background(255);

      let stickWidth = stick.width * 2;  // Double the width
      let stickHeight = stick.height * 2; // Double the height
    
      // Display the scaled stick image in the center
      image(stick, width / 2 - stickWidth / 2, height / 2 - stickHeight / 2, stickWidth, stickHeight);
      
      break;

    case 3:
      // Tornadoes stage logic
      break;

    case 4:
      // Closing stage logic
      break;
  }
}

function spawnBranch() {
  let branch = new Sprite(random(width), player2.y + height / 2, 100, 20, 'static');
  branch.img = branchImage;
  branches.add(branch);
}

function spawnEnemy() {
  let edge = floor(random(4));
  let x, y;

  if (edge === 0) {  // Top
    x = random(width);
    y = 0;
  } else if (edge === 1) {  // Bottom
    x = random(width);
    y = height;
  } else if (edge === 2) {  // Left
    x = 0;
    y = random(height);
  } else {  // Right
    x = width;
    y = random(height);
  }

  let enemy = new Sprite(x, y, 30, 30);
  enemy.color = color(255, 0, 0);
  enemies.push(enemy);
}
