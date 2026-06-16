import { BadRequestException, Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import { ExcelCode } from './interfaces/interface.excel';
import { Buffer } from 'node:buffer';

@Injectable()
export class ExcelService {
  async parseExcel(fileBuffer: Buffer): Promise<ExcelCode[]> {
    const workbook = new ExcelJS.Workbook();

    await workbook.xlsx.load(fileBuffer as any);

    const worksheet = workbook.worksheets[0];

    if (!worksheet) {
      throw new BadRequestException('В загруженном файле нет листов');
    }

    const result: ExcelCode[] = [];

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) {
        return;
      }

      const clientCode = row.getCell(1).text;

      const productCode = row.getCell(2).text;

      if (clientCode && productCode) {
        result.push({
          customer_code: clientCode,
          product_code: productCode,
        });
      }
    });

    return result;
  }
}
