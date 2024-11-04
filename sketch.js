let stage = 0;
let character;
let enemies = [];
let enemySpeed = 2;
let spawnRate = 60;  // How often enemies spawn (frames)
let player2;
let branches;
let branchImage;
let grasped = false;
let tree;

function preload() {
  branchImage = loadImage('assets/branch.png');
  tree = loadImage('assets/tree.jpg');
}

function setup() {
  new Canvas(1280, 720);
  displayMode('centered');
  
  // Create character sprite
  character = new Sprite(width / 2, height - 50, 50, 50);
  character.color = color(255, 0, 0);
  character.vel.y = -2; // Initial sinking speed
  character.friction = 0.5; // Water resistance
}

function draw() {
  switch (stage) {
    case 0: //drowning
      background(0, 150, 255); // Blue background for water

      // Character movement
      character.vel.y += 0.1; // Gravity pulls character down
      if (character.y > height - 25) { // Keep character within canvas boundaries
        character.y = height - 25;
        character.vel.y = 0;
      }

      // Arrow key controls
      if (kb.pressing('left')) character.vel.x = -2;
      else if (kb.pressing('right')) character.vel.x = 2;
      else character.vel.x = 0;

      if (kb.pressing('up')) character.vel.y -= 0.12;

      // Spawn enemies periodically
      if (frameCount % spawnRate === 0) {
        spawnEnemy();
      }

      // Move each enemy toward the character and check for collision
      for (let enemy of enemies) {
        // Calculate direction to the character
        let direction = createVector(character.x - enemy.x, character.y - enemy.y);
        direction.normalize();
        enemy.vel.x = direction.x * enemySpeed;
        enemy.vel.y = direction.y * enemySpeed;

        // Check if enemy collides with the character
        if (enemy.overlaps(character)) {
			character.position.y += 5;
        }
      }
    if (mouseIsPressed) {
        stage = 1; // Switch to stage 1
        console.log("Transitioning to stage 1"); // Log the transition
    }
    break;
      
    case 1:
      // Falling stage logic
	  background(tree);

       // Initialize player2 and branches if they haven't been created yet
       if (!player2) {
        // Create player2 sprite with initial fall speed
        player2 = new Sprite(200, 100, 50, 50, 'dynamic');
        player2.vel.y = 5;

        // Create branches as a group
        branches = new Group();
        for (let i = 0; i < 10; i++) {
          let branch = new Sprite(random(width), i * 100, 100, 20, 'static');
          branch.img = branchImage; // Set the image for the branch sprite
          branches.add(branch);
        }
      }

      player2.visible = true;
      branches.visible = true;

      //keyboard controls
      if(kb.pressing('left')) player2.vel.x = -2;
      else if (kb.pressing('right')) player2.vel.x =2;

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
      break;
      
    case 2:
      // Poison bugs stage logic
      break;
      
    case 3:
      // Tornados stage logic
      break;
      
    case 4:
      // Closing stage logic
      break;
  }
}

// Function to spawn an enemy at a random edge
function spawnEnemy() {
  // Randomly choose an edge: top, bottom, left, or right
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

  // Create an enemy sprite at the chosen position
  let enemy = new Sprite(x, y, 30, 30);
  enemy.color = color(255, 0, 0); // Red color for enemies
  enemies.push(enemy);
}
