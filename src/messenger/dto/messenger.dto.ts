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
          title: 'Ưu đãi từ highland coffee',
          payload: POSTBACK.SEARCH_HIGHLAND_COUPON,
        },
        {
          type: 'postback',
          title: 'Tra cứu theo nơi bán',
          payload: POSTBACK.SEARCH_BY_MERCHANT,
        },
        {
          type: 'postback',
          title: 'Tra cứu theo liên kết sản phẩm',
          payload: POSTBACK.SEARCH_BY_PRODUCT_LINK,
        },
        {
          type: 'web_url',
          title: 'Tham khảo thêm tại website',
          url: 'https://hunghamhoc.com/',
          webview_height_ratio: 'full',
        },
      ],
    },
  ],
  greeting: [
    {
      locale: 'default',
      text: 'Hội săn mã xin chào {{user_full_name}}, chúng tôi sẽ giúp bạn tìm được mã giảm giá phù hợp.',
    },
  ],
  ice_breakers: [
    {
      call_to_actions: [
        {
          question: 'Ưu đãi hot trong tuần',
          payload: POSTBACK.WEEKLY_HOT_COUPON,
        },
        {
          question: 'Ưu đãi dành cho highland coffee',
          payload: POSTBACK.SEARCH_HIGHLAND_COUPON,
        },
        {
          question: 'Tìm kiếm Ưu đãi trên tiki, lazada, shopee',
          payload: POSTBACK.SEARCH_BY_MERCHANT,
        },
        {
          question: 'Hướng dẫn sử dụng chatbot',
          payload: POSTBACK.TUTOTIAL,
        },
      ],
      locale: 'default',
    },
  ],
};
