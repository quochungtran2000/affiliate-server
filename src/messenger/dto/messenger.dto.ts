import { ApiProperty } from '@nestjs/swagger';

export class GetWebhookQueryDTO {
  @ApiProperty()
  'hub.mode': string;

  @ApiProperty()
  'hub.verify_token': string;

  @ApiProperty()
  'hub.challenge': string | number;
}
