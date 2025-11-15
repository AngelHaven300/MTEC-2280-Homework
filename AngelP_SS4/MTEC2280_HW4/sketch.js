/*
P5.JS SERIAL READ STRING

An example p5.js sketch that uses the p5.serialport library to read comma-separated string values from the serial port.
The size and fill color of a circle changes according to the received values, which are also displayed on the canvas.

This code is designed to work with the "Arduino_Serial_Multi_String" example sketch.

NOTES:
- You must run and establish a serial connection with p5.serialcontrol app to use this code:
  https://github.com/p5-serial/p5.serialcontrol/releases/tag/0.1.2

- Remember to add the p5.serialport library to your index.html file. Add this line below <script src="libraries/p5.min.js"></script>:

    <script language="javascript" type="text/javascript" src="https://cdn.jsdelivr.net/npm/p5.serialserver@0.0.28/lib/p5.serialport.js"></script>

- Make sure the baud rate in options matches the baud rate in your Arduino code.
- Remember to change the portName variable to match your own serial port.
*/

let serial; // declare variable for an instance of the serialport library
let portName = 'COM6';  // fill in your serial port name here
let options = { baudRate: 9600}; // change the baud rate to match your Arduino code

let inData = 0; // variable for storing incoming serial data
let sensors = [0, 0, 0, 0]; // array to hold sensor values: [button1, button2, pot1, pot2]

let r, g, b; // variables for background color
let lengthR = 100; // initial diameter of circle
let widthR = 100;
let grow = 5; // amount to grow or shrink circle diameter
let rotateR;
let rectOneOn = true;
let rectTwoOn = true;
let rectThreeOn = true;
let rectFourOn = true;

 
function setup() //setup function runs once at beginning
{
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

  //TYPICAL P5.JS SETUP
  createCanvas(800, 800); //set size of canvas
  textSize(30); // set text size
  textAlign(CENTER, CENTER);  // set text alignment
  strokeWeight(5); // set stroke weight
  stroke(255 * !sensors[0]); // set stroke color
  rectMode(CENTER);
}

function draw() //  draw function loops forever at frame rate
{
  r = map(sensors[2], 0, 1023, 0, 255); //map pot 1 to red value
  g = map(sensors[3], 0, 1023, 0, 255); //map pot 2 to green value
  b = sensors[0] * 255; // map button 1 to blue value (0 or 255)
  rotateR = map(sensors[3], 0, 1023, 0.00, 0.5);

  background(r , g, b);  // fill frame w/ background color, also using button 2 to turn off green component.

  //fill(255 * !sensors[1]); // set fill color to black if button 2 is pressed, otherwise white

  if (sensors[0]) // if button 1 is pressed...
  {
    lengthR += grow; // increase diameter by grow amount
    widthR += grow;
    rectTwoOn = false;
    rectThreeOn = false;
  } else {
    rectTwoOn = true;
    rectThreeOn = true;
  }

  if (sensors[1]) // if button 2 is pressed...
  {
    lengthR -= grow; // decrease diameter by grow amount
    widthR -= grow;
    rectOneOn = false;
    rectFourOn = false; 
  } else {
    rectOneOn = true;
    rectFourOn = true;
  }

  if (rectOneOn) {
    rectOne();
  }

  if (rectTwoOn) {
    rectTwo();
  }

  if (rectThreeOn) {
    rectThree();
  }

  if (rectFourOn) {
    rectFour();
  } 
  
  lengthR = constrain(lengthR, 50, width - 400); // constrain diameter size
  widthR = constrain(widthR, 50, width - 400);
  //circle(width/2, height/2, diameter);  // draw circle in center of canvas with diameter
  
  stroke(0);
  fill(255); // set fill color for text
  text(sensors, width/2, height - 100); // display incoming serial data as text
}

function rectOne() {
  push();
  translate(200, 200);
  rotate(frameCount * rotateR);
  fill(random(55), g, 175 * !sensors[0]);
  rect(0,0, widthR, lengthR);
  pop();
}


function rectTwo() {
  push();
  translate(600, 200);
  rotate(frameCount * rotateR);
  fill(r, 150 * !sensors[1], random(175));
  rect(0,0, widthR, lengthR);
  pop();
}

function rectThree() {
  push();
  translate(200, 600);
  rotate(frameCount * rotateR);
  fill(r, 150 * !sensors[1], random(175));
  rect(0,0, widthR, lengthR);
  pop();
}

function rectFour() {
  push();
  translate(600, 600);
  rotate(frameCount * rotateR);
  fill(random(55), g, 175 * !sensors[0]);
  rect(0,0, widthR, lengthR);
  pop();
}

function printList(portList) // gets called when the serial.list() function is called
{
  print("List of Available Serial Ports: ");
  for (var i = 0; i < portList.length; i++) 
  {
    print(i + portList[i]); //print list of available serial ports to console
  }
}

function serverConnected() //gets called when we connect to the serial server
{
  print("CONNECTED TO SERVER");
}
 
function portOpen() //gets called when the serial port opens
{
  print("SERIAL PORT OPEN");
}
 
function serialEvent() //gets called when new data arrives
{
  let inString = serial.readStringUntil('\n'); // read until newline character
  if (inString.length > 0) //if there's data in the string
  {
    sensors = split(inString, ','); // split the string at commas and store in array
    
    for (let i = 0; i < sensors.length; i++) 
    {
      // Number() function converts string to number
      sensors[i] = Number(sensors[i]); // convert every element in array to numbers

      // You can also use parseInt() function, which takes a second argument for the base (radix).
      // A base of 10 is for decimal numbers, base of 16 is for hexadecimal, base of 2 is for binary.
      // sensors[i] = parseInt(sensors[i], 10); // converts every element in array to decimal number
    }
    print(sensors);
  } 
}
 
function serialError(err) //gets called when there's an error
{
  print('ERROR: ' + err);
}
 
function portClose() //gets called when the serial port closes
{
  print("*____SERIAL PORT CLOSED");
}