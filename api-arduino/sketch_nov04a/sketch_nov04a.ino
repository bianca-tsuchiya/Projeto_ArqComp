
int lm35_pin = A0, leitura_lm35 = 0;
float temperatura;
float temp_processo1 = temperatura * 0.28 + 6.41;
float temp_processo2a = temperatura * 0.28 + 56.41;
float temp_processo2b = temperatura * 0.47 + 60.68;
float temp_processo2c = temperatura * 1.43 + 62.06;
float temp_processo3 = temperatura * 0.95 + 43.37;
float temp_processo4a = temperatura * 0.47 + 25.68;
float temp_processo4b = temperatura * 1.43 + 27.06;
float temp_processo4c = temperatura * 0.47 + 52.68;
float temp_processo5 = temperatura * 0.19 + 96.27;
float temp_processo6a = temperatura * 0.28 + 9.41;
float temp_processo6b = temperatura * 0.28 + 14.41;
float temp_processo6c = temperatura * 0.19 + 9.27;
float temp_processo7 = temperatura * 0.19 + 9.27;
float temp_processo8 = temperatura * 0.95 + 41.37;
float temp_processo9 = temperatura * 0.85 - 9.76;

int switch_pin = 7;
void setup()
{
Serial.begin(9600);

pinMode(switch_pin, INPUT);
}
void loop()
{
/**
* Bloco do DHT11
float umidade = dht_1.readHumidity();
float temperatura = dht_1.readTemperature();
if (isnan(temperatura) or isnan(umidade))
{
Serial.println("Erro ao ler o DHT");
}
else
{
Serial.print(umidade);
Serial.print(";");
Serial.print(temperatura);
Serial.print(";");
}
*/
/**
* Bloco do LM35
*/
leitura_lm35 = analogRead(lm35_pin);
temperatura = leitura_lm35 * (5.0/1023) * 100;
Serial.print(temperatura);
Serial.print(";");
Serial.print(temp_processo1);
Serial.print(";");
Serial.print(temp_processo2a);
Serial.print(";");
Serial.print(temp_processo2b);
Serial.print(";");
Serial.print(temp_processo2c);
Serial.print(";");
Serial.print(temp_processo3);
Serial.print(";");
Serial.print(temp_processo4a);
Serial.print(";");
Serial.print(temp_processo4b);
Serial.print(";");
Serial.print(temp_processo4c);
Serial.print(";");
Serial.print(temp_processo5);
Serial.print(";");
Serial.print(temp_processo6a);
Serial.print(";");
Serial.print(temp_processo6b);
Serial.print(";");
Serial.print(temp_processo6c);
Serial.print(";");
Serial.print(temp_processo7);
Serial.print(";");
Serial.print(temp_processo8);
Serial.print(";");
Serial.print(temp_processo9);
Serial.println(";");
/**
* Bloco do LDR5

leitura_ldr = analogRead(ldr_pin);
Serial.print(leitura_ldr);
Serial.print(";");
*/
/**
* Bloco do TCRT5000

if(digitalRead(switch_pin) == LOW){
Serial.println(1);
}
else {
Serial.println(0);
}
*/
delay(1000);
}
