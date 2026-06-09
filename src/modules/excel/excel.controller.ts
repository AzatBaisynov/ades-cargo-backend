// import {
//   BadRequestException,
//   Controller,
//   Post,
//   UploadedFile,
//   UseInterceptors,
// } from '@nestjs/common';
// import { FileInterceptor } from '@nestjs/platform-express';
// import { memoryStorage } from 'multer';
// import { ExcelService } from './excel.service';

// @Controller('excel')
// export class ExcelController {
//   constructor(private readonly excelService: ExcelService) {}

//   @Post('upload')
//   @UseInterceptors(
//     FileInterceptor('file', {
//       storage: memoryStorage(),

//       limits: {
//         fileSize: 10 * 1024 * 1024,
//       },

//       fileFilter: (req, file, cb) => {
//         const allowedMimeTypes = [
//           'application/vnd.ms-excel',
//           'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
//         ];

//         const ext = file.originalname.toLowerCase().split('.').pop();

//         const isExcel =
//           allowedMimeTypes.includes(file.mimetype) &&
//           ['xls', 'xlsx'].includes(ext ?? '');

//         if (!isExcel) {
//           return cb(
//             new BadRequestException(
//               'Разрешены только Excel файлы (.xls, .xlsx)',
//             ),
//             false,
//           );
//         }

//         cb(null, true);
//       },
//     }),
//   )
//   async uploadExcel(@UploadedFile() file: Express.Multer.File) {
//     if (!file) {
//       throw new BadRequestException('Файл не был загружен');
//     }

//     return this.excelService.parseExcel(file.buffer);
//   }
// }
