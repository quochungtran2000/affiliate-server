import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/common';
import { MessengerRepo } from 'src/repository/messenger-repository';
import { config } from '../config/configuration';
import { POSTBACK } from './dto/post-back.enum';
import {
  FacebookUserInfo,
  SetupMessengerProfileData,
} from './dto/messenger.dto';

@Injectable()
export class MessengerService {
  private readonly logger = new Logger(`${MessengerService.name}`);
  private readonly urlRegex =
    /(https:\/\/shopee.vn|https:\/\/tiki.vn).[a-zA-Z0-9%\/\.\-\?\=\_\&\+]{2,}/g;
  // /(https:\/\/shopee.vn|https:\/\/www.lazada.vn|https:\/\/tiki.vn).[a-zA-Z0-9%\/\.\-\?\=\_\&\+]{2,}/g;
  constructor(
    private readonly httpService: HttpService,
    private readonly messengerRepo: MessengerRepo,
  ) {}
  // Handles messages events
  async handleMessage(sender_psid, received_message) {
    try {
      let response;
      this.logger.log(
        `${this.handleMessage.name} called Message:${JSON.stringify(response)}`,
      );
      console.log(received_message);

      // Checks if the message contains text
      if (received_message.text) {
        if (
          received_message.attachments &&
          received_message.attachments[0] &&
          received_message.attachments[0].type === 'fallback'
        ) {
          const urls = received_message.text.match(this.urlRegex);
          if (urls && urls.length) {
            const data = await this.httpService
              .get(
                `https://api.accesstrade.vn/v1/offers_informations/coupon?url=${urls[0]}&limit=10`,
                {
                  headers: {
                    authorization: `Token ${config.accessTrader.accessKey}`,
                  },
                },
              )
              .toPromise();
            if (data && data.data.status) {
              console.log(data.data?.data.length);

              const coupons = data.data?.data || [];
              console.log(coupons);
              if (coupons.length)
                response = {
                  text: `Có ${coupons.length} mã giảm giá có thể áp dụng. Xem thêm tại đây: https://hunghamhoc.com`,
                };
            }
          } else {
            response = {
              text: `Hiện tại chỉ hỗ trợ tìm kiếm coupon qua link của shopee và tiki!`,
            };
          }
        }
      }

      // Sends the response message
      if (response) await this.callSendAPI(sender_psid, response);
    } catch (error) {
      this.logger.error(`${this.handleMessage.name} : ${error.message}`);
    }
  }

  // Handles messaging_postbacks events
  async handlePostback(sender_psid, received_postback) {
    let response;

    // Get the payload for the postback
    const payload = received_postback.payload;

    // Set the response based on the postback payload
    switch (payload) {
      case POSTBACK.GET_STARTED: {
        response = await this.handleGettingStarted();
        break;
      }
      case POSTBACK.SEARCH_BY_MERCHANT: {
        response = await this.handleIncommingFeature();
        break;
      }
      case POSTBACK.SEARCH_BY_PRODUCT_LINK: {
        response = await this.handleIncommingFeature();
        break;
      }
      case POSTBACK.SEARCH_HIGHLAND_COUPON: {
        response = await this.handleSearchHighlandCoupon();
        break;
      }
      case POSTBACK.WEEKLY_HOT_COUPON: {
        response = await this.handleIncommingFeature();
        break;
      }
      case POSTBACK.TUTOTIAL: {
        break;
      }
      default: {
        this.logger.log(`${this.handlePostback.name} can't handler postback`);
      }
    }

    if (response) this.callSendAPI(sender_psid, response);
    // Send the message to acknowledge the postback
  }

  // Sends response messages via the Send API
  async callSendAPI(sender_psid, response): Promise<any> {
    try {
      const request_body = {
        recipient: {
          id: sender_psid,
        },
        message: response,
      };

      // this.logger.log(
      //   `${this.callSendAPI.name} Payload: ${JSON.stringify(request_body)}`,
      // );
      // Send the HTTP request to the Messenger Platform
      const url = `https://graph.facebook.com/v2.6/me/messages?access_token=${config.facebook.verifyToken}`;
      return await this.httpService.post(url, request_body).toPromise();
    } catch (error) {
      console.error(error);
      this.logger.error(`${this.getUserInfo.name} : ${error.message}`);
    }
  }

  async getUserInfo(PSID): Promise<FacebookUserInfo> {
    try {
      this.logger.log(`${this.getUserInfo.name} PSID: ${PSID}`);
      const url = `https://graph.facebook.com/${PSID}?fields=name,first_name,last_name,profile_pic&access_token=${config.facebook.verifyToken}`;
      const { data } = await this.httpService.get(url).toPromise<any>();
      this.logger.log(
        `${this.getUserInfo.name} Response: ${JSON.stringify(data)}`,
      );
      return data;
    } catch (error) {
      this.logger.error(`${this.getUserInfo.name} : ${error.message}`);
    }
  }

  async setupMessengerProfile(): Promise<any> {
    try {
      this.logger.log(`${this.setupMessengerProfile.name} called`);
      const url = `https://graph.facebook.com/v15.0/me/messenger_profile?access_token=${config.facebook.verifyToken}`;
      this.logger.log(JSON.stringify(SetupMessengerProfileData));

      return await this.httpService
        .post(url, SetupMessengerProfileData)
        .toPromise();
    } catch (error) {
      this.logger.error(
        `${this.setupMessengerProfile.name} : ${error.message}`,
      );
    }
  }

  async handleSearchHighlandCoupon() {
    this.logger.log(`${this.handleSearchHighlandCoupon.name} called`);
    const message = await this.messengerRepo.getMessage(
      POSTBACK.SEARCH_HIGHLAND_COUPON,
    );
    return message.data || '';
  }

  async handleGettingStarted() {
    this.logger.log(`${this.handleGettingStarted.name} called`);
    // const message = await this.messengerRepo.getMessage(POSTBACK.GET_STARTED);
    const message = {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'button',
          text: 'Vui lòng chọn chức năng',
          buttons: [
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
      },
    };
    return message;
  }

  async handleIncommingFeature() {
    this.logger.log(`${this.handleIncommingFeature.name} called`);
    const message = {
      text: `Chức năng này đang được phát triển xin vui lòng thử lại sau!`,
    };
    return message;
  }
}
