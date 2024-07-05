const canvas = document.getElementById('mazeCanvas');
const pen = canvas.getContext('2d');

const width = canvas.width;
const height = canvas.height;
let cellSize = 40;

const playerRadius = cellSize / 2 - 5;
const endRadius = cellSize / 2 - 5;

let trail = [];
let generatedMaze;
let solutionPath;

let points = 0;
const cols = Math.floor(width / cellSize);
const rows = Math.floor(height / cellSize);
const player1 = { 
    x: 0, 
    y: 0, 
    color: 'red', 
};

const end = { 
    x: cols - 1, 
    y: rows - 1, 
    color: 'blue', 
};

document.querySelector('.startbtn').addEventListener('click', function () { 
    resetPlayerPos();
    clearScreen(); 
    setup(); 
    draw(); 
    addListener(); 
    displayHidden(); 
});

document.addEventListener('DOMContentLoaded', function () { 
    const startButton = document.querySelector('.startbtn');
    function stopBlinking() { 
        startButton.classList.remove("blink"); 
    }
    startButton.classList.add("blink");
    startButton.addEventListener("click", stopBlinking); 
});

function addListener() { 
    document.addEventListener('keydown', handleKeyPress);
    addTouchListeners();
}

document.getElementById('btnUp').addEventListener('click', function () { 
    movePlayer('ArrowUp', player1);
    draw();
});

document.getElementById('btnDown').addEventListener('click', function () { 
    movePlayer('ArrowDown', player1);
    draw();
});

document.getElementById('btnLeft').addEventListener('click', function () { 
    movePlayer('ArrowLeft', player1);
    draw();
});

document.getElementById('btnRight').addEventListener('click', function () { 
    movePlayer('ArrowRight', player1);
    draw();
});

function handleKeyPress(event) { 
    const key = event.key;
    movePlayer(key, player1);
    draw();
}

function addTouchListeners() {
    let touchstartX = 0;
    let touchstartY = 0;
    let touchendX = 0;
    let touchendY = 0;

    const threshold = 50; // Minimum distance for a swipe to be considered

    canvas.addEventListener('touchstart', function(event) {
        touchstartX = event.changedTouches[0].screenX;
        touchstartY = event.changedTouches[0].screenY;
    }, false);

    canvas.addEventListener('touchend', function(event) {
        touchendX = event.changedTouches[0].screenX;
        touchendY = event.changedTouches[0].screenY;
        handleSwipe();
    }, false);

    function handleSwipe() {
        const diffX = touchendX - touchstartX;
        const diffY = touchendY - touchstartY;

        if (Math.abs(diffX) > Math.abs(diffY)) {
            if (Math.abs(diffX) > threshold) {
                if (diffX > 0) {
                    movePlayer('ArrowRight', player1);
                } else {
                    movePlayer('ArrowLeft', player1);
                }
            }
        } else {
            if (Math.abs(diffY) > threshold) {
                if (diffY > 0) {
                    movePlayer('ArrowDown', player1);
                } else {
                    movePlayer('ArrowUp', player1);
                }
            }
        }
        draw();
    }
}

function showRestartMessage() { 
    const messageBox = document.getElementsByClassName('msgbox')[0];
    messageBox.innerHTML = "Invalid Move. Press restart.";
    messageBox.innerHTML += `<br><button class='restartbtn' style='margin-top:70px;' onclick='resetState()'>Restart</button>`;
    messageBox.style.visibility = "visible";
    messageBox.style.fontSize = "1.7em"
    messageBox.style.color = "white"
    messageBox.style.fontFamily = `'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif`
}

function resetState() { 
    const messageBox = document.getElementsByClassName('msgbox')[0];
    messageBox.style.visibility = "hidden";
}

function movePlayer(key, player) { 
    let validMove = false;

    switch (key) { 
        case 'ArrowUp':
            if (player.y > 0 && cells[player.x][player.y].walls.top === false) { 
                player.y--; 
                points++;
                validMove = true;
            }
            break;
        case 'ArrowDown':
            if (player.y < rows - 1 && cells[player.x][player.y].walls.bottom === false) { 
                player.y++; 
                points++;
                validMove = true;
            }
            break;
        case 'ArrowLeft':
            if (player.x > 0 && cells[player.x][player.y].walls.left === false) { 
                player.x--;
                points++;
                validMove = true;
            }
            break;
        case 'ArrowRight':
            if (player.x < cols - 1 && cells[player.x][player.y].walls.right === false) { 
                player.x++;
                points++;
                validMove = true;
            }
            break;
    }
    if (!validMove) { 
        return;
    }

    const isTwice = trail.some(cell => cell.x === player.x && cell.y === player.y);
    if (isTwice) { 
        showRestartMessage();
        resetPlayerPos();
    }

    if (player.x == cols - 1 && player.y == rows - 1) { 
        document.removeEventListener('keydown', handleKeyPress);
        const messageBox = document.getElementsByClassName('msgbox')[0];

        messageBox.innerHTML = "<h1>You Won!</h1>"
        messageBox.innerHTML += "<h2 id='moves'>Moves</h2>"
        messageBox.innerHTML += `<button id='done' onclick='location.reload()'>Play Again</button>`
        document.getElementById('moves').innerHTML = "Moves:" + points;
        messageBox.style.fontSize = "1em"
        messageBox.style.color = "black"
        messageBox.style.fontFamily = `'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif`
        messageBox.style.visibility = "visible";
    }
}

function clearScreen() { 
    pen.canvas.width = pen.canvas.width;
}

function displayHidden() { 
    document.getElementsByClassName('msgbox')[0].style.visibility = "hidden";
}

const cells = [];

for (let x = 0; x < rows; x++) { 
    cells[x] = [];
    for (let y = 0; y < cols; y++) { 
        cells[x][y] = null;
    }
}

class CellA { 
    constructor(x, y) { 
        this.x = x;
        this.y = y;
        this.visited = false;
        this.walls = { 
            top: true, 
            right: true, 
            bottom: true, 
            left: true, 
        };
    }

    show() { 
        const x = this.x * cellSize;
        const y = this.y * cellSize;

        pen.beginPath();

        if (this.walls.top) { 
            pen.moveTo(x, y);
            pen.lineTo(x + cellSize, y);
        }

        if (this.walls.right) { 
            pen.moveTo(x + cellSize, y);
            pen.lineTo(x + cellSize, y + cellSize);
        }

        if (this.walls.bottom) { 
            pen.moveTo(x + cellSize, y + cellSize);
            pen.lineTo(x, y + cellSize);
        }

        if (this.walls.left) { 
            pen.moveTo(x, y + cellSize);
            pen.lineTo(x, y);
        }
        pen.strokeStyle = 'green';
        pen.lineWidth = 5;
        pen.lineCap = "round";
        pen.stroke();
    }
}

function setup() { 
    // Initialize the cells
    for (let x = 0; x < rows; x++) { 
        for (let y = 0; y < cols; y++) { 
            cells[x][y] = new CellA(x, y);
        }
    }
    genMaze(0, 0);
}

function genMaze(x, y) { 
    const presentCell = cells[x][y];
    presentCell.visited = true;

    const directions = randomize(['top', 'right', 'bottom', 'left']);

    for (const direction of directions) { 
        const dx = { top: 0, right: 1, bottom: 0, left: -1 }[direction];
        const dy = { top: -1, right: 0, bottom: 1, left: 0 }[direction];

        const newX = x + dx;
        const newY = y + dy;

        if (newX >= 0 && newX < cols && newY >= 0 && newY < rows && !cells[newX][newY].visited) { 
            presentCell.walls[direction] = false;
            cells[newX][newY].walls[{ top: 'bottom', right: 'left', bottom: 'top', left: 'right' }[direction]] = false;
            genMaze(newX, newY);
        }
    }
}

function randomize(arr) { 
    const array = [...arr];
    for (let i = array.length - 1; i > 0; i--) { 
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function draw() { 
    clearScreen();

    for (let x = 0; x < rows; x++) { 
        for (let y = 0; y < cols; y++) { 
            cells[x][y].show();
        }
    }

    drawCircle(end.x * cellSize + cellSize / 2, end.y * cellSize + cellSize / 2, end.color);
    drawCircle(player1.x * cellSize + cellSize / 2, player1.y * cellSize + cellSize / 2, player1.color);

    trail.push({ x: player1.x, y: player1.y });
}

function drawCircle(x, y, color) { 
    pen.beginPath();
    pen.arc(x, y, playerRadius, 0, Math.PI * 2);
    pen.fillStyle = color;
    pen.fill();
    pen.closePath();
}

function resetPlayerPos() { 
    player1.x = 0;
    player1.y = 0;
    trail = [];
    points = 0;
}
