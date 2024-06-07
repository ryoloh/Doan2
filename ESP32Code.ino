/*
 * This ESP32 code is created by esp32io.com
 *
 * This ESP32 code is released in the public domain
 *
 * For more detail (instruction and wiring diagram), visit https://esp32io.com/tutorials/esp32-http-request
 */

#define ADDFINGER 0xA1
#define ADDRFID 0xA2
#define LOGFINGER 0xA3
#define LOGRFID 0xA4
#define DELETEFINGER 0xA5
#define DELETERFID 0xA6

#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <Arduino_JSON.h>
#include <String.h>
const char WIFI_SSID[] = "Galaxy";         // CHANGE IT
const char WIFI_PASSWORD[] = "12345678"; // CHANGE IT
HTTPClient http;
HTTPClient http1;
HTTPClient http2;
HTTPClient http3;

String HOST_NAME   = "https://attendance-website-aiiq.onrender.com"; // CHANGE IT
String PATH_NAME   = "/api/user/get-biometric";      // CHANGE IT
String PATH_NAME1  ="/api/user/save-biometric/:";
String PATH_NAME2  ="/api/user/check-attendance/";
String PATH_NAME3  ="/api/user/get-delete-data/";

void SendSTM32(byte Command,byte Data)
{
  Serial2.write(0xFE);
  Serial2.write(Command);
  Serial2.write(Data);
  Serial2.write(0xFD);
}

void CheckDangKy()
{
      http.begin(HOST_NAME + PATH_NAME );
      http.addHeader("Content-Type", "application/json");
      int httpCode = http.GET();
      
      // httpCode will be negative on error
      if (httpCode > 0)
        { String payload = http.getString();
        // file found at server
        Serial.println(httpCode);
        Serial.println(payload);
            
        JSONVar myObject = JSON.parse(payload);
        if (JSON.typeof(myObject) == "undefined") {
        Serial.println("Parsing input failed!");
        return;}
        Serial.print("JSON object = ");
        Serial.println(myObject);
        JSONVar keys = myObject.keys();
        String value = myObject[keys[0]];
        String value1 = myObject[keys[1]];
        Serial.println(value);
        Serial.println(value1);

        Serial.print("CO YEU CAU DANG KY. PHUONG THUC:");
        Serial.print(value);
        Serial.print(". ID:");
        Serial.print(value1);
        if(value=="RFID") SendSTM32(ADDRFID,value1.toInt());
        else if(value=="FINGERPRINT") SendSTM32(ADDFINGER,value1.toInt());
        
       }
       http.end();
}

void dangkyxong(String method,String id)
{
     char* test1="A2 A3 A4 A5 A5";
     http.begin(HOST_NAME+PATH_NAME1+id);
     http.addHeader("Content-Type", "application/json");
     StaticJsonDocument<300> doc;
      doc["userId"] = id;
      doc["method"] =method;
      doc["data"]=test1;
    String loader;
     serializeJson(doc, loader);
     int httpResponseCode = http.POST(loader);
    if(httpResponseCode>0){
        String response = http.getString();                       //Get the response to the request
        Serial.println(httpResponseCode);   //Print return code
        Serial.println(response); }
       else{
        Serial.print("Error on sending POST: ");
        Serial.println(httpResponseCode);
       }
       http.end();
}

void diemdanh(String method1,String datasent)
{
   http2.begin(HOST_NAME+PATH_NAME2);
   http2.addHeader("Content-Type", "application/json");
   //char* datasent="A2 B2 C5 D4 F4";
   //String method1="RFID";          //Print request answer
   StaticJsonDocument<200> doc1;
   doc1["method"] =method1;
   doc1["data"]=datasent;
   String loader1;
   serializeJson(doc1, loader1);
   int httpResponseCode1 = http2.POST(loader1);
   if(httpResponseCode1>0){
   String response = http2.getString();
   Serial.println(httpResponseCode1);   //Print return code
   Serial.println(response); }
   http2.end();
}

void CheckXoa()
{
   http3.begin(HOST_NAME+PATH_NAME3);
   http3.addHeader("Content-Type", "application/json");
   int httpCode1 = http3.GET();
   if (httpCode1 > 0)
   {
     String payload1 = http3.getString();
     // file found at server
     Serial.println(httpCode1);
     Serial.println(payload1);
     JSONVar myObject1 = JSON.parse(payload1);
     JSONVar keys = myObject1.keys();
     String value = myObject1[keys[0]];
     String value1 = myObject1[keys[2]];
     Serial.println(value);
     Serial.println(value1);
     Serial.print("CO YEU CAU XOA. PHUONG THUC:");
     Serial.print(value);
     Serial.print(". ID:");
     Serial.print(value1);   
     if(value=="RFID") SendSTM32(DELETERFID,value1.toInt());
     else if(value=="FINGERPRINT") SendSTM32(DELETEFINGER,value1.toInt());
   }
   http3.end();
}

void setup() {
  Serial.begin(9600);
  Serial2.begin(9600);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.println("Connecting");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.print("Connected to WiFi network with IP Address: ");
  Serial.println(WiFi.localIP());

  HTTPClient http;
  HTTPClient http1;
  HTTPClient http2;
  HTTPClient http3;


  
}

void loop() {
  byte UARTData;
  byte UARTBuffer[10];
  byte UARTIndex=0;
  
  CheckDangKy();
  CheckXoa();
  delay(100);
  if(Serial.available())
  {
    UARTData=Serial.read();
    Serial2.write(UARTData);
  }
  if(Serial2.available())
  {
    UARTData=Serial2.read();
    if(UARTData==0xFE)
    {
      UARTIndex=0;
    }
    else  if(UARTData==0xFD)
    {
      if(UARTBuffer[0]==LOGFINGER)
      {
        diemdanh("FINGERPRINT",(String)UARTBuffer[1]);
      }
      else if(UARTBuffer[0]==LOGRFID)
      {
        diemdanh("RFID",(String)UARTBuffer[1]);
      }
      
    }
    else
    {
      UARTBuffer[UARTIndex]=UARTData;
      UARTIndex++;
      if(UARTIndex==10) UARTIndex=0;
    }
  }
  
  
}
