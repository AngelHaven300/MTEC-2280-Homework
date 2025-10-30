const int LED1 = 10;
const int LED2 = 3;
const int LED3 = 18;
const int LED4 = 15;

int loopCount = 0;
int ms = 500;
bool ledState = 0;


void setup() {
// put your setup code here, to run once:
pinMode(LED1, OUTPUT);
pinMode(LED2, OUTPUT);
pinMode(LED3, OUTPUT);
pinMode(LED4, OUTPUT);

}

void loop() {
// put your main code here, to run repeatedly:
 
if (loopCount == 0)
{
  digitalWrite(LED1, 1);
  digitalWrite(LED2, 1);
  digitalWrite(LED3, 1);
  digitalWrite(LED4, 1);
}
else if (loopCount == 1)
{
  digitalWrite(LED1, 1);
  digitalWrite(LED2, 1);
  digitalWrite(LED3, 0);
  digitalWrite(LED4, 0);
}
else if (loopCount == 2)
{
  digitalWrite(LED1, 1);
  digitalWrite(LED2, 1);
  digitalWrite(LED3, 1);
  digitalWrite(LED4, 0);
}
else if (loopCount == 3)
{
  digitalWrite(LED1, 1);
  digitalWrite(LED2, 0);
  digitalWrite(LED3, 1);
  digitalWrite(LED4, 0);
}
else if (loopCount == 4)
{
  digitalWrite(LED1, 1);
  digitalWrite(LED2, 0);
  digitalWrite(LED3, 0);
  digitalWrite(LED4, 1);
}
else if (loopCount == 5)
{
  digitalWrite(LED1, 0);
  digitalWrite(LED2, 0);
  digitalWrite(LED3, 1);
  digitalWrite(LED4, 1);

  loopCount = 0;
}

delay(ms);

loopCount++;

}
