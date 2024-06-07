/* USER CODE BEGIN Header */
/**
  ******************************************************************************
  * @file           : main.c
  * @brief          : Main program body
  ******************************************************************************
  * @attention
  *
  * <h2><center>&copy; Copyright (c) 2020 STMicroelectronics.
  * All rights reserved.</center></h2>
  *
  * This software component is licensed by ST under BSD 3-Clause license,
  * the "License"; You may not use this file except in compliance with the
  * License. You may obtain a copy of the License at:
  *                        opensource.org/licenses/BSD-3-Clause
  *
  ******************************************************************************
  */
/* USER CODE END Header */
/* Includes ------------------------------------------------------------------*/
#include "main.h"

/* Private includes ----------------------------------------------------------*/
/* USER CODE BEGIN Includes */
#include "rc522.h"
#include "FONTS.h"
#include  "SSD1306.h"
#include "stdint.h"
#include "stdio.h"
#include "flash.h"
/* USER CODE END Includes */

/* Private typedef -----------------------------------------------------------*/
/* USER CODE BEGIN PTD */
//cma bien van tay
 #define FP_OK 0x00
 #define FP_ERROR 0xFE
 #define FP_NOFINGER 0x02
 #define FP_FINGER_NOTMATCH 0x0A
 #define FP_FINGER_NOTMATCH 0x0A
 #define FP_FINGER_NOTFOUND 0x09
/* USER CODE END PTD */

/* Private define ------------------------------------------------------------*/
/* USER CODE BEGIN PD */
//dinh nghia ma phim
#define NOKEY 16
#define KEY1 1
#define KEY2 2
#define KEY3 3
#define KEY4 4
#define KEY5 5
#define KEY6 6
#define KEY7 7
#define KEY8 8
#define KEY9 9

#define KEYA 10
#define KEYB 11
#define KEYC 12
#define KEYD 13
#define KEYSTAR 14
#define KEYHASH 15
#define KEY0 0

#define STAMAIN 0
#define STAMENU1 1
#define STAINPUTFGNEWID 2
#define STAINPUTFGDELETEID 3
#define STAINPUTNEWCARDID 4
#define STAINPUTNEWCARD 5
#define STAINPUTDELETECARDID 6
#define STAINPUTDELETECARD 7

#define ADDFINGER 0xA1
#define ADDRFID 0xA2
#define LOGFINGER 0xA3
#define LOGRFID 0xA4
#define DELETEFINGER 0xA5
#define DELETERFID 0xA6

#define MAXCARD 30
#define ADDRESSCARD 100 // card save from index 100
/* USER CODE END PD */

/* Private macro -------------------------------------------------------------*/
/* USER CODE BEGIN PM */

/* USER CODE END PM */

/* Private variables ---------------------------------------------------------*/
I2C_HandleTypeDef hi2c1;

SPI_HandleTypeDef hspi1;

UART_HandleTypeDef huart1;
UART_HandleTypeDef huart2;
UART_HandleTypeDef huart3;

/* USER CODE BEGIN PV */
uint8_t ESPTransmitData[20];
uint8_t ESPReceiveData[1];
uint8_t UARTDataCome=0;


uint8_t UARTIndex=0;
uint8_t ESPReceiveBuffer[10];

uint32_t TimeCount;
uint32_t FingerTimeCount;
uint8_t CardID[5];

uint8_t DataCard[MAXCARD][5];
uint8_t CardStatus[MAXCARD]={0};

uint8_t CurrentState=STAMAIN;
uint8_t CurrentID;

uint8_t DoorStatus=0;

// cam bien van tay
 uint8_t FPHeader[6]={0xEF,0x01,0xFF,0xFF,0xFF,0xFF};
	 uint8_t FPGetImage[6]={0x01,0x00,0x03,0x01,0x00,0x05};
	 uint8_t FPCreateCharFile1[7]={0x01,0x00,0x04,0x02,0x01,0x00,0x08};
	 uint8_t FPCreateCharFile2[7]={0x01,0x00,0x04,0x02,0x02,0x00,0x09};
	 uint8_t FPCreateTemplate[6]={0x01,0x00,0x03,0x05,0x00,0x09};
	 uint8_t FPDeleteAllFinger[6]={0x01,0x00,0x03,0x0D,0x00,0x11};
   uint8_t FPSearchFinger[11]={0x01,0x00,0x08,0x04,0x01,0x00,0x00,0x00,0x40,0x00,0x4E};
	 uint8_t FPGetNumberOfFinger[6]={0x01,0x00,0x03,0x1D,0x00,0x21};
   uint8_t IDFromFinger;
	 uint8_t CurrentNumberFinger;

/* USER CODE END PV */

/* Private function prototypes -----------------------------------------------*/
void SystemClock_Config(void);
static void MX_GPIO_Init(void);
static void MX_SPI1_Init(void);
static void MX_USART1_UART_Init(void);
static void MX_I2C1_Init(void);
static void MX_USART2_UART_Init(void);
static void MX_USART3_UART_Init(void);
/* USER CODE BEGIN PFP */

/* USER CODE END PFP */

/* Private user code ---------------------------------------------------------*/
/* USER CODE BEGIN 0 */

void HAL_UART_RxCpltCallback(UART_HandleTypeDef *huart) // ham ngat nhan UART
{
	HAL_UART_Receive_IT(&huart2, (uint8_t*) ESPReceiveData, 1); // bat lai che do ngat
	if(ESPReceiveData[0]==0xFE)
	{
		UARTIndex=0;
	}
	else if(ESPReceiveData[0]==0xFD)
	{
		UARTDataCome=1;
	}
	else
	{
		ESPReceiveBuffer[UARTIndex]=ESPReceiveData[0];
		UARTIndex++;
		if(UARTIndex==10) UARTIndex=0;
	}
	
}

void SendESPData(uint8_t DataType, uint8_t DataValue)
{
				ESPTransmitData[0]=0xFE;
				ESPTransmitData[1]=DataType;
				ESPTransmitData[2]=DataValue;
				ESPTransmitData[3]=0xFE;
				HAL_UART_Transmit(&huart2,ESPTransmitData, 4,1000);
}



// doan code ho tro su dung ham printf
#ifdef __GNUC__
#define PUTCHAR_PROTOTYPE int __io_putchar(int ch)
#else
#define PUTCHAR_PROTOTYPE int fputc(int ch, FILE *f)
#endif /* __GNUC__ */
 
/**
  * @brief  Retargets the C library printf function to the USART.
  * @param  None
  * @retval None
  */
PUTCHAR_PROTOTYPE
{
  HAL_UART_Transmit(&huart3, (uint8_t *)&ch, 1, HAL_MAX_DELAY);
  return ch;
}

// het doan code ho tro su dung ham printf

int ScanKey()
	{
		HAL_GPIO_WritePin(GPIOB, GPIO_PIN_12, GPIO_PIN_SET);
	  HAL_GPIO_WritePin(GPIOB, GPIO_PIN_13, GPIO_PIN_SET);
	  HAL_GPIO_WritePin(GPIOB, GPIO_PIN_14, GPIO_PIN_SET);
	  HAL_GPIO_WritePin(GPIOB, GPIO_PIN_15, GPIO_PIN_SET);
		
		HAL_GPIO_WritePin(GPIOB, GPIO_PIN_12, GPIO_PIN_RESET);
		
		if(HAL_GPIO_ReadPin(GPIOA,GPIO_PIN_0)==0)
		{
			HAL_Delay(250);
			return KEYSTAR;
		}
		if(HAL_GPIO_ReadPin(GPIOA,GPIO_PIN_1)==0)
		{
			HAL_Delay(250);
			return KEY0;
		}
		if(HAL_GPIO_ReadPin(GPIOB,GPIO_PIN_9)==0)
		{
			HAL_Delay(250);
			return KEYHASH;
		}
		if(HAL_GPIO_ReadPin(GPIOB,GPIO_PIN_8)==0)
		{
			HAL_Delay(250);
			return KEYD;
		}
		
		HAL_GPIO_WritePin(GPIOB, GPIO_PIN_12, GPIO_PIN_SET);	
		HAL_GPIO_WritePin(GPIOB, GPIO_PIN_13, GPIO_PIN_RESET);
		
		if(HAL_GPIO_ReadPin(GPIOA,GPIO_PIN_0)==0)
		{
			HAL_Delay(250);
			return KEY7;
		}
		if(HAL_GPIO_ReadPin(GPIOA,GPIO_PIN_1)==0)
		{
			HAL_Delay(250);
			return KEY8;
		}
		if(HAL_GPIO_ReadPin(GPIOB,GPIO_PIN_9)==0)
		{
			HAL_Delay(250);
			return 9;
		}
		if(HAL_GPIO_ReadPin(GPIOB,GPIO_PIN_8)==0)
		{
			HAL_Delay(250);
			return KEYC;
		}
		HAL_GPIO_WritePin(GPIOB, GPIO_PIN_13, GPIO_PIN_SET);	
		HAL_GPIO_WritePin(GPIOB, GPIO_PIN_14, GPIO_PIN_RESET);
		
		if(HAL_GPIO_ReadPin(GPIOA,GPIO_PIN_0)==0)
		{
			HAL_Delay(250);
			return KEY4;
		}
		if(HAL_GPIO_ReadPin(GPIOA,GPIO_PIN_1)==0)
		{
			HAL_Delay(250);
			return KEY5;
		}
		if(HAL_GPIO_ReadPin(GPIOB,GPIO_PIN_9)==0)
		{
			HAL_Delay(250);
			return KEY6;
		}
		if(HAL_GPIO_ReadPin(GPIOB,GPIO_PIN_8)==0)
		{
			HAL_Delay(250);
			return KEYB;
		}
		
		HAL_GPIO_WritePin(GPIOB, GPIO_PIN_14, GPIO_PIN_SET);	
		HAL_GPIO_WritePin(GPIOB, GPIO_PIN_15, GPIO_PIN_RESET);
		
		if(HAL_GPIO_ReadPin(GPIOA,GPIO_PIN_0)==0)
		{
			HAL_Delay(250);
			return KEY1;
		}
		if(HAL_GPIO_ReadPin(GPIOA,GPIO_PIN_1)==0)
		{
			HAL_Delay(250);
			return KEY2;
		}
		if(HAL_GPIO_ReadPin(GPIOB,GPIO_PIN_9)==0)
		{
			HAL_Delay(250);
			return KEY3;
		}
		if(HAL_GPIO_ReadPin(GPIOB,GPIO_PIN_8)==0)
		{
			HAL_Delay(250);
			return KEYA;
		}
		
		HAL_GPIO_WritePin(GPIOB, GPIO_PIN_15, GPIO_PIN_SET);	
		return NOKEY;
		
}
	
void DecToHexStr(uint8_t decimal, char* hexStr) {
    if (hexStr == NULL) {
        return; // Return if the hexStr pointer is NULL.
    }

    sprintf(hexStr, "%02X ", decimal); // Convert decimal to hexadecimal string with 2 characters and store it in hexStr.
}
	
void DisplayCardID()
{
	char hexString[3];
	int i;
	SSD1306_GotoXY(0,40);
	SSD1306_Puts("DA NHAN THE",&Font_7x10, SSD1306_COLOR_WHITE);
	
	SSD1306_GotoXY(0,50);
	printf("DA NHAN THE: ");
	for(i=0;i<5;i++)
	{
		DecToHexStr(CardID[i],hexString);
		SSD1306_Puts(hexString,&Font_7x10, SSD1306_COLOR_WHITE);
		printf("%02X ", CardID[i]);
	}
	SSD1306_UpdateScreen();
	
	
}

void ReadDataFlash()
{
	int i;
	uint8_t FlashByte;
	printf("FLASH DATA: \r\n");
	for (i=0;i<300;i++)
	{
	  FlashByte=Flash_Read1Byte(FLASH_USER_START_ADDR+i);
	  printf("%02X ", FlashByte);
	}
	printf("\r\nCARD STATUS \r\n");
  for(i=0;i<MAXCARD;i++)
	{
		FlashByte=Flash_Read1Byte(FLASH_USER_START_ADDR+i*2);
		CardStatus[i]=FlashByte;
		printf("%02X ", CardStatus[i]);
	}
	printf("\r\nCARD DATA \r\n");
	for(i=0;i<MAXCARD;i++)
	{
		printf("\r\nCARD %d: ",i+1);
		FlashByte=Flash_Read1Byte(FLASH_USER_START_ADDR+ADDRESSCARD+i*6);
		DataCard[i][0]=FlashByte;
		printf("%02X ", 	DataCard[i][0]);
		FlashByte=Flash_Read1Byte(FLASH_USER_START_ADDR+ADDRESSCARD+i*6+1);
		DataCard[i][1]=FlashByte;
		printf("%02X ", 	DataCard[i][1]);
		FlashByte=Flash_Read1Byte(FLASH_USER_START_ADDR+ADDRESSCARD+i*6+2);
		DataCard[i][2]=FlashByte;
		printf("%02X ", 	DataCard[i][2]);
		FlashByte=Flash_Read1Byte(FLASH_USER_START_ADDR+ADDRESSCARD+i*6+3);
		DataCard[i][3]=FlashByte;
		printf("%02X ", 	DataCard[i][3]);
		FlashByte=Flash_Read1Byte(FLASH_USER_START_ADDR+ADDRESSCARD+i*6+4);
		DataCard[i][4]=FlashByte;
		printf("%02X ", 	DataCard[i][4]);

	}
	
}

void WriteDataFlash()
{
	uint16_t FlashData;
	uint8_t i;
	printf("Dang xoa flash... \n");
	FlashErasePage(FLASH_USER_START_ADDR);
	printf("Dang luu the ... \n");
	for(i=0;i<MAXCARD;i++)
	{
			FlashData=CardStatus[i];
		  Flash_Write2Byte(FLASH_USER_START_ADDR +i*2,FlashData);
	}
	for(i=0;i<MAXCARD;i++)
	{
		FlashData=DataCard[i][1];
		FlashData=(FlashData<<8);
		FlashData=FlashData+DataCard[i][0]; // luu trong flash byte thap luu sau byte cao luu truoc moi lan luu 2 byte
		Flash_Write2Byte(FLASH_USER_START_ADDR + ADDRESSCARD +i*6,FlashData); // i*6 vi moi the luu 6 byte
		
		FlashData=DataCard[i][3];
		FlashData=(FlashData<<8);
		FlashData=FlashData+DataCard[i][2]; // luu trong flash byte thap luu sau byte cao luu truoc moi lan luu 2 byte
		Flash_Write2Byte(FLASH_USER_START_ADDR + ADDRESSCARD +i*6+2,FlashData);
		
		FlashData=0x00;
		FlashData=(FlashData<<8);
		FlashData=FlashData+DataCard[i][4];; // luu trong flash byte thap luu sau byte cao luu truoc moi lan luu 2 byte the co 5 byte nen byte thu 6 =0
		Flash_Write2Byte(FLASH_USER_START_ADDR + ADDRESSCARD +i*6+4,FlashData);
		
	}
}

void DisplayPutFinger()
{
	SSD1306_Clear();
	SSD1306_GotoXY(0,50);
	SSD1306_Puts("DAT NGON TAY VAO  ",&Font_7x10, SSD1306_COLOR_WHITE);
	SSD1306_UpdateScreen();
}

void DisplayRemoveFinger()
{
	SSD1306_GotoXY(0,50);
	SSD1306_Puts("HAY BO TAY RA    ",&Font_7x10, SSD1306_COLOR_WHITE);
	SSD1306_UpdateScreen();
}

void DisplayPutFingerAgain()
{
	SSD1306_GotoXY(0,50);
	SSD1306_Puts("DAT LAI NGON TAY  ",&Font_7x10, SSD1306_COLOR_WHITE);
	SSD1306_UpdateScreen();
}

void DisplayFingerRegis()
{
	SSD1306_GotoXY(0,50);
	SSD1306_Puts("DANG KY VAN TAY  ",&Font_7x10, SSD1306_COLOR_WHITE);
	SSD1306_UpdateScreen();
}

void DisplayRegisFingerSuccess()
{
	SSD1306_GotoXY(0,50);
	SSD1306_Puts("DA LUU VAN TAY   ",&Font_7x10, SSD1306_COLOR_WHITE);
	SSD1306_UpdateScreen();
}
void DisplayFingerfailure()
{
	SSD1306_GotoXY(0,50);
	SSD1306_Puts("CO LOI XAY RA   ",&Font_7x10, SSD1306_COLOR_WHITE);
	SSD1306_UpdateScreen();
}

void DisplayFingerNotMatch()
{
	SSD1306_GotoXY(0,50);
	SSD1306_Puts("HAI VAN TAY KHONG KHOP",&Font_7x10, SSD1306_COLOR_WHITE);
	SSD1306_UpdateScreen();
}



void DisplayDeleteSuccess()
{
	SSD1306_GotoXY(0,50);
	SSD1306_Puts("XOA VAN TAY OK   ",&Font_7x10, SSD1306_COLOR_WHITE);
	SSD1306_UpdateScreen();
}

void DisplayFingerFound()
{
	SSD1306_GotoXY(0,50);
	SSD1306_Puts("XAC NHAN VAN TAY  ",&Font_7x10, SSD1306_COLOR_WHITE);
	SSD1306_GotoXY(40,35);
	if(IDFromFinger<100) SSD1306_Putc(' ',&Font_7x10, SSD1306_COLOR_WHITE);
	else SSD1306_Putc(IDFromFinger/100+48,&Font_7x10, SSD1306_COLOR_WHITE);
	if(IDFromFinger<10) SSD1306_Putc(' ',&Font_7x10, SSD1306_COLOR_WHITE);
	else SSD1306_Putc((IDFromFinger%100)/10+48,&Font_7x10, SSD1306_COLOR_WHITE);
  SSD1306_Putc((IDFromFinger%10)+48,&Font_7x10, SSD1306_COLOR_WHITE);
	SSD1306_UpdateScreen();
}

void DisplayFingerNotFound()
{
	SSD1306_GotoXY(0,50);
	SSD1306_Puts("VAN TAY KHONG KHOP",&Font_7x10, SSD1306_COLOR_WHITE);
	SSD1306_UpdateScreen();
	
}

void DisplayStart()
{
	SSD1306_Clear();
	SSD1306_GotoXY(0,0);
	SSD1306_Puts("   HT DIEM DANH ",&Font_7x10, SSD1306_COLOR_WHITE);
	SSD1306_GotoXY(0,10);
	SSD1306_Puts("DANG KHOI DONG...",&Font_7x10, SSD1306_COLOR_WHITE);
	SSD1306_UpdateScreen();
}

void DisplayWelcome()
{
	SSD1306_Clear();
	SSD1306_GotoXY(0,0);
	SSD1306_Puts("   HT DIEM DANH ",&Font_7x10, SSD1306_COLOR_WHITE);
	SSD1306_GotoXY(0,10);
	SSD1306_Puts(" BAM # vao Menu ",&Font_7x10, SSD1306_COLOR_WHITE);
	SSD1306_UpdateScreen();
}

void DisplayMenu1()
{
	SSD1306_Clear();
	SSD1306_GotoXY(0,0);
	SSD1306_Puts("A.THEM VAN TAY",&Font_7x10, SSD1306_COLOR_WHITE);
	SSD1306_GotoXY(0,10);
	SSD1306_Puts("B.XOA VAN TAY",&Font_7x10, SSD1306_COLOR_WHITE);
	SSD1306_GotoXY(0,20);
	SSD1306_Puts("C.THEM THE TU",&Font_7x10, SSD1306_COLOR_WHITE);
	SSD1306_GotoXY(0,30);
	SSD1306_Puts("D.XOA THE TU",&Font_7x10, SSD1306_COLOR_WHITE);
	SSD1306_UpdateScreen();
}

void DisplayInputID()
{
	SSD1306_Clear();
	SSD1306_GotoXY(0,0);
	SSD1306_Puts("   HAY NHAP ID",&Font_7x10, SSD1306_COLOR_WHITE);
	SSD1306_UpdateScreen();
}

void DisplayCardFound(uint8_t CardFound)
{
	SSD1306_GotoXY(0,50);
	SSD1306_Puts("XAC NHAN THE      ",&Font_7x10, SSD1306_COLOR_WHITE);
	SSD1306_GotoXY(40,35);
	if(CardFound<100) SSD1306_Putc(' ',&Font_7x10, SSD1306_COLOR_WHITE);
	else SSD1306_Putc(CardFound/100+48,&Font_7x10, SSD1306_COLOR_WHITE);
	if(CardFound<10) SSD1306_Putc(' ',&Font_7x10, SSD1306_COLOR_WHITE);
	else SSD1306_Putc((CardFound%100)/10+48,&Font_7x10, SSD1306_COLOR_WHITE);
  SSD1306_Putc((CardFound%10)+48,&Font_7x10, SSD1306_COLOR_WHITE);
	SSD1306_UpdateScreen();
	HAL_Delay(1000);
}

void DisplayCardNotFound()
{
		SSD1306_GotoXY(0,50);
	  SSD1306_Puts("THE KHONG HOP LE",&Font_7x10, SSD1306_COLOR_WHITE);
  	SSD1306_UpdateScreen();
}

void DisplayCardSaveSuccess()
{
	SSD1306_GotoXY(0,50);
	SSD1306_Puts("    DA LUU THE ",&Font_7x10, SSD1306_COLOR_WHITE);
  SSD1306_UpdateScreen();
	HAL_Delay(1000);
}

void DisplayCardSDeleteSuccess()
{
	SSD1306_GotoXY(0,50);
	SSD1306_Puts("    DA XOA THE ",&Font_7x10, SSD1306_COLOR_WHITE);
  SSD1306_UpdateScreen();
	HAL_Delay(1000);
}
void DisplayInputNewCard()
{
		SSD1306_GotoXY(0,50);
	  SSD1306_Puts("HAY DUA THE VAO",&Font_7x10, SSD1306_COLOR_WHITE);
  	SSD1306_UpdateScreen();
}



// ham cam bien van tay

void SendFPHeader()
{
	HAL_UART_Transmit(&huart1,FPHeader,6,1000);
}

void SendFPGetImage()
{
	 HAL_UART_Transmit(&huart1,FPGetImage,6,1000);
}

void SendFPCreateCharFile1()
{
	HAL_UART_Transmit(&huart1,FPCreateCharFile1,7,1000);
}

void SendFPCreateCharFile2()
{
	HAL_UART_Transmit(&huart1,FPCreateCharFile2,7,1000);
}

void SendFPCreateTemplate()
{
	HAL_UART_Transmit(&huart1,FPCreateTemplate,6,1000);
}

void SendFPDeleteAllFinger()
{
	HAL_UART_Transmit(&huart1,FPDeleteAllFinger,6,1000);
}

void SendFPDSearchFinger()
{
	HAL_UART_Transmit(&huart1,FPSearchFinger,11,1000);
}

void SendFGetNumberOfFinger()
{
	HAL_UART_Transmit(&huart1,FPGetNumberOfFinger,6,1000);
}

void SendStoreFinger(uint16_t IDStore)
{
	uint16_t Sum=0;
	uint8_t DataSend[9]={0};
	
	DataSend[0]=0x01;
	Sum=Sum+DataSend[0];
	DataSend[1]=0x00;
	Sum=Sum+DataSend[1];
	DataSend[2]=0x06;
	Sum=Sum+DataSend[2];
	DataSend[3]=0x06;
	Sum=Sum+DataSend[3];
	DataSend[4]=0x01;
	Sum=Sum+DataSend[4];
	DataSend[5]= (uint8_t)(IDStore>> 8);
	Sum=Sum+DataSend[5];
	DataSend[6]=(uint8_t) (IDStore&0xFF);
	Sum=Sum+DataSend[6];
  DataSend[7]=(uint8_t)(Sum>> 8);
	DataSend[8]=(uint8_t)(Sum&0xFF);
	HAL_UART_Transmit(&huart1,DataSend,9,1000);
}

void SendDeleteFinger(uint16_t IDDelete)
{
	uint16_t Sum=0;
	uint8_t DataSend[10]={0};
	
	DataSend[0]=0x01;
	Sum=Sum+DataSend[0];
	DataSend[1]=0x00;
	Sum=Sum+DataSend[1];
	DataSend[2]=0x07;
	Sum=Sum+DataSend[2];
	DataSend[3]=0x0C;
	Sum=Sum+DataSend[3];
	DataSend[4]=(uint8_t)(IDDelete>> 8);
	Sum=Sum+DataSend[4];
	DataSend[5]= (uint8_t) (IDDelete&0xFF);
	Sum=Sum+DataSend[5];
	DataSend[6]=0x00;
	Sum=Sum+DataSend[6];
	DataSend[7]=0x001;
	Sum=Sum+DataSend[7];
  DataSend[8]=(uint8_t)(Sum>> 8);
	DataSend[9]=(uint8_t)(Sum&0xFF);
	HAL_UART_Transmit(&huart1,DataSend,10,1000);
}




uint8_t CheckFPRespsone(uint8_t MaxRead)
{
	uint8_t ByteCount=0;
	uint8_t FPRXData[20]={0xFF};
	uint8_t UARTData[1]={0};
	uint32_t TimeOut = HAL_GetTick();
	uint8_t Result;
	IDFromFinger=0xFF;
	while((HAL_GetTick() - TimeOut < 1000) && ByteCount<MaxRead) // time out is 100 ms
	{
	    if(HAL_UART_Receive(&huart1, (uint8_t *)UARTData, 1, 1000) == HAL_OK)
			{
				FPRXData[ByteCount] = UARTData[0];
				ByteCount++;
			}
	}
	
	if(ByteCount==0)
	{
		//FPRXData[0]=0xEE;
		//FPRXData[1]=0xEE;
		//HAL_UART_Transmit(&huart2,FPRXData,2,1000);
		Result=FP_ERROR;
		return Result;
	}
	else if(ByteCount<MaxRead)
	{
		Result=FP_ERROR;
		return Result;
	}
	  else // vail data return
	{
		 
		 Result=FPRXData[9];
		 IDFromFinger=FPRXData[11];
	   //HAL_UART_Transmit(&huart2,FPRXData,MaxRead,1000);
		 return Result;
		 
	}
}

uint8_t GetNumberOfFinger()
{
	uint8_t Result;
	SendFPHeader();
	SendFGetNumberOfFinger();
	Result=CheckFPRespsone(14);
	if(Result!=FP_OK) return 0xFF;
	
	return IDFromFinger;
}


void DeleteOneFinger(uint16_t FingerID)
{
	uint8_t FingerResult;
	SendFPHeader();
	SendDeleteFinger(FingerID);
	FingerResult=CheckFPRespsone(12);
	if(FingerResult==FP_OK)
	{
		printf("DELETE FINGER Success at ID %d \r\n",FingerID);
		DisplayDeleteSuccess();
		HAL_Delay(2000);
	}
	else
	{
		printf("DELETE FINGER failed!!! at ID %d \r\n",FingerID);
		DisplayFingerfailure();
		HAL_Delay(2000);
	}
}


uint8_t RegistryNewFinger(uint16_t LocationID)
{
	
	uint8_t Result=FP_NOFINGER;
	uint32_t TimeOut = HAL_GetTick();
	

	DisplayPutFinger();
	
	while(Result==FP_NOFINGER&&(HAL_GetTick() - TimeOut < 5000)) // time out is 5000 ms
	{
		
		SendFPHeader();
		SendFPGetImage();
		Result=CheckFPRespsone(12);
	}
	if(Result!=FP_OK) return FP_ERROR;
	// continue if detect finger;
	SendFPHeader();
	SendFPCreateCharFile1();
	Result=CheckFPRespsone(12);
	if(Result!=FP_OK) return FP_ERROR;
	
	// second get image
	DisplayRemoveFinger();
	
	HAL_Delay(2000);
	Result=FP_NOFINGER;
	TimeOut = HAL_GetTick();
	
	DisplayPutFingerAgain();
	
	while(Result==FP_NOFINGER&&(HAL_GetTick() - TimeOut < 5000)) // time out is 5000 ms
	{
		
		SendFPHeader();
		SendFPGetImage();
		Result=CheckFPRespsone(12);
	}
	if(Result!=FP_OK) return FP_ERROR;
	
	// continue if detect finger;
	SendFPHeader();
	SendFPCreateCharFile2();
	Result=CheckFPRespsone(12);
	if(Result!=FP_OK) return FP_ERROR;
	
	// Compare finger, create template
	SendFPHeader();
	SendFPCreateTemplate();
	Result=CheckFPRespsone(12);
	if(Result==FP_FINGER_NOTMATCH) 
	{
		
		return FP_FINGER_NOTMATCH;
	}
	else if(Result!=FP_OK) return FP_ERROR;
	
	// save finger
	SendFPHeader();
	SendStoreFinger(LocationID);
	Result=CheckFPRespsone(12);
	if(Result!=FP_OK) return FP_ERROR;
	else 
	{
		return FP_OK;
	}
	
}

uint8_t CheckFinger()
{
	uint8_t Result=FP_NOFINGER;
	uint32_t TimeOut = HAL_GetTick();

	
	while(Result==FP_NOFINGER&&(HAL_GetTick() - TimeOut < 1000)&&ScanKey()!=KEYHASH) // time out is 1000 ms and no button press
	{
		
		SendFPHeader();
		SendFPGetImage();
		Result=CheckFPRespsone(12);
	}
	if(Result==FP_NOFINGER) return FP_NOFINGER;
	if(Result!=FP_OK) return FP_ERROR;
	// continue if detect finger;
	SendFPHeader();
	SendFPCreateCharFile1();
	Result=CheckFPRespsone(12);
	if(Result!=FP_OK) return FP_ERROR;
	
	// Search Fingger
	SendFPHeader();
	SendFPDSearchFinger();
	Result=CheckFPRespsone(16);
	return Result;
	
	
}



uint8_t ProcessRegistryNewFinger(uint16_t LocationID)
{
  uint8_t FingerResult;
  DisplayFingerRegis();
	HAL_Delay(1000);
  FingerResult=RegistryNewFinger(LocationID);
	if(FingerResult==FP_OK)
	{
		DisplayRegisFingerSuccess();
		CurrentNumberFinger++;
		if(CurrentNumberFinger==100) CurrentNumberFinger=1;
		HAL_Delay(1500);
	}
	else if(FingerResult==FP_FINGER_NOTMATCH)
	{
		DisplayFingerNotMatch();
		HAL_Delay(1000);
	}
	else
	{
		DisplayFingerfailure();
		HAL_Delay(1000);
	}
	return FingerResult;
		
}

void DeleteAllFinger()
{

	uint8_t FingerResult;
	SendFPHeader();
	SendFPDeleteAllFinger();
	FingerResult=CheckFPRespsone(12);
	if(FingerResult==FP_OK)
	{
		DisplayDeleteSuccess();
		CurrentNumberFinger=0;
		HAL_Delay(2000);
	}
	else
	{
		DisplayFingerfailure();
		HAL_Delay(1500);
	}
			
}

uint8_t CheckRFID()
{
	uint8_t i;
	for(i=0;i<MAXCARD;i++)
	{
		if(CardID[0]==DataCard[i][0]&&CardID[1]==DataCard[i][1]&&CardID[2]==DataCard[i][2]&&CardID[3]==DataCard[i][3]&&CardID[4]==DataCard[i][4])
		{
			return i+1;
		}
	}
	if(i==MAXCARD) return 0;
	return 0;
}

void SaveNewCard(uint8_t CardSave)
{
	DataCard[CardSave-1][0]=CardID[0];
	DataCard[CardSave-1][1]=CardID[1];
	DataCard[CardSave-1][2]=CardID[2];
	DataCard[CardSave-1][3]=CardID[3];
	DataCard[CardSave-1][4]=CardID[4];
	CardStatus[CardSave-1]=1;
	
	DisplayCardSaveSuccess();
	WriteDataFlash();
}

void DeleteCard(uint8_t CardDelete)
{
	DataCard[CardDelete-1][0]=0xFF;
	DataCard[CardDelete-1][1]=0xFF;
	DataCard[CardDelete-1][2]=0xFF;
	DataCard[CardDelete-1][3]=0xFF;
	DataCard[CardDelete-1][4]=0xFF;
	CardStatus[CardDelete-1]=0;
	
	DisplayCardSDeleteSuccess();
	WriteDataFlash();
}

void Delay_us(uint32_t TimeDelay)
{
	uint32_t TimeCount;
	for(TimeCount=0;TimeCount<TimeDelay;TimeCount++)
	{
		__ASM volatile ("NOP");
		__ASM volatile ("NOP");
		__ASM volatile ("NOP");
	}
}


void CloseDoor()
{
		HAL_GPIO_WritePin(GPIOA,GPIO_PIN_12,GPIO_PIN_SET);
	  Delay_us(1000);
	  HAL_GPIO_WritePin(GPIOA,GPIO_PIN_12,GPIO_PIN_RESET);
	  DoorStatus=0; 
}

void OpenDoor()
{
		HAL_GPIO_WritePin(GPIOA,GPIO_PIN_12,GPIO_PIN_SET);
	  Delay_us(2100);
	  HAL_GPIO_WritePin(GPIOA,GPIO_PIN_12,GPIO_PIN_RESET);
	  DoorStatus=1;
}


/* USER CODE END 0 */

/**
  * @brief  The application entry point.
  * @retval int
  */
int main(void)
{
  /* USER CODE BEGIN 1 */
	 uint8_t FingerResult;
	uint8_t FoundCard;
  uint8_t  i;
	
  int KeyCode;
	
	

  /* USER CODE END 1 */

  /* MCU Configuration--------------------------------------------------------*/

  /* Reset of all peripherals, Initializes the Flash interface and the Systick. */
  HAL_Init();

  /* USER CODE BEGIN Init */

  /* USER CODE END Init */

  /* Configure the system clock */
  SystemClock_Config();

  /* USER CODE BEGIN SysInit */
   
  /* USER CODE END SysInit */

  /* Initialize all configured peripherals */
  MX_GPIO_Init();
  MX_SPI1_Init();
  MX_USART1_UART_Init();
  MX_I2C1_Init();
  MX_USART2_UART_Init();
  MX_USART3_UART_Init();
  /* USER CODE BEGIN 2 */
	
	HAL_UART_Receive_IT(&huart2, (uint8_t*) ESPReceiveData, 1); // bat che do ngat UART esp
	 SSD1306_Init();
	 
	TM_MFRC522_Init();

	 /*
	 DataCard[0][0]=0xB9;
	 DataCard[0][1]=0x5E;
	 DataCard[0][2]=0x93;
	 DataCard[0][3]=0x84;
	 DataCard[0][4]=0x82;
	 
	 CardStatus[0]=1;
   CardStatus[4]=1;
	 */

		FingerTimeCount=HAL_GetTick();
		TimeCount=HAL_GetTick();
		
		DisplayStart();
		//WriteDataFlash();
		ReadDataFlash();
		DisplayWelcome();
		CurrentNumberFinger=GetNumberOfFinger();
		if(CurrentNumberFinger>100) 
		{
			CurrentNumberFinger=1;
		}
	  printf("START\r\n");
		OpenDoor();
		HAL_Delay(1000);
		CloseDoor();
		HAL_Delay(1000);
  /* USER CODE END 2 */

  /* Infinite loop */
  /* USER CODE BEGIN WHILE */
  while (1)
  {
		if(UARTDataCome==1)		
		{
			UARTDataCome=0;
			printf("ESP:");
			for(i=0;i<5;i++)
			{
				printf("%02X ", ESPReceiveBuffer[i]);
			}
			if(ESPReceiveBuffer[0]==ADDFINGER)
			{
				      CurrentID=ESPReceiveBuffer[1];
							if(CurrentID>0)
							{
								ProcessRegistryNewFinger(CurrentID);
								HAL_Delay(1000);
						  }
							CurrentState=STAMAIN;
							DisplayWelcome();
				
			}
			else if(ESPReceiveBuffer[0]==ADDRFID)
			{
				      CurrentID=ESPReceiveBuffer[1];
							CurrentState=STAINPUTNEWCARD;
							DisplayInputNewCard();
				
			}
			else if(ESPReceiveBuffer[0]==DELETEFINGER)
			{
				      CurrentID=ESPReceiveBuffer[1];
				      if(CurrentID>0)
							{
								DeleteOneFinger(CurrentID);
						  }
							CurrentState=STAMAIN;
							DisplayWelcome();
				
			}
			else if(ESPReceiveBuffer[0]==DELETERFID)
			{
				      CurrentID=ESPReceiveBuffer[1];
				      if(CurrentID>0)
							{
								DeleteCard(CurrentID);
								HAL_Delay(1000);
						  }
							CurrentState=STAMAIN;
							DisplayWelcome();
				
			}
			

		}
		
		if(HAL_GetTick()-TimeCount>3000)
		{
			if(CurrentState==STAMAIN)
			{
				DisplayWelcome();
				TimeCount=HAL_GetTick();
				if(DoorStatus==1) CloseDoor();
			}
		}
	
		if(HAL_GetTick()-FingerTimeCount>200)
		{
			if(CurrentState==STAMAIN)
			{
					FingerResult=CheckFinger();
					if(FingerResult==FP_OK)
					{
						SendESPData(LOGFINGER,IDFromFinger);
						DisplayFingerFound();
						OpenDoor();
						TimeCount=HAL_GetTick();
					}
					else if(FingerResult==FP_FINGER_NOTFOUND)
					{
						DisplayFingerNotFound();
						TimeCount=HAL_GetTick();
					}
		  }
			FingerTimeCount=HAL_GetTick();
		}
		
	
		
    /* USER CODE END WHILE */

    /* USER CODE BEGIN 3 */
		
		
		if (TM_MFRC522_Check(CardID) == MI_OK) 
		{ 
			  //DisplayCardID();
			  if(CurrentState==STAMAIN)
				{
					
					TimeCount=HAL_GetTick();
					FoundCard=CheckRFID();
					if(FoundCard>0) 
					{
						DisplayCardFound(FoundCard);
						SendESPData(LOGRFID,FoundCard);
						OpenDoor();
					}
					else DisplayCardNotFound();
			  }
				else if(CurrentState==STAINPUTNEWCARD)
				{
					if(CurrentID>0) 
					{
						SaveNewCard(CurrentID);
					}
					CurrentState=STAMAIN;
					DisplayWelcome();
				}
		}
		
		KeyCode=ScanKey();
		if(KeyCode!=NOKEY)
		{
			
				switch(KeyCode)
				{
					case KEY0:
					case KEY1:
					case KEY2:
					case KEY3:
					case KEY4:
					case KEY5:
					case KEY6:
					case KEY7:
					case KEY8:
					case KEY9:
					{
						
						if(CurrentState==STAINPUTFGNEWID||CurrentState==STAINPUTFGDELETEID||CurrentState==STAINPUTNEWCARDID||CurrentState==STAINPUTDELETECARDID)
						{
							

							 CurrentID=CurrentID*10+KeyCode;
							 if(CurrentID>100) CurrentID=0;
							
							 SSD1306_GotoXY(40,30);
							 SSD1306_Puts("    ",&Font_7x10, SSD1306_COLOR_WHITE);
						   SSD1306_GotoXY(40,30);
							 if(CurrentID<100)  SSD1306_Putc(' ',&Font_7x10, SSD1306_COLOR_WHITE);
							 else SSD1306_Putc((CurrentID/100)+48,&Font_7x10, SSD1306_COLOR_WHITE);
							 if(CurrentID<10)  SSD1306_Putc(' ',&Font_7x10, SSD1306_COLOR_WHITE);
							 else SSD1306_Putc(((CurrentID%100)/10)+48,&Font_7x10, SSD1306_COLOR_WHITE);
							 SSD1306_Putc((CurrentID%10)+48,&Font_7x10, SSD1306_COLOR_WHITE);
							 SSD1306_UpdateScreen();
						}
						break;
					}
					case KEYHASH:
					{
						
						
						if(CurrentState==STAMAIN) 
						{
							CurrentState=STAMENU1;
							DisplayMenu1();
						}
						else if(CurrentState==STAINPUTFGNEWID) 
						{
							if(CurrentID>0)
							{
								ProcessRegistryNewFinger(CurrentID);
								HAL_Delay(1000);
						  }
							CurrentState=STAMAIN;
							DisplayWelcome();
						}
						else  if(CurrentState==STAINPUTFGDELETEID) 
						{
							if(CurrentID>0)
							{
								DeleteOneFinger(CurrentID);
						  }
							CurrentState=STAMAIN;
							DisplayWelcome();
						}
						else if(CurrentState==STAINPUTNEWCARDID)
						{
							CurrentState=STAINPUTNEWCARD;
							DisplayInputNewCard();
						}
						else if(CurrentState==STAINPUTDELETECARDID) 
						{
							if(CurrentID>0)
							{
								DeleteCard(CurrentID);
								HAL_Delay(1000);
						  }
							CurrentState=STAMAIN;
							DisplayWelcome();
						}
			
						
						break;
					}
					case KEYSTAR: // bam phim sao de tro ve man hinh chinh
					{
						
						
						if(CurrentState!=STAMAIN)
						{
							DisplayInputID();
							CurrentID=0;
						}
							
							break;
							
						
					}
					case KEYA: 
					{
						if(CurrentState==STAMENU1)
						{
							CurrentState=STAINPUTFGNEWID;
							DisplayInputID();
							CurrentID=0;

						}
							break;
					}
					case KEYB: 
					{
						if(CurrentState==STAMENU1)
						{
							CurrentState=STAINPUTFGDELETEID;
							DisplayInputID();
							CurrentID=0;

						}
							break;
					}
					case KEYC: 
					{
						if(CurrentState==STAMENU1)
						{
							CurrentState=STAINPUTNEWCARDID;
							DisplayInputID();
							CurrentID=0;

						}
							break;
					}
					case KEYD: 
					{
						if(CurrentState==STAMENU1)
						{
							CurrentState=STAINPUTDELETECARDID;
							DisplayInputID();
							CurrentID=0;

						}
							break;
					}
					
					
					
					
							
			}
			
		}
		
			
		
  }
  /* USER CODE END 3 */
}

/**
  * @brief System Clock Configuration
  * @retval None
  */
void SystemClock_Config(void)
{
  RCC_OscInitTypeDef RCC_OscInitStruct = {0};
  RCC_ClkInitTypeDef RCC_ClkInitStruct = {0};

  /** Initializes the RCC Oscillators according to the specified parameters
  * in the RCC_OscInitTypeDef structure.
  */
  RCC_OscInitStruct.OscillatorType = RCC_OSCILLATORTYPE_HSE;
  RCC_OscInitStruct.HSEState = RCC_HSE_ON;
  RCC_OscInitStruct.PLL.PLLState = RCC_PLL_NONE;
  if (HAL_RCC_OscConfig(&RCC_OscInitStruct) != HAL_OK)
  {
    Error_Handler();
  }

  /** Initializes the CPU, AHB and APB buses clocks
  */
  RCC_ClkInitStruct.ClockType = RCC_CLOCKTYPE_HCLK|RCC_CLOCKTYPE_SYSCLK
                              |RCC_CLOCKTYPE_PCLK1|RCC_CLOCKTYPE_PCLK2;
  RCC_ClkInitStruct.SYSCLKSource = RCC_SYSCLKSOURCE_HSE;
  RCC_ClkInitStruct.AHBCLKDivider = RCC_SYSCLK_DIV1;
  RCC_ClkInitStruct.APB1CLKDivider = RCC_HCLK_DIV1;
  RCC_ClkInitStruct.APB2CLKDivider = RCC_HCLK_DIV1;

  if (HAL_RCC_ClockConfig(&RCC_ClkInitStruct, FLASH_LATENCY_0) != HAL_OK)
  {
    Error_Handler();
  }
}

/**
  * @brief I2C1 Initialization Function
  * @param None
  * @retval None
  */
static void MX_I2C1_Init(void)
{

  /* USER CODE BEGIN I2C1_Init 0 */

  /* USER CODE END I2C1_Init 0 */

  /* USER CODE BEGIN I2C1_Init 1 */

  /* USER CODE END I2C1_Init 1 */
  hi2c1.Instance = I2C1;
  hi2c1.Init.ClockSpeed = 400000;
  hi2c1.Init.DutyCycle = I2C_DUTYCYCLE_2;
  hi2c1.Init.OwnAddress1 = 0;
  hi2c1.Init.AddressingMode = I2C_ADDRESSINGMODE_7BIT;
  hi2c1.Init.DualAddressMode = I2C_DUALADDRESS_DISABLE;
  hi2c1.Init.OwnAddress2 = 0;
  hi2c1.Init.GeneralCallMode = I2C_GENERALCALL_DISABLE;
  hi2c1.Init.NoStretchMode = I2C_NOSTRETCH_DISABLE;
  if (HAL_I2C_Init(&hi2c1) != HAL_OK)
  {
    Error_Handler();
  }
  /* USER CODE BEGIN I2C1_Init 2 */

  /* USER CODE END I2C1_Init 2 */

}

/**
  * @brief SPI1 Initialization Function
  * @param None
  * @retval None
  */
static void MX_SPI1_Init(void)
{

  /* USER CODE BEGIN SPI1_Init 0 */

  /* USER CODE END SPI1_Init 0 */

  /* USER CODE BEGIN SPI1_Init 1 */

  /* USER CODE END SPI1_Init 1 */
  /* SPI1 parameter configuration*/
  hspi1.Instance = SPI1;
  hspi1.Init.Mode = SPI_MODE_MASTER;
  hspi1.Init.Direction = SPI_DIRECTION_2LINES;
  hspi1.Init.DataSize = SPI_DATASIZE_8BIT;
  hspi1.Init.CLKPolarity = SPI_POLARITY_LOW;
  hspi1.Init.CLKPhase = SPI_PHASE_1EDGE;
  hspi1.Init.NSS = SPI_NSS_SOFT;
  hspi1.Init.BaudRatePrescaler = SPI_BAUDRATEPRESCALER_2;
  hspi1.Init.FirstBit = SPI_FIRSTBIT_MSB;
  hspi1.Init.TIMode = SPI_TIMODE_DISABLE;
  hspi1.Init.CRCCalculation = SPI_CRCCALCULATION_DISABLE;
  hspi1.Init.CRCPolynomial = 10;
  if (HAL_SPI_Init(&hspi1) != HAL_OK)
  {
    Error_Handler();
  }
  /* USER CODE BEGIN SPI1_Init 2 */

  /* USER CODE END SPI1_Init 2 */

}

/**
  * @brief USART1 Initialization Function
  * @param None
  * @retval None
  */
static void MX_USART1_UART_Init(void)
{

  /* USER CODE BEGIN USART1_Init 0 */

  /* USER CODE END USART1_Init 0 */

  /* USER CODE BEGIN USART1_Init 1 */

  /* USER CODE END USART1_Init 1 */
  huart1.Instance = USART1;
  huart1.Init.BaudRate = 57600;
  huart1.Init.WordLength = UART_WORDLENGTH_8B;
  huart1.Init.StopBits = UART_STOPBITS_1;
  huart1.Init.Parity = UART_PARITY_NONE;
  huart1.Init.Mode = UART_MODE_TX_RX;
  huart1.Init.HwFlowCtl = UART_HWCONTROL_NONE;
  huart1.Init.OverSampling = UART_OVERSAMPLING_16;
  if (HAL_UART_Init(&huart1) != HAL_OK)
  {
    Error_Handler();
  }
  /* USER CODE BEGIN USART1_Init 2 */

  /* USER CODE END USART1_Init 2 */

}

/**
  * @brief USART2 Initialization Function
  * @param None
  * @retval None
  */
static void MX_USART2_UART_Init(void)
{

  /* USER CODE BEGIN USART2_Init 0 */

  /* USER CODE END USART2_Init 0 */

  /* USER CODE BEGIN USART2_Init 1 */

  /* USER CODE END USART2_Init 1 */
  huart2.Instance = USART2;
  huart2.Init.BaudRate = 9600;
  huart2.Init.WordLength = UART_WORDLENGTH_8B;
  huart2.Init.StopBits = UART_STOPBITS_1;
  huart2.Init.Parity = UART_PARITY_NONE;
  huart2.Init.Mode = UART_MODE_TX_RX;
  huart2.Init.HwFlowCtl = UART_HWCONTROL_NONE;
  huart2.Init.OverSampling = UART_OVERSAMPLING_16;
  if (HAL_UART_Init(&huart2) != HAL_OK)
  {
    Error_Handler();
  }
  /* USER CODE BEGIN USART2_Init 2 */

  /* USER CODE END USART2_Init 2 */

}

/**
  * @brief USART3 Initialization Function
  * @param None
  * @retval None
  */
static void MX_USART3_UART_Init(void)
{

  /* USER CODE BEGIN USART3_Init 0 */

  /* USER CODE END USART3_Init 0 */

  /* USER CODE BEGIN USART3_Init 1 */

  /* USER CODE END USART3_Init 1 */
  huart3.Instance = USART3;
  huart3.Init.BaudRate = 9600;
  huart3.Init.WordLength = UART_WORDLENGTH_8B;
  huart3.Init.StopBits = UART_STOPBITS_1;
  huart3.Init.Parity = UART_PARITY_NONE;
  huart3.Init.Mode = UART_MODE_TX_RX;
  huart3.Init.HwFlowCtl = UART_HWCONTROL_NONE;
  huart3.Init.OverSampling = UART_OVERSAMPLING_16;
  if (HAL_UART_Init(&huart3) != HAL_OK)
  {
    Error_Handler();
  }
  /* USER CODE BEGIN USART3_Init 2 */

  /* USER CODE END USART3_Init 2 */

}

/**
  * @brief GPIO Initialization Function
  * @param None
  * @retval None
  */
static void MX_GPIO_Init(void)
{
  GPIO_InitTypeDef GPIO_InitStruct = {0};
/* USER CODE BEGIN MX_GPIO_Init_1 */
/* USER CODE END MX_GPIO_Init_1 */

  /* GPIO Ports Clock Enable */
  __HAL_RCC_GPIOC_CLK_ENABLE();
  __HAL_RCC_GPIOD_CLK_ENABLE();
  __HAL_RCC_GPIOA_CLK_ENABLE();
  __HAL_RCC_GPIOB_CLK_ENABLE();

  /*Configure GPIO pin Output Level */
  HAL_GPIO_WritePin(GPIOC, GPIO_PIN_13, GPIO_PIN_RESET);

  /*Configure GPIO pin Output Level */
  HAL_GPIO_WritePin(GPIOA, GPIO_PIN_4|GPIO_PIN_12, GPIO_PIN_RESET);

  /*Configure GPIO pin Output Level */
  HAL_GPIO_WritePin(GPIOB, GPIO_PIN_12|GPIO_PIN_13|GPIO_PIN_14|GPIO_PIN_15
                          |GPIO_PIN_4, GPIO_PIN_RESET);

  /*Configure GPIO pin : PC13 */
  GPIO_InitStruct.Pin = GPIO_PIN_13;
  GPIO_InitStruct.Mode = GPIO_MODE_OUTPUT_PP;
  GPIO_InitStruct.Pull = GPIO_NOPULL;
  GPIO_InitStruct.Speed = GPIO_SPEED_FREQ_LOW;
  HAL_GPIO_Init(GPIOC, &GPIO_InitStruct);

  /*Configure GPIO pins : PA0 PA1 */
  GPIO_InitStruct.Pin = GPIO_PIN_0|GPIO_PIN_1;
  GPIO_InitStruct.Mode = GPIO_MODE_INPUT;
  GPIO_InitStruct.Pull = GPIO_PULLUP;
  HAL_GPIO_Init(GPIOA, &GPIO_InitStruct);

  /*Configure GPIO pins : PA4 PA12 */
  GPIO_InitStruct.Pin = GPIO_PIN_4|GPIO_PIN_12;
  GPIO_InitStruct.Mode = GPIO_MODE_OUTPUT_PP;
  GPIO_InitStruct.Pull = GPIO_NOPULL;
  GPIO_InitStruct.Speed = GPIO_SPEED_FREQ_LOW;
  HAL_GPIO_Init(GPIOA, &GPIO_InitStruct);

  /*Configure GPIO pins : PB12 PB13 PB14 PB15
                           PB4 */
  GPIO_InitStruct.Pin = GPIO_PIN_12|GPIO_PIN_13|GPIO_PIN_14|GPIO_PIN_15
                          |GPIO_PIN_4;
  GPIO_InitStruct.Mode = GPIO_MODE_OUTPUT_PP;
  GPIO_InitStruct.Pull = GPIO_NOPULL;
  GPIO_InitStruct.Speed = GPIO_SPEED_FREQ_LOW;
  HAL_GPIO_Init(GPIOB, &GPIO_InitStruct);

  /*Configure GPIO pins : PB5 PB8 PB9 */
  GPIO_InitStruct.Pin = GPIO_PIN_5|GPIO_PIN_8|GPIO_PIN_9;
  GPIO_InitStruct.Mode = GPIO_MODE_INPUT;
  GPIO_InitStruct.Pull = GPIO_PULLUP;
  HAL_GPIO_Init(GPIOB, &GPIO_InitStruct);

/* USER CODE BEGIN MX_GPIO_Init_2 */
/* USER CODE END MX_GPIO_Init_2 */
}

/* USER CODE BEGIN 4 */

/* USER CODE END 4 */

/**
  * @brief  This function is executed in case of error occurrence.
  * @retval None
  */
void Error_Handler(void)
{
  /* USER CODE BEGIN Error_Handler_Debug */
  /* User can add his own implementation to report the HAL error return state */

  /* USER CODE END Error_Handler_Debug */
}

#ifdef  USE_FULL_ASSERT
/**
  * @brief  Reports the name of the source file and the source line number
  *         where the assert_param error has occurred.
  * @param  file: pointer to the source file name
  * @param  line: assert_param error line source number
  * @retval None
  */
void assert_failed(uint8_t *file, uint32_t line)
{
  /* USER CODE BEGIN 6 */
  /* User can add his own implementation to report the file name and line number,
     tex: printf("Wrong parameters value: file %s on line %d\r\n", file, line) */
  /* USER CODE END 6 */
}
#endif /* USE_FULL_ASSERT */
