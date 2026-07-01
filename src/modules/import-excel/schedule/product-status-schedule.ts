import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductEntity } from '@/modules/product/product.entity';
import { ProductStatus } from '@/enums/product-status.enum';

@Injectable()
export class ProductScheduler {
  private readonly logger = new Logger(ProductScheduler.name);

  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}

  @Cron(CronExpression.EVERY_12_HOURS)
  async handleProductCleanup() {
    this.logger.log(
      '=== [КРОН] Запуск плановой очистки и обновления статусов ===',
    );

    await this.updateStatus();
    await this.deleteOldProducts();
  }

  private async updateStatus() {
    try {
      const twelveHoursAgo = new Date();
      twelveHoursAgo.setHours(twelveHoursAgo.getHours() - 12);

      const result = await this.productRepository
        .createQueryBuilder()
        .update(ProductEntity)
        .set({ status: ProductStatus.IN_TRANSIT })
        .where('status = :status', { status: ProductStatus.IN_CHINA })
        .andWhere('createdAt < :date', { date: twelveHoursAgo })
        .execute();

      this.logger.log(
        `Авто-отправка: ${result.affected} товаров переведены из IN_CHINA в IN_TRANSIT.`,
      );
    } catch (error) {
      this.logger.error('Ошибка при авто-отправке товаров из Китая:', error);
    }
  }

  private async deleteOldProducts() {
    try {
      const fiveYearsAgo = new Date();
      fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5);

      const result = await this.productRepository
        .createQueryBuilder()
        .delete()
        .from(ProductEntity)
        .where('createdAt < :date', { date: fiveYearsAgo })
        .execute();

      this.logger.log(
        `[КРОН] Из БД успешно удалено ${result.affected} товаров старше 5 лет.`,
      );
    } catch (error) {
      this.logger.error(
        'Ошибка при автоматическом удалении старых товаров:',
        error,
      );
    }
  }

  @Cron('0 0 */16 * *')
  async handleProductClean() {
    this.logger.log(
      '=== [КРОН] Запуск плановой очистки товаров с статусом "Прибыл в Бишкек" ===',
    );
    await this.cleanProducts();
  }
  private async cleanProducts() {
    try {
      const fifteensDayAgo = new Date();
      fifteensDayAgo.setDate(fifteensDayAgo.getDate() - 15);
      const deleteProduct = await this.productRepository
        .createQueryBuilder()
        .delete()
        .from(ProductEntity)
        .where('status = :status', { status: ProductStatus.ARRIVED_BISHKEK })
        .andWhere('createdAt < :date', { date: fifteensDayAgo })
        .execute();
      this.logger.log(
        `[КРОН] Из БД успешно удалено ${deleteProduct.affected} товаров старше 15 дней. `,
      );
    } catch (err) {
      this.logger.log(
        'Ошибка при автоматическом удалении старых товаров:',
        err,
      );
    }
  }
}
