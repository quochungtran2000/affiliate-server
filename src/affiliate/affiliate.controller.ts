import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AffiliateService } from 'src/affiliate/affiliate.service';
import {
  Controller,
  Get,
  Res,
  Req,
  HttpException,
  Logger,
  Query,
} from '@nestjs/common';
import {
  GetCouponQueryDTO,
  GetHotCouponQueryDTO,
} from './dto/affiliate-query.dto';

@ApiTags('Affiliate')
@Controller('affiliate')
export class AffiliateController {
  private readonly logger = new Logger(`${AffiliateController.name}`);
  constructor(private readonly affiliateService: AffiliateService) {}

  @ApiOperation({ summary: 'Lấy danh sách nhà cung cấp mã khuyễn mãi' })
  @Get('/merchant')
  async getMerchants(@Res() res: Response) {
    try {
      this.logger.log(`${this.getMerchants.name} called`);
      const result = await this.affiliateService.getMerchants();
      return res.status(200).json(result);
    } catch (error) {
      this.logger.error(`${this.getMerchants.name}: ${error.message}`);
      throw new HttpException(error, error.status || 500);
    }
  }

  // @Get('/merchant/:merchant/coupon')
  // async getCouponByMerchant(@Res() res: Response) {
  //   try {
  //     this.logger.log(`${this.getCouponByMerchant.name} called`);
  //     const result = await this.affiliateService.getCouponByMerchant();
  //     return res.status(200).json(result);
  //   } catch (error) {
  //     this.logger.error(`${this.getCouponByMerchant.name}: ${error.message}`);
  //     throw new HttpException(error, error.status || 500);
  //   }
  // }
  @ApiOperation({ summary: 'Lấy danh sách mã khuyễn mãi' })
  @Get('/coupon')
  async getCoupons(@Res() res: Response, @Query() query: GetCouponQueryDTO) {
    try {
      this.logger.log(`${this.getCoupons.name} called`);
      const result = await this.affiliateService.getCoupons(
        GetCouponQueryDTO.toGetCouponQuery(query),
      );
      return res.status(200).json(result);
    } catch (error) {
      this.logger.error(`${this.getCoupons.name}: ${error.message}`);
      throw new HttpException(error, error.status || 500);
    }
  }

  @ApiOperation({ summary: 'Lấy danh sách mã khuyễn mãi hot' })
  @Get('/hot-coupon')
  async getHotCoupon(
    @Res() res: Response,
    @Query() query: GetHotCouponQueryDTO,
  ) {
    try {
      this.logger.log(`${this.getHotCoupon.name} called`);
      const result = await this.affiliateService.getHotCoupon(
        GetHotCouponQueryDTO.toGetHotCoupon(query),
      );
      return res.status(200).json(result);
    } catch (error) {
      this.logger.error(`${this.getHotCoupon.name}: ${error.message}`);
      throw new HttpException(error, error.status || 500);
    }
  }
}
