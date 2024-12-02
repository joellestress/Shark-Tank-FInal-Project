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
let player;
let gems;
let sharkAni;
let waterSound;
let ocean;
let fallSound;
let collided = false; // Variable to track collision state
let bug;

function preload() {
  branchImage = loadImage('assets/branch.png');
  tree = loadImage('assets/tree.jpg');
  stick = loadImage('assets/stick.png');
  sharkAni = loadAnimation('assets/shark_0001.png', 'assets/shark_0025.png'); 
  waterSound = loadSound('assets/water.mp3');
  ocean = loadImage('assets/ocean.jpg');
  fallSound = loadSound('assets/falling.mp3');
  bug = loadAnimation('assets/bug_0001.png', 'assets/bug_0013.png');
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

function spawnEnemy() {
  console.log("spawnEnemy function called");
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

  // Create an enemy sprite and assign the shark animation
  let enemy = new Sprite(x, y, 50, 50); // Adjust size for your shark
  enemy.addAnimation('shark', sharkAni);
  enemy.changeAnimation('shark');
  enemies.push(enemy);
  console.log("Shark animation assigned:", enemy.animation);
}

function draw() {
  switch (stage) {
    case 0: // Drowning stage
      background(ocean);
      character.vel.y += 0.1;
      if (character.y > height - 25) {
        character.y = height - 25;
        character.vel.y = 0;
      }
      if (kb.pressing('left')) character.vel.x = -2;
      else if (kb.pressing('right')) character.vel.x = 2;
      else character.vel.x = 0;

      if (kb.pressed('left') || kb.pressed('right')) {
        waterSound.play(); // Play the water sound
      }

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
          collided = true; // Update collision state
          setTimeout(() => {
            player2.vel.y = 5;
            grasped = false;
            collided = false; // Reset collision state after grasping
          }, 1000);
        }
      });

      if (!collided && !fallSound.isPlaying()) { // Check collision and play sound if not playing
        fallSound.play();
      }

      if (player2.y > nextBranchY) {
        spawnBranch();
        nextBranchY += 100;
      }

      camera.y = player2.y;

      if (millis() - startTime > 10000) {
        stage = 2;
      }
      break;

    case 2:
      background(255);

      // Clear branches group
      for (let i = branches.length - 1; i >= 0; i--) {
        branches[i].remove();
      }
    
      // Initialize gems if not already done
      if (!gems) {
        gems = new Group();
        for (let i = 0; i < 80; i++) {
          let gem = new Sprite(random(0, width), random(0, height), 30, 'dynamic');
          gem.addAnimation('bug', bug);
          gem.changeAnimation('bug');
          gems.add(gem);
        }
        console.log("Gems initialized:", gems.length);
      }
    
      // Move player towards mouse
      if (!player) {
        player = new Sprite(width / 2, height / 2, 50, 50, 'dynamic');
      }
      player.vel.x = (mouseX - player.x) * 0.05;
      player.vel.y = (mouseY - player.y) * 0.05;
    
      // Update gems' movement and check for collection
      for (let gem of gems) {
        let direction = createVector(width / 2 - gem.x, height / 2 - gem.y);
        direction.normalize();
        gem.vel.x = direction.x * 0.5;
        gem.vel.y = direction.y * 0.5;
    
        if (dist(mouseX, mouseY, gem.x, gem.y) < gem.width / 2) {
          gem.remove();
          console.log("Gem collected");
        }
      }
    
      // Spawn new gems periodically
      if (frameCount % 60 === 0) {
        let newGem = new Sprite(random(0, width), random(0, height), 30, 'dynamic');
        newGem.addAnimation('bug', bug);
        newGem.changeAnimation('bug');
        gems.add(newGem);
        console.log("New gem spawned");
      }
    
      // Draw all gems
      drawSprites(gems);
      break;
    
    // Define drawSprites function
    function drawSprites(group) {
      for (let sprite of group) {
        sprite.draw();
      }
    }
      break;

    case 3:
      // closing stage 
      break;

  }
}

function spawnBranch() {
  let branch = new Sprite(random(width), player2.y + height / 2, 100, 20, 'static');
  branch.img = branchImage;
  branches.add(branch);
}

function collect(player, gem) {
  gem.remove(); // Remove gem upon collection.
}
