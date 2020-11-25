// Snake Game source code
// made by Hudson Rodrigues

var canvas = document.getElementById("meuCanvas");
var cWidth = canvas.width;
var cHeight = canvas.height;
var keyPressed;
var c = canvas.getContext('2d');

var playerThickness = 20;

document.addEventListener("keydown", keyDownHandler, false);
var player;
var apple;

restartGame();
animate();



function restartGame() {
    keyPressed = undefined;
    c.clearRect(0, 0, cWidth, cHeight);
    c.fillStyle = "black";
    c.beginPath();
    c.fillRect(0, 0, cWidth, cHeight);
    c.closePath();
    player = null;
    aple = null;
    player = new Player((cWidth / 2) - cWidth % 20, (cHeight / 2) - cHeight % 20, playerThickness, playerThickness);
    player.draw();
    apple = new Apple();
    apple.spawn();
}

function animate() {

    setTimeout(function () { requestAnimationFrame(animate) }, 100);

    c.clearRect(0, 0, cWidth, cHeight);

    c.beginPath();
    c.fillStyle = "black";
    c.fillRect(0, 0, cWidth, cHeight);
    c.closePath();

    player.update();

    apple.draw();
}

function Player(x, y, width, height){
    this.width = width;
    this.height = height;
    this.velocity = {
        x: 0,
        y: 0
    }
    this.head = new Block(x, y, this.width - 1, this.height - 1, "white");
    this.body = [this.head];
    this.score = 1;
    this.newBlock = false;

    this.lastBlock = function () {
        return this.body[this.body.length - 1];
    }

    this.draw = function () {
        
        this.head.draw();
    }

    this.update = function () {

        this.newBlock = false;

        switch (keyPressed) {
            case "left":
                if (this.velocity.x != this.width) {
                    this.velocity.x = -this.width;
                    this.velocity.y = 0;
                }
                break;

            case "right":
                if (this.velocity.x != -this.width) {
                    this.velocity.x = this.width;
                    this.velocity.y = 0;
                }
                break;

            case "up":
                if (this.velocity.y != this.width) {
                    this.velocity.x = 0;
                    this.velocity.y = -this.height;
                }
                break;

            case "down":
                if (this.velocity.y != -this.width) {
                    this.velocity.x = 0;
                    this.velocity.y = this.height;
                }
                break;
        }

        this.head.trace.x = this.head.position.x;
        this.head.trace.y = this.head.position.y;

        this.head.position.x += this.velocity.x;
        this.head.position.y += this.velocity.y;


        if (player.head.position.x == apple.position.x && player.head.position.y == apple.position.y) {
            this.body.push(new Block(this.lastBlock().position.x, this.lastBlock().position.y, playerThickness-1, playerThickness-1, "white"));
            this.newBlock = true;
            this.score++;
            console.log(this.body.length);
            apple.spawn();
        }

        if (this.body.length > 1) {
            for (var i = 1; i < this.body.length; i++) {
                var currentBlock = this.body[i];
                var previousBlock = this.body[i - 1];

                currentBlock.trace.x = currentBlock.position.x;
                currentBlock.trace.y = currentBlock.position.y;

                currentBlock.position.x = previousBlock.trace.x;
                currentBlock.position.y = previousBlock.trace.y;

                if (this.head.position.x == currentBlock.position.x && this.head.position.y == currentBlock.position.y) {
                    restartGame();
                    return;
                }

                currentBlock.draw();
            }
        }

        if (player.head.position.x + player.width > cWidth || player.head.position.x < 0 || player.head.position.y + player.height > cHeight || player.head.position.y < 0) {
            restartGame();
            return;
        }

        this.draw();
    }
}

function keyDownHandler(e) {
    var key;
    switch (e.key) {
        case "Right":
            key = "right";
            break;
        case "ArrowRight":
            key = "right";
            break;
        case "Left":
            key = "left";
            break;
        case "ArrowLeft":
            key = "left";
            break;
        case "Up":
            key = "up";
            break;
        case "ArrowUp":
            key = "up";
            break;
        case "Down":
            key = "down";
            break;
        case "ArrowDown":
            key = "down";
            break;
    }
    keyPressed = key;
}

function Block(x, y, width, height, color) {
    this.position = {
        x: x,
        y: y
    };
    this.trace = {
        x: x,
        y: y
    };
    this.width = width;
    this.height = height;
    this.color = color;

    this.draw = function () {
        c.fillStyle = color;
        c.beginPath();
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
        c.closePath();
    }
}

function Apple() {
    this.position = {
        x:0,
        y:0
    }
    this.draw = function () {
        c.fillStyle = "red";
        c.beginPath();
        c.fillRect(this.position.x, this.position.y, playerThickness - 1, playerThickness - 1);
        c.closePath();
    }

    this.spawn = function () {

        var colliding = true;
        while (colliding) {
            this.position.x = randInt(0, cWidth - playerThickness);
            this.position.x -= this.position.x % playerThickness;

            this.position.y = randInt(0, cHeight - playerThickness);
            this.position.y -= this.position.y % playerThickness;

            for (var i = 0; i < player.body.length; i++) {
                colliding = this.position.x == player.body[i].position.x && this.position.y == player.body[i].position.y;
                if (colliding) {
                    break;
                }
            }
        }

        this.draw();
    }
    
}

function randInt(min, max) {
    var rmax = max + 1; 
    return Math.floor((Math.random() * (rmax - min)) + min);
}