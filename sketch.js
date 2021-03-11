// define constants and variables
const Engine = Matter.Engine;
const World= Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
var engine, world;
var circleImg, playerImg, spikeImg, teleportImg;
var player, playerBody;
var playerRotate = true;
var staticCount = 0;
var points = [];
var point1, point2, point3, point4, point5, point6, point7, point8;
var pointImg1, pointImg2, pointImg3, pointImg4, pointImg5, pointImg6, pointImg7, pointImg8
var score;
var touched = false;

function preload()
{
  // load images
  circleImg = loadImage("images/circle.png");
  playerImg = loadImage("images/player.png");
  spikeImg = loadImage("images/spike.png");
  teleportImg = loadImage("images/teleport.png");
}

function setup()
{
  //create canvas
  createCanvas(windowWidth, windowHeight);

  // create engine and put inside world
  engine = Engine.create();
  world = engine.world;

  // create player sprite
  player = createSprite(width/2, height/2, 10, 10);
  player.visible = false;
  player.addImage(playerImg);
  player.scale = 0.58
  player.setCollider("rectangle", 0, 0, 150, 150);

  //make new player body and rope
  playerBody = new PlayerBody(width/2, height/2, 20);
  Matter.Body.setStatic(playerBody.body, false);
  rope = new Rope(playerBody.body, {x: width/2, y: height/2});

  // generate the map around the player's centre
  generateMap(player.x, player.y);
  //player.debug = true;

}

function draw()
{
  // background colour
  background(50);

  //console.log(playerBody.body);

  Engine.update(engine);

  // player sprite's position is the body's position
  player.x = playerBody.body.position.x;
  player.y = playerBody.body.position.y;
  
  // camera follows player
  camera.position.x = player.x;
  camera.position.y = player.y;

  if(mousePressedOver(player) || playerRotate === false)
  {
    player.rotationSpeed = 0;
    playerRotate = false;
  }
  else
  {
    player.rotationSpeed = 5;
  }

  for(var i = 0; i<points.length; i++)
  {
    if(player.isTouching(points[i][0]))
    {
      playerRotate = true;
      if(staticCount===0)
      {
        Matter.Body.setStatic(playerBody.body, true);
        staticCount = 1;
      }
      if(staticCount===1)
      {
        Matter.Body.setStatic(playerBody.body, false);
      }
      if(points[i][1] === "circle")
      {
        //console.log("circle");
        whenCircle(points[i][0]);
      }
      else if(points[i][1] === "spike")
      {
        //console.log("spike");
        whenSpike();
      }
      else if(points[i][1] === "teleport")
      {
        //console.log("teleport");
        whenTeleport();
      }
    }
  }

  if(playerBody.body.position.x > points[2][0].x || playerBody.body.position.x < points[6][0].x
     || playerBody.body.position.y > points[4][0].y || playerBody.body.position.y <points[0][0].y)
  {
    score ++;
    if(playerBody.body.position.x > points[2][0].x)
    {
      generateMap(points[2][0].x + width/3, points[2][0].y);
    }
    if(playerBody.body.position.x < points[6][0].x)
    {
      generateMap(points[6][0].x - width/3, points[6][0].y);
    }
    if(playerBody.body.position.y > points[4][0].y)
    {
      generateMap(points[4][0].x, points[4][0].y + height/3);
    }
    if(playerBody.body.position.y < points[0][0].y)
    {
      generateMap(points[0][0].x, points[0][0].y-height/3);
    }
  }

  playerBody.display();
  rope.display();

  //console.log(points);

  drawSprites();
}
function mouseDragged()
{
  Matter.Body.setPosition(playerBody.body, {x: mouseX , y: mouseY});
}
function mouseReleased()
{
  // to release object
  rope.fly()
  //Matter.Body.applyForce(playerBody.body, {x:)
}
async function generateMap(centreX, centreY)
{
  for(var i = 0; i< points.length; i++)
  {
    points[i][0].destroy();
  }
  points = [];
  staticCount = 0;
  // North
  point1 = createSprite(centreX, centreY -  height/3, 20, 20);
  // NorthEast
  point2 = createSprite(centreX + width/3, centreY - height/3, 20, 20);
  // East
  point3 = createSprite(centreX + width/3, centreY, 20, 20);
  // SouthEast
  point4 = createSprite(centreX + width/3, centreY + height/3, 20, 20);
  // South
  point5 = createSprite(centreX, centreY + height/3, 20, 20);
  // SouthWest
  point6 = createSprite(centreX-width/3, centreY + height/3, 20, 20);
  // West
  point7 = createSprite(centreX-width/3, centreY, 20, 20);
  // NorthWest
  point8 = createSprite(centreX - width/3, centreY - height/3, 20, 20);
  // make array with all points
  points.push([point1], [point2], [point3], [point4], [point5], [point6], [point7], [point8]);
  // centre
  if(centreX !== player.x && centreY !== player.y)
  {
    point9 = createSprite(centreX, centreY, 10, 10);
    points.push([point9])
  }
  // for all points
  for(var i = 0; i< points.length; i++)
  {
    // make all sprites decidesprite 
    returnedVal = decideSprite(points[i][0]);
   if(returnedVal === "circle")
   {
    points[i].push("circle");
   }
   else if(returnedVal === "spike")
   {
    points[i].push("spike");
   }
   else if(returnedVal === "teleport")
   {
    points[i].push("teleport");
   }

   // make all sprites have rotation
   points[i][0].rotationSpeed = -5;
   points[i][0].debug = true;
  }
}

function decideSprite(point)
{
  rand = Math.round(random(1, 5));
  switch(rand)
  {
    case 1: point.addImage("circle", circleImg);
    point.scale = 0.05;
    return "circle"; break;

    case 2: point.addImage("circle", circleImg);
    point.scale = 0.05;
    return "circle"; break;

    case 3: point.addImage("spike", spikeImg);
    point.scale = 0.05; point.setCollider("circle", 0, 0, 400);
    return "spike"; break;

    case 4: point.addImage("spike", spikeImg);
    point.scale = 0.05; point.setCollider("circle", 0, 0, 400);
    return "spike"; break;
    
    case 5: point.addImage("teleport", teleportImg);
    point.scale = 0.05; point.setCollider("circle", 0, 0, 600);
    return "teleport"; break;
  }
}

async function whenCircle(point)
{
  //console.log(point);
  Matter.Body.setPosition(playerBody.body, {x: point.x, y: point.y});
  rope.attach(playerBody.body, {x: point.x, y: point.y})
}

function whenTeleport(point)
{
  /*rand = Math.round(random(1, 4));
  switch(rand)
  {
    case 1: Matter.Body.applyForce(playerBody.body, {x: })
  }*/
}

function whenSpike()
{
  
}
