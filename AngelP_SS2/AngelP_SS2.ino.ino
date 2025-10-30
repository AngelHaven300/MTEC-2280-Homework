const int buttonPin = 9;
const int LED1 = 4;
const int LED2 = 5;
const int LED3 = 6;
const int LED4 = 7;
bool buttonState = 0;
bool lastButtonState = 0;

int patternCounter = 0;
int maxCount = 5;

void setup() {
  pinMode(buttonPin, INPUT_PULLUP);
  pinMode(LED1, OUTPUT);
  pinMode(LED2, OUTPUT);
  pinMode(LED3, OUTPUT);
  pinMode(LED4, OUTPUT);
  Serial.begin(115200);

}

void loop() {
  
  buttonState = !digitalRead(buttonPin);

  if (buttonState && !lastButtonState) //if button went from LOW to HIGH
  {
    patternCounter++;  //increment counter
  }
  if (patternCounter == 0) {
    digitalWrite(LED1, HIGH);
    digitalWrite(LED2, HIGH);
    digitalWrite(LED3, HIGH);
    digitalWrite(LED4, HIGH);

  } else if (patternCounter == 1) {
    digitalWrite(LED1, HIGH);
    digitalWrite(LED2, LOW);
    digitalWrite(LED3, HIGH);
    digitalWrite(LED4, LOW);

  } else if (patternCounter == 2) {
    digitalWrite(LED1, LOW);
    digitalWrite(LED2, HIGH);
    digitalWrite(LED3, LOW);
    digitalWrite(LED4, HIGH);

  } else if (patternCounter == 3) {
    digitalWrite(LED1, HIGH);
    digitalWrite(LED2, LOW);
    digitalWrite(LED3, LOW);
    digitalWrite(LED4, HIGH);

  } else if (patternCounter == 4) {
    digitalWrite(LED1, LOW);
    digitalWrite(LED2, HIGH);
    digitalWrite(LED3, HIGH);
    digitalWrite(LED4, LOW);
    
  } else if (patternCounter == 5) {
    digitalWrite(LED1, LOW);
    digitalWrite(LED2, LOW);
    digitalWrite(LED3, LOW);
    digitalWrite(LED4, LOW);
  }

  if (patternCounter > maxCount) //if pattern is greater than maximum count variable...
  {
    patternCounter = 0;  //reset counter
  }

  lastButtonState = buttonState;  //store current button state for logic comparison

  Serial.printf("Button = %i ; patternCount = %i \n", buttonState, patternCounter);
}
