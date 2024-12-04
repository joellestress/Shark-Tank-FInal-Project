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
let bugSound;
let sleepButton;
let openEyes;
let closeEyesAni;
let isClosingEyes = false; // Flag to track if the animation is playing
let openEyesAni;
let timer = 0;
let isOpeningEyes = false;


function preload() {
  branchImage = loadImage('assets/branch.png');
  tree = loadImage('assets/tree.jpg');
  stick = loadImage('assets/stick.png');
  sharkAni = loadAnimation('assets/shark_0001.png', 'assets/shark_0025.png'); 
  waterSound = loadSound('assets/water.mp3');
  ocean = loadImage('assets/ocean.jpg');
  fallSound = loadSound('assets/falling.mp3');
  bug = loadAnimation('assets/bug_0001.png', 'assets/bug_0013.png');
  bugSound = loadSound('assets/bugSound.mp3');
  openEyes = loadImage('assets/openeyes.jpg');
  closeEyesAni = loadAnimation('assets/closingeye_001.png', 'assets/closingeye_014.png');
  openEyesAni = loadAnimation('assets/openingeye_001.png', 'assets/openingeye_017.png');
}

function setup() {
  new Canvas(1280, 720);
  displayMode('centered');
  
  // Create character sprite for stage 0
  character = new Sprite(width / 2, height - 50, 50, 50);
  character.color = color(255, 0, 0);
  character.vel.y = -2;
  character.friction = 0.5;

  button = new Sprite(width / 2, height / 1.5, 200, 100); // x, y, width, height
  button.color = 'blue'; // Set the color of the button
  button.text = 'Go to Sleep'; // Add text to the button
  button.textColor = 'white';
  button.textSize = 18;
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
    case 0:
      background(openEyes);
      character.visible = false; // Hide character in stage 0

      if (isClosingEyes) {
        scale(width / closeEyesAni.width, height / closeEyesAni.height)
        animation(closeEyesAni, width / 2, height / 2); // Play the closing eyes animation
        scale(2);
        console.log(closeEyesAni);
        if (millis() - animationStartTime > 900) { // Assuming the animation duration is 1 second
          isClosingEyes = false;
          stage = 1; // Switch to the next stage after the animation finishes
          startTime = millis(); // Initialize startTime when switching to stage 1
        }
      } else {
        // Check if the mouse is pressed on the button
        if (button.mouse.pressing()) {
          isClosingEyes = true; // Start the closing eyes animation
          closeEyesAni.play(); // Play the animation
          animationStartTime = millis(); // Start the animation timer
        } else {
          button.color = 'blue'; // Reset color
          button.text = 'Go to Sleep';
        }
        console.log(closeEyesAni);
      }
      break;
    case 1: // Drowning stage
      background(ocean);
      character.visible = true;
      button.visible = false;

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

      if (millis() - startTime > 15000) {
        stage = 2; // Change to next stage
        startTime = millis(); // Reset `startTime` for the next stage
         // Hide all enemies
         for (let enemy of enemies) {
          enemy.visible = false;
        }
              }
      break;

    case 2: // Falling stage with branches
      background(tree);
      character.visible = false;

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

      if (millis() - startTime > 15000) {
        stage = 3;
      }
      break;

    case 3:
      background(255);
      player2.visable = false;

      // Clear branches group
      for (let i = branches.length - 1; i >= 0; i--) {
        branches[i].remove();
      }


     // Draw a square in the middle of the screen
      rectMode(CENTER); // Set rectangle mode to CENTER
      fill(255, 0, 0); // red color
      noStroke(); // No border
      rect(width / 2, height / 2, 100, 100); // x, y, width, height
  
    
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
    
        if (dist(mouseX, mouseY, gem.x, gem.y) < gem.width / 2 && stage === 3) {
          gem.remove();
          console.log("Gem collected");
          bugSound.play();
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
    // Define drawSprites function
    function drawSprites(group) {
      for (let sprite of group) {
        sprite.draw();
      }
    }

    timer++;
  
    // Switch to stage 4 after a specific time
    if (timer > 1000) { // Adjust timer value (300 frames is about 5 seconds)
      stage = 4;
      timer = 0; // Reset timer for stage 4
    }
    console.log(timer);
    break;

    case 4:
      background("#0000FF");
      gems.visible = false;
      character.visable = false;
      player2.visable = false;

      // Display text
      animation(openEyesAni, width / 2, height / 2);

      fill(255); // Set text color to white
      textSize(32); // Set text size
      textAlign(CENTER, CENTER); // Center the text
      text("Good morning! How did you sleep?", width / 2, height / 3); // Draw the text


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
