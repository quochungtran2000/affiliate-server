import { HttpException, Injectable, Logger, HttpService } from '@nestjs/common';
// import { HttpService } from '@nestjs/axios';
// import { firstValueFrom, map } from 'rxjs';
import {
  GetCouponQueryDTO,
  GetHotCouponQueryDTO,
} from './dto/affiliate-query.dto';
import * as queryString from 'query-string';

@Injectable()
export class AffiliateService {
  private readonly logger = new Logger(`${AffiliateService.name}`);
  private readonly affiliateApi = 'https://api.accesstrade.vn/v1';
  // private readonly headers = {
  //   headers: {
  //     Authorization: `Token ${config.accessTrader.accessKey}`,
  //   },
  // };

  constructor(private readonly httpService: HttpService) {}

  async getMerchants() {
    try {
      Logger.log(`${this.getMerchants.name} called`);
      // const merchants = await firstValueFrom(
      //   this.httpService
      //     .get(
      //       `${this.affiliateApi}/offers_informations/merchant_list`,
      //       this.headers,
      //     )
      //     .pipe(map((response) => response.data)),
      // );

      const { data: responseData } = await this.httpService
        .get(`${this.affiliateApi}/offers_informations/merchant_list`)
        .toPromise();

      return responseData;
    } catch (error) {
      this.logger.error(`${this.getMerchants.name}: ${error.message}`);
      throw new HttpException(`Can not get merchant list`, 400);
    }
  }

  async getCoupons(query: GetCouponQueryDTO) {
    try {
      Logger.log(`${this.getCoupons.name} Query:${JSON.stringify(query)}`);
      const url = queryString.stringifyUrl({
        url: `${this.affiliateApi}/offers_informations/coupon`,
        query: { ...query },
      });
      Logger.log(`${this.getCoupons.name} GET URl:${url}`);
      // const hostKeywords = await firstValueFrom(
      //   this.httpService
      //     .get(url, this.headers)
      //     .pipe(map((response) => response.data)),
      // );

      const { data: responseData } = await this.httpService
        .get(url)
        .toPromise();

      const { count, data } = responseData;
      return { count, data };
    } catch (error) {
      this.logger.error(`${this.getCoupons.name}: ${error.message}`);
      throw new HttpException(`Can not get coupons`, 400);
    }
  }

  async getHotCoupon(query: GetHotCouponQueryDTO) {
    try {
      Logger.log(`${this.getHotCoupon.name} called`);
      const url = queryString.stringifyUrl({
        url: `${this.affiliateApi}/offers_informations/coupon_hot`,
        query: { ...query },
      });
      Logger.log(`${this.getCoupons.name} GET URl:${url}`);

      const { data: responseData } = await this.httpService
        .get(url)
        .toPromise();

      const result = responseData.data.map((element) => {
        const { categories, ...data } = element;
        return data;
      });
      return result;
    } catch (error) {
      this.logger.error(`${this.getHotCoupon.name}: ${error.message}`);
      throw new HttpException(`Can not get hot coupons`, 400);
    }
  }
}
