let stage = 0;
let character;

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
    case 0:
      background(0, 150, 255); // Blue background for water
      
      character.vel.y += 0.1; // Gravity pulls character down
      
      // Keep character within canvas boundaries
      if (character.y > height - 25) {
        character.y = height - 25;
        character.vel.y = 0;
      }
      
      // Arrow key controls
      if (kb.pressing('left')) {
        character.vel.x = -2; // Move left
      } else if (kb.pressing('right')) {
        character.vel.x = 2; // Move right
      } else {
        character.vel.x = 0; // Stop horizontal movement if no key is pressed
      }
      
      if (kb.pressing('up')) {
        character.vel.y -= 0.12; // Move up, fighting against gravity
      }
      
      break;
      
    case 1:
      // Falling stage logic
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
