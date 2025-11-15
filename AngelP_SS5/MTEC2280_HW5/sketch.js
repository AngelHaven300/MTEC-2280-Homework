let serial;                                 // variable for instance of the serialport library
let portName = 'COM6'; // fill in your serial port name
let options = { baudRate: 9600};            // change the baud rate to match your Arduino code
let outByte = 0; // 8-bit data to send to microcontroller

let num;
let assignedNum; 
let score = 0;
let lives = 5;
function setup() 
{
  createCanvas(600, 600);
  strokeWeight(2);
  num = floor(random(1, 4));
  //P5 SerialPort Setup
  serial = new p5.SerialPort();             // make a new instance of the serialport library
  serial.on('list', printList);             // set a callback function for the serialport list event
  serial.on('connected', serverConnected);  // set callback for connecting to the server
  serial.on('open', portOpen);              // set callback for the port opening
  serial.on('data', serialEvent);           // set callback for when new data received
  serial.on('error', serialError);          // set callback for errors
  serial.on('close', portClose);            // set callback for closing the port
  serial.list();                            // list the serial ports
  serial.open(portName, options);           // open a serial port
}

function draw() 
{
  background(0, 16);
  textSize(32);
  fill(255);
  text("Score: " + score, 10, 30);
  textSize(64);
  fill(255);
  text("Press " + num, 190, 150);
  textSize(32);
  fill(255);
  text("Lives: " + lives, 10, 70); 
  if(keyIsDown(49)) 
  {
    fill(120, 200, 200);      
    rect(0, 200, width/2, 200);
  }
  else if(keyIsDown(50)) 
  {
    fill(200, 120, 200);
    rect(300, 200, 300, 200);
  }
  else if(keyIsDown(51))  
  {
    fill(200, 200, 120);
    rect(0, 400, width/2, 200);
  }
  else if(keyIsDown(52)) 
  {
    fill(120, 120, 200);
    rect(300, 400, 300, 200);
  }
 
}

function keyPressed() 
{
  print(key); 
  serial.write(key); 
  if (key == '1') {
    assignedNum = 1;
  } if (key == '2') {
    assignedNum = 2;
  } if (key == '3') {
    assignedNum = 3;
  } if (key == '4') {
    assignedNum = 4;
  } if (num == assignedNum) {
    score++;
  } else {
    score--;
    lives--;
  }
  num = floor(random(1, 4));
  if (score < 0) {
    score = 0;
  }
  if (lives <= 0) {
    score = 0;
    lives = 5;
  }
}

function portOpen() //gets called when the serial port opens
{
  print("SERIAL PORT OPEN");
}

function portClose() //gets called when the serial port closes
{
  print("SERIAL PORT CLOSED");
}

function printList(portList) // gets called when the serial.list() function is called
{
  print("List of Available Serial Ports: ");
  for (var i = 0; i < portList.length; i++) 
  {
    print(i + portList[i]); //print list of available serial ports to console
  }
}

function serialEvent() // gets called when new serial data arrives
{
  //only sending data to microcontroller in this sketch, so not being used
}

function serialError(err) //gets called when there's an error
{
  print('ERROR: ' + err);
}

function serverConnected() //gets called when we connect to the serial server
{
  print("CONNECTED TO SERVER");
}