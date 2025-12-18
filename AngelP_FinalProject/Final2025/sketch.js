let serial; // variable for instance of the serialport library
let portName = 'COM6'; // fill in your serial port name
let options = { baudRate: 9600}; // change the baud rate to match your Arduino code

let inString = ""; // variable to hold incoming serial data
let arduinoCom = ""; // variable to hold the name of the Arduino serial port
let myFont;

let rxFlag = false; // flag to indicate when new data has been received
let firstContact = false; // flag to indicate when the first contact has been made with the serial port
let sensors = [0, 0, 0]; // declare array to hold incoming sensor data, and initialize with zeros
let diffPot = 0; // variable to hold difficulty potentiometer value
let cashPot = 100; // pot to select cash amount to gamble
let button1 = 0; // variable to hold button value
let totalCash = 200; //starting cash and current cash
let amtOfCashToWin = 100000; //cash left to win
let cashToWin = 0; //cash left to win calculation
let gambleCash = 0; //cash to gamble per round 
let streak = 0; //amount of wins in a row
let wrong = 0; //amount of losses in a row
let cashAfterMultiplier = 0; //cash after multiplier applied
let multiplier = 1; //multiplier value
let lostMultiplier = 1; //multiplier value for losses
let cashWon = 0; //cash won after gamble
let cashLost = 0; //cash lost after gamble
let wins = 0; //total wins
let losses = 0; //total losses
let moneyRects = []; // array to hold money rectangle objects for money effect
let bursts = [];

let startbutton = false;
let mainGame = false;
//main game screen faces
let streakFace0 = true;
let streakFace1 = false;
let streakFace2 = false;
let streakFace3 = false;
let streakFace4 = false;
let streakFace5 = false;
let streakFace6 = false;
let streakFace7 = false;
let streakFace8 = false;
let streakFace9 = false;
let streakFace10 = false;
//background variables for main game screen
let r = 0;
let pulse = 0;
let enlrg = 0.75;
let spread = 10;
let amt = 1;
let fade = 20;
let bg1amt = 1;
let bg1Spread = 0.5;
let count = 7;
let count2 = 7;
let cashWonEffect = false;
let cashLostEffect = false;
function preload() 
{
  myFont = loadFont('text/PressStart2P-Regular.ttf');
  startImage = loadImage("DID/START.png");
  gameLogo = loadImage("DID/DROWNING-IN-DEBT.png");
  pauseIcon = loadImage("DID/your_text.png");
  emoji0 = loadImage('emoji/emoji0.png');
  emoji1 = loadImage('emoji/emoji1.png');
  emoji2 = loadImage('emoji/emoji2.png');
  emoji3 = loadImage('emoji/emoji3.png');
  emoji4 = loadImage('emoji/emoji4.png');
  emoji5 = loadImage('emoji/emoji5.png');
  emoji6 = loadImage('emoji/emoji6.png');
  emoji7 = loadImage('emoji/emoji7.png');
  emoji8 = loadImage('emoji/emoji8.png');
  emoji9 = loadImage('emoji/emoji9.png');
  emoji10 = loadImage('emoji/emoji10.png');
  
}

function setup() 
{
  //P5 Sketch Setup
  textFont(myFont);
  createCanvas(900, 560);
  textAlign(CENTER, CENTER);
  textSize(24);
  strokeWeight(4);
  stroke(127);

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
  background(0, 20);
  stroke(127);

  if (!firstContact)  //if we have not yet received any data...
  {
    // display "Waiting" page
    mainGame = false;
    startbutton = true;
    background(0, 15);
    moneyEffect();
    

    imageMode(CENTER);
    image(gameLogo, width/2, height/2 - 150, 850, 120);
    image(startImage, width/2, height/2 + 180, 200, 50);
    fill(255);
    textSize(14);
    strokeWeight(3);
    stroke('#73115e');
    text("Your bestfriend Sean Combs is in need of help.", width/2, height/2);
    text("He owes $100,000 to the mafia and is unable to pay them back.", width/2, height/2 + 20);
    text("With the last $200 in your bank account,", width/2, height/2 + 40); 
    text("will you decide to help him pay off his debt", width/2, height/2 + 60);
    text("and help him survive?", width/2, height/2 + 80);
  }
  else if (firstContact)  //if we have established contact with the serial port, show main sketch...
  {
   // display main sketch
    mainGame = true;
    background(0, fade);
    push();
    bg2();
    pop();
    textAlign(CENTER, CENTER);
    textSize(32);
    
    for(let i = bursts.length - 1; i >= 0; i--) {
      let b = bursts[i];

      b.dist += b.speed;
      b.alpha -= 3;

      let x = width/2 + cos(b.angle) * b.dist;
      let y = height/2 -40 + sin(b.angle) * b.dist;

      fill(red(b.col), green(b.col), blue(b.col), b.alpha);
      noStroke();
      text(b.word, x, y);

      if(b.dist > width || b.alpha <= 0) {
        bursts.splice(i, 1);
      }
    }
    //for(let i )
    restingEmote();
    textSize(300);
    textAlign(CENTER);

    if (streak == 0) {
      streakFace0 = true;
      streakFace1= false;
      streakFace2= false;
      streakFace3= false;
      streakFace4= false;
      streakFace5= false;
      streakFace6= false;
      streakFace7= false;
      streakFace8= false;
      streakFace9= false;
      streakFace10= false;
      restingEmote();
    }
    else if (streak == 1) {
      streakFace0 = false;
      streakFace1= true;
      streakFace2= false;
      streakFace3= false;
      streakFace4= false;
      streakFace5= false;
      streakFace6= false;
      streakFace7= false;
      streakFace8= false;
      streakFace9= false;
      streakFace10= false;
      streakOf1();
    }
    else if (streak == 2) {
      streakFace0 = false;
      streakFace1= false;
      streakFace2= true;
      streakFace3= false;
      streakFace4= false;
      streakFace5= false;
      streakFace6= false;
      streakFace7= false;
      streakFace8= false;
      streakFace9= false;
      streakFace10= false;
      streakOf2();
    }
    else if (streak == 3) {
      streakFace0 = false;
      streakFace1= false;
      streakFace2= false;
      streakFace3= true;
      streakFace4= false;
      streakFace5= false;
      streakFace6= false;
      streakFace7= false;
      streakFace8= false;
      streakFace9= false;
      streakFace10= false;
      streakOf3();
    }
    else if (streak == 4) {
      streakFace0 = false;
      streakFace1= false;
      streakFace2= false;
      streakFace3= false;
      streakFace4= true;
      streakFace5= false;
      streakFace6= false;
      streakFace7= false;
      streakFace8= false;
      streakFace9= false;
      streakFace10= false;
      streakOf4();
    }
    else if (streak >= 5) {
      streakFace0 = false;
      streakFace1= false;
      streakFace2= false;
      streakFace3= false;
      streakFace4= false;
      streakFace5= true;
      streakFace6= false;
      streakFace7= false;
      streakFace8= false;
      streakFace9= false;
      streakFace10= false;
      streakOf5();
    }
    if (wrong == 1) {
      streakFace0 = false;
      streakFace1= false;
      streakFace2= false;
      streakFace3= false;
      streakFace4= false;
      streakFace5= false;
      streakFace6= true;
      streakFace7= false;
      streakFace8= false;
      streakFace9= false;
      streakFace10= false;
      wrong1();
    }
    else if (wrong == 2) {
      streakFace0 = false;
      streakFace1= false;
      streakFace2= false;
      streakFace3= false;
      streakFace4= false;
      streakFace5= false;
      streakFace6= false;
      streakFace7= true;
      streakFace8= false;
      streakFace9= false;
      streakFace10= false;
      wrong2();
    }
    else if (wrong == 3) {
      streakFace0 = false;
      streakFace1= false;
      streakFace2= false;
      streakFace3= false;
      streakFace4= false;
      streakFace5= false;
      streakFace6= false;
      streakFace7= false;
      streakFace8= true;
      streakFace9= false;
      streakFace10= false;
      wrong3();
    }
    else if (wrong == 4) {
      streakFace0 = false;
      streakFace1= false;
      streakFace2= false;
      streakFace3= false;
      streakFace4= false;
      streakFace5= false;
      streakFace6= false;
      streakFace7= false;
      streakFace8= false;
      streakFace9= true;
      streakFace10= false;
      wrong4();
    }
    else if (wrong >= 5) {
      streakFace0 = false;
      streakFace1= false;
      streakFace2= false;
      streakFace3= false;
      streakFace4= false;
      streakFace5= false;
      streakFace6= false;
      streakFace7= false;
      streakFace8= false;
      streakFace9= false;
      streakFace10= true;
      wrong5();
    }
    rectMode(CENTER);
    strokeWeight(6);
    stroke('#fd20cdff');
    fill('#670452ff');
    rect(450, 490, 800, 95, 2);
    textSize(11);
    fill(255);
    noStroke();
    text("Amount to Gamble " + "   Current Streak   " + "  Wins " + "    Losses  " + "    Multiplier ", 450, 460);
    textSize(27);
    strokeWeight(4);
    stroke('#00eaffff');
    text("$" + cashPot + "     " + "     " + "      " + "    " + multiplier + "x", 450, 510);
    text(wins + "   " + losses, 570, 510);
    text(streak, 360, 510);
    strokeWeight(3);
    stroke('#fd20cdff');
    fill('#670452ff');
    rect(width/9 * 2, 35, 390, 40, 2);
    textSize(17);
    fill(255);
    noStroke();
    text("TOTAL CASH: $" + totalCash, width/9 * 1.7, 35);

    strokeWeight(3);
    stroke('#fd20cdff');
    fill('#670452ff');
    rect(width/9 * 7, 35, 390, 40, 2 );
    textSize(14);
    fill(255);
    noStroke();
    text("CASH NEEDED TO WIN: $" + cashToWin, width/9 * 7, 35);

    
    if (rxFlag) // if rxFlag is true, we are receiving data, so...
    {
      imageMode(CENTER);
      image(pauseIcon, width/2, 35, 50, 50);
    }
    else  //if rxFlag is false, we are not receiving data, so...
    {
      fill(255);
      stroke('#ff08c9');
      strokeWeight(3);
      textSize(15);
      text("PAUSED", width/2 +1, height/2 - 245);  //display "PAUSED" on the button
    }
  } 
}

function mousePressed() //if mouse is pressed...
{
  if (mainGame == true )
  {//PAUSE/RESUME RX BUTTON

    if (mouseX > 400 && mouseX < 500 && mouseY > 10 && mouseY < 60) // if mouse postion is within the radius of the circle button...
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
  } 
  if (startbutton == true)
  {
    if (mouseX > 350 && mouseX < 550 && mouseY > 425 && mouseY < 485)
    {
      rxFlag = true;
      if (rxFlag)
      {
        serial.write('A');
      } 
    }
  }
}

function restingEmote()
{
  if (streakFace0 == true) {
    image(emoji0, width/2, height/2, 250, 250);
  }
}

function streakOf1()
{
  if (streakFace1 == true) {
    image(emoji1, width/2, height/2, 250, 250);
  }
}

function streakOf2() 
{
  if (streakFace2 == true) {
    image(emoji2, width/2, height/2, 250, 250);
  }
}

function streakOf3()
{
  if (streakFace3 == true) {
    image(emoji3, width/2, height/2, 250, 250);
  }
}

function streakOf4()
{
  if (streakFace4 == true) {
    image(emoji4, width/2, height/2, 250, 250);
  }
}

function streakOf5()
{
  if (streakFace5 == true) {
    image(emoji5, width/2, height/2, 250, 250); 
  }
}

function wrong1()
{
  if (streakFace6 == true) {
    image(emoji6, width/2, height/2, 250, 250);
  }   
}

function wrong2()
{
  if (streakFace7 == true) {
    image(emoji7, width/2, height/2, 250, 250);
  }   
}

function wrong3()
{
  if (streakFace8 == true) {
    image(emoji8, width/2, height/2, 250, 250);
  }   
} 

function wrong4()
{
  if (streakFace9 == true) {
    image(emoji9, width/2, height/2, 250, 250);
  }   
}

function wrong5()
{
  if (streakFace10 == true) {
    image(emoji10, width/2, height/2, 250, 250);
  }   
}

function moneyEffect()
{
  rectMode(CENTER);

  // Reset spread when it gets large
  if (bg1Spread >= 500) {
    bg1Spread = 0.5;
  }

  // Create new rectangles (same behavior you already had)
  for (let i = 0; i < bg1amt; i++) {
    moneyRects.push({
      x: width/2 + random(-bg1Spread, bg1Spread),
      y: height/2 -170 + random(0, bg1Spread),
      w: 40,
      h: 20,
      alpha: 255,             // start fully visible
      fadeSpeed: random(2,5)  // fade rate
    });

    bg1Spread += 2.5;
  }

  // Draw and fade out old rectangles
  for (let i = moneyRects.length - 1; i >= 0; i--) {
    let r = moneyRects[i];

    fill(100, 200, 150, r.alpha);
    stroke(50, 150, 100, r.alpha);
    strokeWeight(2);
    rect(r.x, r.y, r.w, r.h);

    // Fade out
    r.alpha -= r.fadeSpeed;

    // Remove when invisible
    if (r.alpha <= 0) {
      moneyRects.splice(i, 1);
    }
  }
}

function bg2()
{
  translate(width / 2, height / 2);
  enlrg = map(diffPot, 0, 550, 0.75, 2.7);
  spread = diffPot;

  pulse += 0.01;
  r = r + 0.01;
  
  let d = 150 * sin(pulse);
  if (spread > 10) { 
  spread *= 0.99
  }
  
  for (let i = 0; i < 10; i++) {
    for(let t = 0; t<amt; t++) {
    
    fill(t+5, t+20, t*2);
    rect(random(spread,-spread), random(spread, -spread), random(8*enlrg), random(80 *enlrg));
    rotate(r);
    translate(d, 100);
    stroke(230, 45, 133,)
    fill(230, 45, 133,)
    rect(0, 0, 5 * enlrg, 80 * enlrg);
    }
  }

  for (let i = 0; i < 10; i++) {
    for(let t = 0; t<amt; t++) {
    
    fill(t+5, t+20, t*2);
    rect(random(spread,-spread), random(spread, -spread), random(15*enlrg), random(80 *enlrg));
    rotate(r);
    translate(d, 80);
    stroke(133, 230, 230,)
    fill(133, 230, 230,)
    rect(0, 0, 5 * enlrg, 80 * enlrg);
    }
  }
  
  let f = 170 / sin(pulse);
  if (spread > 10) { 
  spread *= 0.99
  }
  
  for (let i = 0; i < 10; i++) {
    for(let t = 0; t<amt; t++) {
    
    fill(t+5, t+20, t*2);
    rect(random(spread,-spread), random(spread, -spread), random(8*enlrg), random(80 *enlrg));
    rotate(r);
    translate(f, 100);
    stroke(230, 45, 133,)
    fill(230, 45, 133,)
    rect(0, 0, 5 * enlrg, 80 * enlrg);
    }
  }
  
  for (let i = 0; i < 10; i++) {
    for(let t = 0; t<amt; t++) {
    
    fill(t+5, t+20, t*2);
    rect(random(spread,-spread), random(spread, -spread), random(15*enlrg), random(80 *enlrg));
    rotate(r);
    translate(f, 80);
    stroke(133, 230, 230,);
    fill(133, 230, 230,);
    rect(0, 0, 5 * enlrg, 80 * enlrg);
    }
  }
}

function bg3()
{

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
    inString = serial.readLine(); // read the incoming string until you get a newline character
    if (inString.length > 0) 
    {
      cashToWin = amtOfCashToWin - totalCash;
      
      arduinoCom = inString.trim(); 
      if (arduinoCom === "correct") 
      {
        wins++;
        streak++;
        wrong = 0;  
        cashWonEffect = true;
        cashLostEffect = false;
      }
      else if (arduinoCom === "incorrect") 
      {
        losses++;
        wrong++;
        streak = 0;
        cashWonEffect = false;
        cashLostEffect = true;
      }
      if (arduinoCom === "wonDiff1")
      {
        multiplier = 1.25;
        cashAfterMultiplier = floor(cashPot * multiplier);
        totalCash += cashAfterMultiplier;
        cashWon = cashAfterMultiplier;
         for (let i = 0; i < count; i++) {
          bursts.push({
            word: "+" + cashWon,
            angle: random(TWO_PI),
            dist: 0,
            speed: random(2, 5),
            alpha: 255,
            col: color(0, 255, 0)
          });
        }
        cashWonEffect = false;
      }
      else if (arduinoCom === "wonDiff2")
      {
        multiplier = 1.5;
        cashAfterMultiplier = floor(cashPot * multiplier);
        totalCash += cashAfterMultiplier;
        cashWon = cashAfterMultiplier;
        if(cashWonEffect) {
           for (let i = 0; i < count; i++) {
            bursts.push({
              word: "+" + cashWon,
              angle: random(TWO_PI),
              dist: 0,
              speed: random(2, 5),
              alpha: 255,
              col: color(0, 255, 0)
            });
          }
        }
       cashWonEffect = false;
      }
      else if (arduinoCom === "wonDiff3")
      {
        multiplier = 1.75;
        cashAfterMultiplier = floor(cashPot * multiplier);
        totalCash += cashAfterMultiplier;
        cashWon = cashAfterMultiplier;
         for (let i = 0; i < count; i++) {
          bursts.push({
            word: "+" + cashWon,
            angle: random(TWO_PI),
            dist: 0,
            speed: random(2, 5),
            alpha: 255,
            col: color(0, 255, 0)
          });
        }
        cashWonEffect = false;
      }
      else if (arduinoCom === "wonDiff4")
      {
        multiplier = 2;
        cashAfterMultiplier = floor(cashPot * multiplier);
        totalCash += cashAfterMultiplier;
        cashWon = cashAfterMultiplier;
         for (let i = 0; i < count; i++) {
          bursts.push({
            word: "+" + cashWon,
            angle: random(TWO_PI),
            dist: 0,
            speed: random(2, 5),
            alpha: 255,
            col: color(0, 255, 0)
          });
        }
        cashWonEffect = false;
      }
      else if (arduinoCom === "wonDiff5")
      {
        multiplier = 3;
        cashAfterMultiplier = floor(cashPot * multiplier);
        totalCash += cashAfterMultiplier;
        cashWon = cashAfterMultiplier;
         for (let i = 0; i < count; i++) {
          bursts.push({
            word: "+" + cashWon,
            angle: random(TWO_PI),
            dist: 0,
            speed: random(2, 5),
            alpha: 255,
            col: color(0, 255, 0)
          });
        }
        cashWonEffect = false;
      } 
    
      if (arduinoCom === "lostDiff1")
      {
        multiplier = 1;
        lostMultiplier = 1.25;
        cashAfterMultiplier = floor(cashPot * lostMultiplier);
        totalCash -= cashAfterMultiplier;
        cashLost = cashAfterMultiplier;
        for (let i = 0; i < count2; i++) {
          bursts.push({
            word: "-" + cashLost,
            angle: random(TWO_PI),
            dist: 0,
            speed: random(2, 5),
            alpha: 255,
            col: color(255, 0, 0)
          });
        }
        cashLostEffect = false;
      }
      else if (arduinoCom === "lostDiff2")
      {
        multiplier = 1;
        lostMultiplier = 1.5;
        cashAfterMultiplier = floor(cashPot * lostMultiplier);
        totalCash -= cashAfterMultiplier;
        cashLost = cashAfterMultiplier;
        for (let i = 0; i < count2; i++) {
          bursts.push({
            word: "-" + cashLost,
            angle: random(TWO_PI),
            dist: 0,
            speed: random(2, 5),
            alpha: 255,
            col: color(255, 0, 0)
          });
        }
        cashLostEffect = false;
      }
      else if (arduinoCom === "lostDiff3")
      {
        multiplier = 1;
        lostMultiplier = 1.75;
        cashAfterMultiplier = floor(cashPot * lostMultiplier);
        totalCash -= cashAfterMultiplier;
        cashLost = cashAfterMultiplier;
        for (let i = 0; i < count2; i++) {
          bursts.push({
            word: "-" + cashLost,
            angle: random(TWO_PI),
            dist: 0,
            speed: random(2, 5),
            alpha: 255,
            col: color(255, 0, 0)
          });
        }
        cashLostEffect = false;
      }
      else if (arduinoCom === "lostDiff4")
      {
        multiplier = 1;
        lostMultiplier = 2;
        cashAfterMultiplier = floor(cashPot * lostMultiplier);
        totalCash -= cashAfterMultiplier;
        cashLost = cashAfterMultiplier;
        for (let i = 0; i < count2; i++) {
          bursts.push({
          word: "-" + cashLost,
            angle: random(TWO_PI),
            dist: 0,
            speed: random(2, 5),
            alpha: 255,
            col: color(255, 0, 0)
          });
        }
        cashLostEffect = false;
      }
      else if (arduinoCom === "lostDiff5")
      {
        multiplier = 1;
        lostMultiplier = 3;
        cashAfterMultiplier = floor(cashPot * lostMultiplier);
        totalCash -= cashAfterMultiplier;
        cashLost = cashAfterMultiplier;
        for (let i = 0; i < count2; i++) {
          bursts.push({
            word: "-" + cashLost,
            angle: random(TWO_PI),
            dist: 0,
            speed: random(2, 5),
            alpha: 255,
            col: color(255, 0, 0)
          });
        }
        cashLostEffect = false;
      }
      if (totalCash < 0) {
        totalCash = 0;
      }
      print("arduinoCom: " + arduinoCom);
      print("Rx String: " + inString); 
      if(inString.includes(",")) 
      {// print the incoming string to the console
        sensors = split(inString, ','); // split the string into an array of sensor values
    
        if(sensors.length >= 3) // check if we have all 4 sensor values before trying to access them
        {
          print(sensors); // print the array of sensor values to the console

          button1 = Number(sensors[0]); // convert the first sensor value to an integer
          button1 = map(button1, 0, 1, 0, 255); // map the button value from boolean true/false to 0-255
        
          diffPot = Number(sensors[1]); // convert the third sensor value to an integer
          diffPot = map(diffPot, 0, 1023, 0, 550); // map the potentiometer value from 0-1023 to 0-255
          diffPot = floor(diffPot); // round the potentiometer value to an integer
        
          cashPot = Number(sensors[2]); // convert the fourth sensor value to an integer
          cashPot = map(cashPot, 0, 1023, 100, 1000); // map the potentiometer value from 0-1023 to 0-255
          cashPot = floor(cashPot); // round the potentiometer value to an integer

          print("Button 1: " + button1 + " Pot 1: " + diffPot + " Pot 2: " + cashPot);  //print mapped sensor values to the console

          //now that we're done processing the incoming data, we can "call out" to our microcontroller, which respond with latest sensor data.
          serial.write('A');  // send 'A' to the serial port to indicate that we want the latest sensor data
        }
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
