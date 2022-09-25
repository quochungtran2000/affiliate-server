import { ApiProperty } from '@nestjs/swagger';
import {
  IsBooleanString,
  IsIn,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';
import { DEFAULT_PAGE, DEFAULT_PAGESIZE } from 'src/config/configuration';

export class GetCouponQueryDTO {
  @ApiProperty({
    type: Number,
    description: 'Số trang',
    required: false,
  })
  @IsOptional()
  @IsNumberString()
  page: number;

  @ApiProperty({
    type: Number,
    description: 'Số item trên một trang',
    required: false,
  })
  @IsOptional()
  @IsNumberString()
  pageSize: number;

  @ApiProperty({
    type: Boolean,
    description:
      'True => lấy danh sách mã giảm giá sắp diễn ra, False => Lấy danh sách mã giảm giá đang diễn ra',
    required: false,
  })
  @IsBooleanString()
  @IsOptional()
  isUpcomingCoupon: boolean;

  @ApiProperty({
    type: String,
    description: 'Từ khóa tìm kiếm',
    required: false,
  })
  @IsString()
  @IsOptional()
  keyword: string;

  @ApiProperty({
    type: String,
    description: 'Mã id nhà cung cấp',
    required: false,
  })
  @IsString()
  @IsOptional()
  merchant: string;

  @ApiProperty({
    type: String,
    description: 'Url sản phẩm. Cung cấp khi tìm kiếm mã giảm giá theo url',
    required: false,
  })
  @IsString()
  @IsOptional()
  url: string;

  limit: number;
  is_next_day_coupon: 'True' | 'False';

  public static toGetCouponQuery(dto: Partial<GetCouponQueryDTO>) {
    const query = new GetCouponQueryDTO();
    query.page = Number(dto.page || DEFAULT_PAGE);
    query.limit = Number(dto.pageSize || DEFAULT_PAGESIZE);
    query.is_next_day_coupon = Boolean(dto.isUpcomingCoupon) ? 'True' : 'False';
    query.keyword = dto.keyword || '';
    query.merchant = dto.merchant || '';
    return query;
  }

  public static toGetCouponByUrl(dto: Partial<GetCouponQueryDTO>) {
    const query = new GetCouponQueryDTO();
    query.page = Number(dto.page) || DEFAULT_PAGE;
    query.limit = Number(dto.pageSize) || DEFAULT_PAGESIZE;
    query.url = dto.url || '';
    return query;
  }
}

export enum GetHotCouponEnum {
  WEEK = 'week',
  MONTH = 'month',
}

export class GetHotCouponQueryDTO {
  @ApiProperty({
    type: Number,
    description: 'Số trang',
    required: false,
  })
  @IsOptional()
  @IsNumberString()
  page: number;

  @ApiProperty({
    type: Number,
    description: 'Số item trên một trang',
    required: false,
  })
  @IsOptional()
  @IsNumberString()
  pageSize: number;

  @ApiProperty({
    type: String,
    description:
      'Lấy mã khuyễn mãi hot theo tuần hoặc tháng("week" or "month")',
    required: true,
    enum: GetHotCouponEnum,
    default: GetHotCouponEnum.MONTH,
  })
  @IsOptional()
  @IsIn([GetHotCouponEnum.MONTH, GetHotCouponEnum.WEEK])
  getBy: GetHotCouponEnum;

  limit: number;
  date: 1 | 2;

  public static toGetHotCoupon(dto: Partial<GetHotCouponQueryDTO>) {
    const query = new GetHotCouponQueryDTO();
    query.page = Number(dto.page) || DEFAULT_PAGE;
    query.limit = Number(dto.pageSize) || DEFAULT_PAGESIZE;
    const getBy: GetHotCouponEnum = dto.getBy || GetHotCouponEnum.MONTH;
    query.date = getBy === GetHotCouponEnum.WEEK ? 1 : 2;
    return query;
  }
}
