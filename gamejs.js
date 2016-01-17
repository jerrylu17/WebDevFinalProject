(function () {
    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    window.requestAnimationFrame = requestAnimationFrame;
})();

var canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d"),
    cx1 = 0;
    cx2 = 500;
    cy1 = 0;
    cy2 = 200;
    player = {
        x: 3,
        y: cy2 - 7,
        width: 12,
        height: 16,
        speed: 3,
        velX: 0,
        velY: 0,
        jumping: 0,
        grounded: 0
    },
    keys = [],
    friction = 0.8,
    direction = 1,
    gravity = 0.3;

var boxes = [];

// dimensions
boxes.push({
    x: 0,
    y: 0,
    width: 2,
    height: cy2
});
boxes.push({
    x: 0,
    y: cy2 - 2,
    width: cx2,
    height: 50
});
boxes.push({
    x: cx2 - 2,
    y: 0,
    width: 2,
    height: cy2
});
boxes.push({
    x: 0,
    y: 0,
    width: cx2,
    height: 2
});

boxes.push({
    x: 120,
    y: 20,
    width: 80,
    height: 80
});
boxes.push({
    x: 170,
    y: 50,
    width: 80,
    height: 80
});
boxes.push({
    x: 220,
    y: 100,
    width: 80,
    height: 80
});
boxes.push({
    x: 270,
    y: 150,
    width: 40,
    height: 20
});
var image = new Image();
image.src = "spriteright.png";


canvas.width = cx2;
canvas.height = cy2;

function update() {
    // check keys
    if (keys[38] || keys[32] || keys[87]) {
        // up arrow or space
        if (!player.jumping && player.grounded) {
            player.jumping = true;
            player.grounded = false;
            player.velY = -player.speed * 2;
        }
    }
    if (keys[39] || keys[68]) {
        // right arrow
        if (player.velX < player.speed) {
            player.velX++;
        }
        direction = 1;
    }
    if (keys[37] || keys[65]) {
        // left arrow
        if (player.velX > -player.speed) {
            player.velX--;
        }
        direction = 0;
    }

    player.velX *= friction;
    player.velY += gravity;

    ctx.clearRect(0, 0, cx2, cy2);
    ctx.fillStyle = "black";
    ctx.beginPath();

    //var image = new Image();
    //image.src = "img/mariosprite.png";
    //image.onload = function(){
    //  ctx.drawImage(image, 0, 0);
    //  window.alert("img is in");
    //}
    
    player.grounded = false;
    for (var i = 0; i < boxes.length; i++) {
        ctx.rect(boxes[i].x, boxes[i].y, boxes[i].width, boxes[i].height);
        
        var dir = colCheck(player, boxes[i]);

        if (dir === "l" || dir === "r") {
            player.velX = 0;
            player.jumping = false;
        } else if (dir === "b") {
            player.grounded = true;
            player.jumping = false;
        } else if (dir === "t") {
            player.velY *= -1;
        }

    }
    
    if(player.grounded){
         player.velY = 0;
    }
    
    player.x += player.velX;
    player.y += player.velY;

    ctx.fill();
  //  ctx.fillStyle = "red";
//    ctx.fillRect(player.x, player.y, player.width, player.height);
    if (direction === 1)
        image.src = "spriteright.png";
    else if (direction === 0)
        image.src = "spriteleft.png";
    
    ctx.drawImage(image,player.x,player.y);
    
    requestAnimationFrame(update);
}



function colCheck(shapeA, shapeB) {
    // get the vectors to check against
    var vX = (shapeA.x + (shapeA.width / 2)) - (shapeB.x + (shapeB.width / 2)),
        vY = (shapeA.y + (shapeA.height / 2)) - (shapeB.y + (shapeB.height / 2)),
        // add the half widths and half heights of the objects
        hWidths = (shapeA.width / 2) + (shapeB.width / 2),
        hHeights = (shapeA.height / 2) + (shapeB.height / 2),
        colDir = null;

    // if the x and y vector are less than the half width or half height, they we must be inside the object, causing a collision
    if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {
        // figures out on which side we are colliding (top, bottom, left, or right)
        var oX = hWidths - Math.abs(vX),
            oY = hHeights - Math.abs(vY);
        if (oX >= oY) {
            if (vY > 0) {
                colDir = "t";
                shapeA.y += oY;
            } else {
                colDir = "b";
                shapeA.y -= oY;
            }
        } else {
            if (vX > 0) {
                colDir = "l";
                shapeA.x += oX;
            } else {
                colDir = "r";
                shapeA.x -= oX;
            }
        }
    }
    return colDir;
}

document.body.addEventListener("keydown", function (e) {
    keys[e.keyCode] = true;
});

document.body.addEventListener("keyup", function (e) {
    keys[e.keyCode] = false;
});


window.addEventListener("load", function () {
    update();
});