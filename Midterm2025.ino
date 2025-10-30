#include "Pitch.h" //grabs pitches from pitch.h

const int numLEDs = 6;  //number of LEDS                      
const int ledPins[numLEDs] = {16, 15, 7, 6, 5, 4}; //an array containing all the LEDS on the bread board
const int adcPin = 10;  //Potentiometer                      
const int buttonPin = 3; //Button
const int piezoPin = 39; //Piezo 

long score = 0; //score goes up 
unsigned long lastTime = 0; //Last time an LED went off                           
                 
int timerInterval = 500; //Delay between LED's turning on                      
int currentLED = 0;  //Next LED turning on          
int buttonState = 0; //If button is on or off
int potValue = 0; // Stores values from the potentiometer

void setup() {
  pinMode(buttonPin, INPUT_PULLDOWN); 

  for (int i = 0; i < numLEDs; i++) {
    pinMode(ledPins[i], OUTPUT); //loops through leds to set them as output
  }

  analogReadResolution(10); //10 bits which sets the pot range to 0 - 1023 
  Serial.begin(115200);
}

void loop() {
  unsigned long currentTime = millis(); //milliseconds since booting up the board
  buttonState = digitalRead(buttonPin);
  potValue = analogRead(adcPin);
  timerInterval = map(potValue, 0, 1023, 40, 350); //coverts potvalue into delay time between 40 & 350
  int activeLED = (currentLED == 0) ? numLEDs - 1 : currentLED - 1; //checks what led is on 

  if (buttonState == LOW) { //when not pressing the button
    if (currentTime - lastTime >= timerInterval) { //checks timerInterval to turn on next led
      lastTime = currentTime;

      for (int i = 0; i < numLEDs; i++) {
        digitalWrite(ledPins[i], LOW); //turns off all other leds
      }

      digitalWrite(ledPins[currentLED], HIGH); //turns on current led
      Serial.printf("LED %d ON | Interval: %d ms | PotValue: %d | SCORE: %d\n", currentLED + 1, timerInterval, potValue, score);

      currentLED = (currentLED + 1) % numLEDs; //moves to next led and loops it back
    }
  } else if (buttonState == HIGH && digitalRead(ledPins[5]) == HIGH) { //if button is pressed and red led is on 

    for (int i = 0; i < 5; i++) {
      digitalWrite(ledPins[i], LOW); //first 5 leds turn off
    }

    tone(piezoPin, NOTE_E6, 125); //makes sound when you hit the red led
    delay(130);
    tone(piezoPin, NOTE_G6, 125);
    delay(130);
    tone(piezoPin, NOTE_E7, 125);
    delay(130);
    tone(piezoPin, NOTE_C7, 125);
    delay(130);
    tone(piezoPin, NOTE_D7, 125);
    delay(130);
    tone(piezoPin, NOTE_G7, 125);
    delay(125);
    noTone(piezoPin);

    if (potValue >= 819) { //checks pot value to add score
      score += 1;
    } else if (potValue >= 615 && potValue <= 818) {
      score += 2;
    } else if (potValue >= 411 && potValue <= 614) {
      score += 3;
    } else if (potValue >= 207 && potValue <= 410) {
      score += 4;
    } else if (potValue >= 0 && potValue <= 206) {
      score += 5;
    } 
     
  }

  else if (buttonState == HIGH && digitalRead(ledPins[activeLED]) == HIGH) { //if another led is on that is not is red when the button is pressed 
    for (int i = 0; i < 5; i++) {
      digitalWrite(ledPins[i], LOW); //turn off all other leds except the active led that is on
    }
   if (potValue >= 819) { // subtract points based on the pot value
      score -= 1;
    } else if (potValue >= 615 && potValue <= 818) {
      score -= 2;
    } else if (potValue >= 411 && potValue <= 614) {
      score -= 3;
    } else if (potValue >= 207 && potValue <= 410) {
      score -= 4;
    } else if (potValue >= 0 && potValue <= 206) {
      score -= 5;
    } 
    if (score < 0){ // makes sure score never goes to a negative number
      score = 0;
    }
  }
}