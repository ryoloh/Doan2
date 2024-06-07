#include "FLASH.h"

void FLASH_WritePage(uint32_t startPage, uint32_t endPage, uint64_t data)
{
	HAL_FLASH_Unlock();
	FLASH_EraseInitTypeDef EraseInit;
	EraseInit.TypeErase = FLASH_TYPEERASE_PAGES;
	EraseInit.PageAddress = startPage;
	EraseInit.NbPages = (endPage - startPage) / FLASH_PAGE_SIZE;
	uint32_t PageError = 0;
	HAL_FLASHEx_Erase(&EraseInit, &PageError);
	HAL_FLASH_Program(FLASH_TYPEPROGRAM_DOUBLEWORD, startPage, data);
	HAL_FLASH_Lock();
}
uint64_t FLASH_ReadData(uint32_t addr)
{
	uint64_t data = *(__IO uint32_t *)(addr + (uint32_t)0x00000004);
	data = (data << 32) | *(__IO uint32_t *)(addr);
	return data;
}

uint16_t Flash_Read2Byte(uint32_t addr)
{
	uint16_t data;
	data=*(__IO uint32_t*) addr;
	data = (data << 8) | *(__IO uint32_t *)(addr+1);
	return data;
}

uint8_t Flash_Read1Byte(uint32_t addr)
{
	uint8_t data;
	data=*(__IO uint32_t*) addr;
	return data;
}

void Flash_Write2Byte(uint32_t addr,uint16_t Data)
{
	HAL_FLASH_Unlock();
	HAL_FLASH_Program(FLASH_TYPEPROGRAM_HALFWORD, addr, Data);
	HAL_FLASH_Lock();
}

void FlashErasePage(uint32_t startPage)
{
	HAL_FLASH_Unlock();
	FLASH_EraseInitTypeDef EraseInit;
	EraseInit.TypeErase = FLASH_TYPEERASE_PAGES;
	EraseInit.PageAddress = startPage;
	EraseInit.NbPages = 1;
	uint32_t PageError = 0;
	HAL_FLASHEx_Erase(&EraseInit, &PageError);
	HAL_FLASH_Lock();
}
