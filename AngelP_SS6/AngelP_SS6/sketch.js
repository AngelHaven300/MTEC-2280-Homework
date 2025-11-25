let serial; // variable for instance of the serialport library
let portName = 'COM6'; // fill in your serial port name
let options = { baudRate: 9600}; // change the baud rate to match your Arduino code

let rxFlag = false; // flag to indicate when new data has been received
let firstContact = false; // flag to indicate when the first contact has been made with the serial port
let sensors = [0, 0, 0, 0]; // declare array to hold incoming sensor data, and initialize with zeros
let pot1 = 0; // variable to hold potentiometer value
let pot2 = 0; // variable to hold potentiometer value
let button1 = 0; // variable to hold button value
let button2 = 0; // variable to hold button value
let colrVar = 50;
let colrInc = 5;
let rectShape = false;
let rectShape2 = false;
let circleShape = true;
let circleShape2 = true;
let particle = 1;
let freeze = 5;


function setup() 
{
  //P5 Sketch Setup
  createCanvas(800, 800);
  textAlign(CENTER, CENTER);
  textSize(24);
  strokeWeight(4);
  stroke(127);
  rectMode(CENTER);

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
  background(0, freeze);
  stroke(127);

  if (!firstContact)  //if we have not yet received any data...
  {
  // display "Waiting" page
    background(0, freeze);
    fill(255);
    stroke(0);
    strokeWeight(2);
    text("Click Circle to Begin", width/2, height/4);
    fill(200, 0, 0);
    circle(width/2, height/2, 140);
    fill(255);
    text("PRESS ME", width/2, height/2);
  }
  else  //if we have established contact with the serial port, show main sketch...
  {
    freeze = 14;
    //potentiometer Circle
    for ( i = 0; i < particle; i++){
      colormap1 = map(pot1, 0, 400, 5, 255);  
      fill(colormap1, colrVar+5, colrVar+colormap1);
      if (circleShape) {
        circleDefault1();
      } else if (rectShape) {
        rectDefault1();
      }
    }
    fill(255);
    stroke(0);
    strokeWeight(2);
    text("Click to Change", width/4, height/2);
    //potentiometer Circle 2
    for ( j = 0; j < particle; j++){
      colormap2 = map(pot2, 0, 400, 5, 255);
      fill(colrVar+colormap2, colormap2, colrVar+10);
      if (circleShape2) {
        circleDefault2();
      } else if (rectShape2) {
        rectDefault2();
      }
    }
    fill(255);
    stroke(0);
    strokeWeight(2);
    text("Click to Change", 3*width/4, height/2);
  
    //button indicators
    if (button1) {
      colrVar += colrInc;
      if (colrVar >= 200){
        colrVar = 50;
      }
    }
    if (button2) {
      colrVar -= colrInc;
      if (colrVar <= 50){
        colrVar = 200;
      }
    }
    colrVar = constrain(colrVar, 5, 200);
    
    //pause button
    fill(115, 180, 220);
    circle(width/2, height/2, 100);

    if (rxFlag) // if rxFlag is true, we are receiving data, so...
    {
      fill(0);
      noStroke();
      text("FREEZE", width/2, height/2);  // display "PAUSE RX" on the button
    }
    else  //if rxFlag is false, we are not receiving data, so...
    {
      fill(255, 0, 0 );
      noStroke();
      text("FROZEN", width/2, height/2);  //display "PAUSED" on the button
      freeze = 0;
      pot1 = 0;
      pot2 = 0;
    }
  }
 
}

function circleDefault2(){
  circle (3*width/4 + random(pot2, -pot2), height/2 + random(pot2, -pot2), random(150));
}

function circleDefault1(){
  circle (width/4 + random(pot1, -pot1), height/2 + random(pot1, -pot1), random(150));
}

function rectDefault1(){
  rect(width/4 + random(pot1, -pot1), height/2 + random(pot1, -pot1), random(150), random(150));
}

function rectDefault2(){
  rect(width/4*3 + random(pot2, -pot2), height/2 + random(pot2, -pot2), random(150), random(150));
}


function mousePressed() //if mouse is pressed...
{
  if (dist(mouseX, mouseY, width/2, height/2) < 50) // if mouse postion is within the radius of the circle button...
  {
    rxFlag = !rxFlag; // toggle the rxFlag

    if (rxFlag) //if rxFlag is true, we want to receive data, so...
    {
      serial.write('A'); // send 'A' to the serial port to indicate that we want to receive data
    }
    else  //if rxFlag is false, we want to pause receiving data, so...
    {
      serial.write('B'); // send 'B' to the serial port to indicate that we want to pause receiving data
    }
  }
  if (dist(mouseX, mouseY, width/4, height/2) < 70) {
    circleShape = !circleShape; 
    rectShape = !rectShape; 
  }
  if (dist(mouseX, mouseY, 3*width/4, height/2) < 70) {
    circleShape2 = !circleShape2;
    rectShape2 = !rectShape2; 
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
  if (!firstContact)  //if we have not yet received any data, this is our first contact with the serial port, so...
  {
    print("FIRST CONTACT"); //print "FIRST CONTACT" to the console
    firstContact = true;  //set firstContact flag to true
  }
  
  if(rxFlag)  //if rxFlag is true, we want to receive data, so...
  {
    let inString = serial.readStringUntil('\n'); // read the incoming string until you get a newline character
    if (inString.length > 0) 
    {
      print("Rx String: " + inString); // print the incoming string to the console
      sensors = split(inString, ','); // split the string into an array of sensor values
    
      if(sensors.length >= 4) // check if we have all 4 sensor values before trying to access them
      {
        print(sensors); // print the array of sensor values to the console

        button1 = Number(sensors[0]); // convert the first sensor value to an integer
        button1 = map(button1, 0, 1, 0, 255); // map the button value from boolean true/false to 0-255

        button2 = Number(sensors[1]); // convert the second sensor value to an integer
        button2 = map(button2, 0, 1, 0, 255); // map the button value from boolean true/false to 0-255
        
        pot1 = Number(sensors[2]); // convert the third sensor value to an integer
        pot1 = map(pot1, 0, 1023, 0, 400); // map the potentiometer value from 0-1023 to 0-255
        pot1 = floor(pot1); // round the potentiometer value to an integer

        pot2 = Number(sensors[3]); // convert the fourth sensor value to an integer
        pot2 = map(pot2, 0, 1023, 0, 400); // map the potentiometer value from 0-1023 to 0-255
        pot2 = floor(pot2); // round the potentiometer value to an integer
        
        print("Button 1: " + button1 + " Button 2: " + button2 + " Pot 1: " + pot1 + " Pot 2: " + pot2);  //print mapped sensor values to the console

        //now that we're done processing the incoming data, we can "call out" to our microcontroller, which respond with latest sensor data.
        serial.write('A');  // send 'A' to the serial port to indicate that we want the latest sensor data
      }
    }
  }
  else
  {
    let inString = serial.readStringUntil('\n'); // read the incoming string until you get a newline character
    print(inString); // print the incoming string to the console
  }
}

function serialError(err) //gets called when there's an error
{
  print('SERIAL ERROR: ' + err);
}

function serverConnected() //gets called when we connect to the serial server
{
  print("CONNECTED TO SERIAL SERVER");
}
