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
  constructor(
    private readonly httpService: HttpService,
    private readonly messengerRepo: MessengerRepo,
  ) {}
  // Handles messages events
  async handleMessage(sender_psid, received_message) {
    try {
      // const userProfile = await this.getUserInfo(sender_psid);
      let response;

      // Checks if the message contains text
      if (received_message.text) {
        // Create the payload for a basic text message, which
        // will be added to the body of our request to the Send API
        response = {
          text: `{{user_full_name}} sent the message: "${received_message.text}"`,
        };
      }
      // else if (received_message.attachments) {
      //   // Get the URL of the message attachment
      //   const attachment_url = received_message.attachments[0].payload.url;
      //   response = {
      //     attachment: {
      //       type: 'template',
      //       payload: {
      //         template_type: 'generic',
      //         elements: [
      //           {
      //             title: 'Is this the right picture?',
      //             subtitle: 'Tap a button to answer.',
      //             image_url: attachment_url,
      //             buttons: [
      //               {
      //                 type: 'postback',
      //                 title: 'Yes!',
      //                 payload: 'yes',
      //               },
      //               {
      //                 type: 'postback',
      //                 title: 'No!',
      //                 payload: 'no',
      //               },
      //             ],
      //           },
      //         ],
      //       },
      //     },
      //   };
      // }

      // Sends the response message
      if (response) await this.callSendAPI(sender_psid, response);
    } catch (error) {
      this.logger.error(`${this.getUserInfo.name} : ${error.message}`);
    }
  }

  // Handles messaging_postbacks events
  async handlePostback(sender_psid, received_postback) {
    let response;

    // Get the payload for the postback
    const payload = received_postback.payload;

    // Set the response based on the postback payload
    switch (payload) {
      case POSTBACK.SEARCH_BY_MERCHANT: {
        break;
      }
      case POSTBACK.SEARCH_BY_PRODUCT_LINK: {
        break;
      }
      case POSTBACK.SEARCH_HIGHLAND_COUPON: {
        response = await this.handleSearchHighlandCoupon();
        break;
      }
      case POSTBACK.WEEKLY_HOT_COUPON: {
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

      this.logger.log(
        `${this.callSendAPI.name} Payload: ${JSON.stringify(request_body)}`,
      );
      // Send the HTTP request to the Messenger Platform
      const url = `https://graph.facebook.com/v2.6/me/messages?access_token=${config.facebook.verifyToken}`;
      return await this.httpService.post(url, request_body).toPromise();
    } catch (error) {
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
    const message = await this.messengerRepo.getMessage('HIGHLAND_COFFEE');
    return message.data || '';
  }
}
