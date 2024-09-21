//game constants const

let inputDir = {x:0 , y:0};
const foodSound = new Audio("music/eating-sound.mp3");
const gameOverSound = new Audio("music/game-over.mp3");
const moveSound = new Audio("music/move.mp3");
const musicSound = new Audio("music/game-music.mp3");
let speed = 3;
let lastPaintTime = 0;
let score = 0;
let snakearr = [
    {x: 13 , y: 15}
]
food ={x:6 , y:7};
let isMusicOn = true; // Track if the music is on or off

// Load and loop music
musicSound.loop = true; // Loop the music
musicSound.load(); // Preload audio
if (isMusicOn) {
    musicSound.play(); // Start playing if it's on
}

let gamePaused = true; // Track the game's paused state

// Start Game Button
document.getElementById("startGame").addEventListener("click", () => {
    if (gamePaused) {
        musicSound.play(); // Play music if not already playing
        gamePaused = false;
        document.getElementById("pauseGame").style.display = "inline-block"; // Show pause button
        document.getElementById("startGame").style.display = "none"; // Hide start button
        window.requestAnimationFrame(main); // Start the game loop
    }
});

// Pause Game Button
document.getElementById("pauseGame").addEventListener("click", () => {
    if (!gamePaused) {
        musicSound.pause(); // Pause the music
        gamePaused = true;
        document.getElementById("pauseGame").style.display = "none"; // Hide pause button
        document.getElementById("startGame").style.display = "inline-block"; // Show start button
    }
});

//Game function
function main(ctime)
{
    if (gamePaused) return; // If the game is paused, exit the function
    window.requestAnimationFrame(main);
    //console.log(ctime);
    if((ctime - lastPaintTime) / 1000 < 1/speed)
    {
        return;
    }
    lastPaintTime = ctime;
    gameEngine();
}

function isCollide(snake)
{
    //If you bump into yourself
    for(let i = 1 ; i < snakearr.length ; i++)
    {
        if(snake[i].x === snake[0].x && snake[i].y === snake[0].y)
        {
            return true;
        }
    }
    //If you bump into wall
    if(snake[0].x >= 18 || snake[0].x <=0 || snake[0].y >= 18 || snake[0].y <=0)
    {
        return true;
    }
   return false; // No collision detected
}

function gameEngine()
{
    //Part 1: Updating the snake array and food
    if(isCollide(snakearr))
    {
        gameOverSound.play();
        musicSound.pause();
        inputDir = {x:0 , y:0};
        alert("Game Over. Press any key to play again!");
        snakearr = [{x:13 , y:15}];//reset game
        musicSound.play();
        score = 0;
    }

    //If u have eaten the food, increment the score and regenerate the food
    if(snakearr[0].y === food.y  && snakearr[0].x === food.x)
    {
        foodSound.play();
        score += 1 ;
        if(score > highScoreVal)
        {
            highScoreVal = score;
            localStorage.setItem("highScore" ,JSON.stringify( highScoreVal));
            highScoreBox.innerHTML = "High Score: " + highScoreVal;
        }
        scoreBox.innerHTML = "Score: " + score;
        snakearr.unshift({x: snakearr[0].x + inputDir.x , y:snakearr[0].y + inputDir.y})
        let a = 2;
        let b = 16;
        food = {x: Math.round(a + (b - a) * Math.random()) , y: Math.round(a + (b - a) * Math.random())};
    }

    //Moving the snake
    for(let i = snakearr.length - 2 ; i >= 0 ; i--)
    {
         snakearr[i + 1] = {...snakearr[i]};  
    }
    snakearr[0].x += inputDir.x;
    snakearr[0].y += inputDir.y;

    //Part 2: Display the snake and food
    //Display the snake
    board.innerHTML = ""; // Clear the board
    snakearr.forEach((e , index)=>{
    snakeElement = document.createElement('div');
    snakeElement.style.gridRowStart = e.y;
    snakeElement.style.gridColumnStart = e.x;
    if(index === 0)
    {
        snakeElement.classList.add('head');

        // Create the left eye
        const leftEye = document.createElement('div');
        leftEye.classList.add('eye', 'left');
        const leftPupil = document.createElement('div');
        leftPupil.classList.add('pupil');
        leftEye.appendChild(leftPupil);

        // Create the right eye
        const rightEye = document.createElement('div');
        rightEye.classList.add('eye', 'right');
        const rightPupil = document.createElement('div');
        rightPupil.classList.add('pupil');
        rightEye.appendChild(rightPupil);

        // Add the eyes to the snake's head
        snakeElement.appendChild(leftEye);
        snakeElement.appendChild(rightEye);

        // Add tongue to the snake's head
        const tongue = document.createElement('div');
        tongue.classList.add('tongue');
        snakeElement.appendChild(tongue);
    }
    else
    {
        snakeElement.classList.add('snake');
    }
    board.appendChild(snakeElement);
    });

    //Display the food
    foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food');
    board.appendChild(foodElement)
}

const musicToggle = document.getElementById('musicToggle');
musicToggle.addEventListener('click', () => {
    if (isMusicOn) {
        musicSound.pause(); // Pause the music
        musicToggle.innerHTML = "Turn Music On"; // Update button text
    } else {
        musicSound.play(); // Play the music
        musicToggle.innerHTML = "Turn Music Off"; // Update button text
    }
    isMusicOn = !isMusicOn; // Toggle music state
});

//main logic
let highScore = localStorage.getItem("highScore");
let highScoreVal = 0;
if(highScore === null || isNaN(Number(highScore)))
{
    highScoreVal = 0;
    localStorage.setItem("highScore" ,JSON.stringify( highScoreVal));
}
else
{
    highScoreVal = JSON.parse(highScore);
    highScoreBox.innerHTML = "High Score: " + highScore;
}
window.requestAnimationFrame(main);

// Control buttons for mobile
document.getElementById("up").addEventListener("click", () => {
    inputDir = { x: 0, y: -1 }; // Move up
    moveSound.play();
});

document.getElementById("down").addEventListener("click", () => {
    inputDir = { x: 0, y: 1 }; // Move down
    moveSound.play();
});

document.getElementById("left").addEventListener("click", () => {
    inputDir = { x: -1, y: 0 }; // Move left
    moveSound.play();
});

document.getElementById("right").addEventListener("click", () => {
    inputDir = { x: 1, y: 0 }; // Move right
    moveSound.play();
});


window.addEventListener('keydown' , e => {
    // Play music only if it's on and the game is starting
    if (!gamePaused && isMusicOn && musicSound.paused) {
        musicSound.play();
    }
    inputDir = {x:0 , y:1}  // Start the game
    moveSound.play();
    switch(e.key)
    {
        case "ArrowUp":
            console.log("ArrowUp");
            inputDir.x =  0;
            inputDir.y =  -1;
            break;
        case "ArrowDown":
            console.log("ArrowDown");
            inputDir.x =  0;
            inputDir.y =  1;
            break; 
        case "ArrowLeft":
            console.log("ArrowLeft");
            inputDir.x =  -1;
            inputDir.y =  0;
            break;     
        case "ArrowRight":
            console.log("ArrowRight");
            inputDir.x =  1;
            inputDir.y =  0;
            break; 
        default:
            break;         
    }
});
