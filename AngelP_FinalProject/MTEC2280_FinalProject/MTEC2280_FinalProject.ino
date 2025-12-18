#include "Pitch.h"  //grabs pitches from pitch.h

const int numLEDs = 6;                                //number of LEDS
const int ledPins[numLEDs] = { 16, 15, 7, 6, 5, 4 };  //an array containing all the LEDS on the bread board
const int adcPin = 11;                                //Potentiometer
const int adcPin2 = 10;
const int buttonPin = 3;  //Button
const int piezoPin = 39;  //Piezo

bool buttonState = 0;
bool lastButtonState = HIGH;
bool buttonPressed = false;

bool gameRunning = false;

long score = 0;              //score goes up
unsigned long lastTime = 0;  //Last time an LED went off

int timerInterval = 500;  //Delay between LED's turning on
int currentLED = 0;       //Next LED turning on
//int buttonState = 0; //If button is on or off
int potValue = 0;
int potValue2 = 0;  // Stores values from the potentiometer
int inByte = 0;
int outByte = 0;

void setup() {
  pinMode(buttonPin, INPUT_PULLUP);

  for (int i = 0; i < numLEDs; i++) {
    pinMode(ledPins[i], OUTPUT);  //loops through leds to set them as output
  }

  analogReadResolution(10);  //10 bits which sets the pot range to 0 - 1023
  Serial.begin(9600);
}

void loop() {

  if (Serial.available()) {
    inByte = Serial.read();

    if (inByte == 'A') {
      gameRunning = true;
      Serial.println("Game Started");
      //potValue = analogRead(adcPin); //read pot 1
      //potValue2= analogRead(adcPin2); //read pot 2
      //buttonState = !digitalRead(buttonPin);  //read button 1
      
      //Serial.print(buttonState);  //send 1st value
      //Serial.print(',');            //send comma ASCII char to separate values
      //Serial.print(potValue);      //send 3rd value
      //Serial.print(',');            //send comma ASCII char to separate values
      //Serial.print(potValue2);      //send 4th value
      //Serial.print('\n');           //send newline ASCII char to frame end of message
    } else if (inByte == 'B') {
      gameRunning = false;
      Serial.println("Game Paused");
    } else {
      Serial.println("Rx Byte is neither 'A' nor 'B'");
    }
  }

  if (gameRunning) {

    unsigned long currentTime = millis();  //milliseconds since booting up the board
    buttonState = digitalRead(buttonPin);
    potValue = analogRead(adcPin);
    timerInterval = map(potValue, 0, 1023, 40, 350);                   //coverts potvalue into delay time between 40 & 350
    int activeLED = (currentLED == 0) ? numLEDs - 1 : currentLED - 1;  //checks what led is on

   

    if (buttonState == LOW && lastButtonState == HIGH) {
      buttonPressed = true;
    } else if (buttonState == HIGH) {
      buttonPressed = false;
    }
    lastButtonState = buttonState;

    if (buttonState == HIGH) {
      if (currentTime - lastTime >= timerInterval) {  //checks timerInterval to turn on next led
        lastTime = currentTime;

        for (int i = 0; i < numLEDs; i++) {
          digitalWrite(ledPins[i], LOW);  //turns off all other leds
        }

        digitalWrite(ledPins[currentLED], HIGH);  //turns on current led

        currentLED = (currentLED + 1) % numLEDs;  //moves to next led and loops it back
      }
    } else if (buttonState == LOW && digitalRead(ledPins[5]) == HIGH) {  //if button is pressed and red led is on

      for (int i = 0; i < 5; i++) {
        digitalWrite(ledPins[i], LOW);  //first 5 leds turn off
      }

      Serial.println("correct");

      if (potValue >= 819) {
        Serial.println("wonDiff1");
      } else if (potValue >= 615 && potValue <= 818) {
        Serial.println("wonDiff2");
      } else if (potValue >= 411 && potValue <= 614) {
        Serial.println("wonDiff3");
      } else if (potValue >= 207 && potValue <= 410) {
        Serial.println("wonDiff4");
      } else if (potValue >= 0 && potValue <= 206) {
        Serial.println("wonDiff5");
      }
      tone(piezoPin, NOTE_E6, 125);
      //delay(130);
      tone(piezoPin, NOTE_G6, 125);
      //delay(130);
      tone(piezoPin, NOTE_E7, 125);
      //delay(130);
      tone(piezoPin, NOTE_C7, 125);
      //delay(130);
      tone(piezoPin, NOTE_D7, 125);
      //delay(130);
      tone(piezoPin, NOTE_G7, 125);
      //delay(125);
      noTone(piezoPin);

      

    } else if (buttonState == LOW && digitalRead(ledPins[activeLED]) == HIGH) {

      for (int i = 0; i < 5; i++) {
        digitalWrite(ledPins[i], LOW);
        digitalWrite(ledPins[activeLED], HIGH);
      }

      Serial.println("incorrect");
      if (potValue >= 819) {
        Serial.println("lostDiff1");
      } else if (potValue >= 615 && potValue <= 818) {
        Serial.println("lostDiff2");
      } else if (potValue >= 411 && potValue <= 614) {
        Serial.println("lostDiff3");
      } else if (potValue >= 207 && potValue <= 410) {
        Serial.println("lostDiff4");
      } else if (potValue >= 0 && potValue <= 206) {
        Serial.println("lostDiff5");
      }
      tone(piezoPin, NOTE_A5, 150);
      delay(150);
      tone(piezoPin, NOTE_F5, 150);
      delay(150);
      tone(piezoPin, NOTE_D5, 180);
      delay(180);
      tone(piezoPin, NOTE_B4, 200);
      delay(200);
      tone(piezoPin, NOTE_G4, 220);
      delay(220);
      tone(piezoPin, NOTE_E4, 260);
      delay(260);
      tone(piezoPin, NOTE_C4, 300);
      delay(300);
      noTone(piezoPin);

      
    }
  }
}
