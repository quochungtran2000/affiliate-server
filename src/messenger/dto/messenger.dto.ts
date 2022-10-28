import { ApiProperty } from '@nestjs/swagger';

export class GetWebhookQueryDTO {
  @ApiProperty()
  'hub.mode': string;

  @ApiProperty()
  'hub.verify_token': string;

  @ApiProperty()
  'hub.challenge': string | number;
}

export type FacebookUserInfo = {
  name: string;
  first_name: string;
  last_name: string;
  profile_pic: string;
  id: string;
};

export enum MessengerProfileEnum {
  GET_STARTED = 'get_started',
  GREETING = 'greeting',
  ice_breakers = 'ice_breakers',
  persistent_menu = 'persistent_menu',
  whitelisted_domains = 'whitelisted_domains',
  account_linking_url = 'account_linking_url',
}

export class SetupMessengerProfileDTO {
  get_started: any;
  greeting: any[];
  ice_breakers: any[];
  persistent_menu: any[];
  whitelisted_domains: string[];
  account_linking_url: string;
}
