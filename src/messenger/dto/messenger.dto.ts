import { ApiProperty } from '@nestjs/swagger';
import { POSTBACK } from './post-back.enum';

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

export type PostBackButton = {
  type: 'postback';
  title: string;
  payload: string;
};

export type WebUrlPostBackButton = {
  type: 'web_url';
  url: string;
  title: string;
};

export type CallPostBackButton = {
  type: 'phone_number';
  title: string;
  payload: string;
};

export type PostbackButton =
  | PostBackButton
  | WebUrlPostBackButton
  | CallPostBackButton;

export type MessengerCard = {
  title?: string;
  image_url: string;
  subtitle: string;
  default_action: {
    type: string;
    url: string;
    webview_height_ratio: string;
  };
  buttons: PostbackButton[];
};

export type MediaCard = {
  media_type: 'image' | 'video';
  attachment_id: string;
};

export type GenericTemplate = {
  template_type: 'generic';
  elements: MessengerCard[];
};

export type ButtonTemplate = {
  template_type: 'button';
  text: string;
  buttons: PostbackButton[];
};

export type MediaTemplate = {
  template_type: 'media';
  elements: MediaCard[];
};

export type Attachment = {
  type: 'template';
  payload: GenericTemplate | ButtonTemplate | MediaTemplate;
};

export type TextMessage = {
  text: string;
};

export type AttachmentMessage = {
  attachment: Attachment;
};

export type MessengerMessage = TextMessage | AttachmentMessage;

export const SetupMessengerProfileData = {
  persistent_menu: [
    {
      locale: 'default',
      composer_input_disabled: false,
      call_to_actions: [
        {
          type: 'postback',
          title: '??u ????i t??? highland coffee',
          payload: POSTBACK.SEARCH_HIGHLAND_COUPON,
        },
        {
          type: 'postback',
          title: 'Tra c???u theo n??i b??n',
          payload: POSTBACK.SEARCH_BY_MERCHANT,
        },
        {
          type: 'postback',
          title: 'Tra c???u theo li??n k???t s???n ph???m',
          payload: POSTBACK.SEARCH_BY_PRODUCT_LINK,
        },
        {
          type: 'web_url',
          title: 'Tham kh???o th??m t???i website',
          url: 'https://hunghamhoc.com/',
          webview_height_ratio: 'full',
        },
      ],
    },
  ],
  greeting: [
    {
      locale: 'default',
      text: 'H???i s??n m?? xin ch??o {{user_full_name}}, ch??ng t??i s??? gi??p b???n t??m ???????c m?? gi???m gi?? ph?? h???p.',
    },
  ],
  ice_breakers: [
    {
      call_to_actions: [
        {
          question: '??u ????i hot trong tu???n',
          payload: POSTBACK.WEEKLY_HOT_COUPON,
        },
        {
          question: '??u ????i d??nh cho highland coffee',
          payload: POSTBACK.SEARCH_HIGHLAND_COUPON,
        },
        {
          question: 'T??m ki???m ??u ????i tr??n tiki, lazada, shopee',
          payload: POSTBACK.SEARCH_BY_MERCHANT,
        },
        {
          question: 'H?????ng d???n s??? d???ng chatbot',
          payload: POSTBACK.TUTOTIAL,
        },
      ],
      locale: 'default',
    },
  ],
};
