import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/common';
import { config } from '../config/configuration';
import { FacebookUserInfo } from './dto/messenger.dto';
@Injectable()
export class MessengerService {
  private readonly logger = new Logger(`${MessengerService.name}`);
  constructor(private readonly httpService: HttpService) {}
  // Handles messages events
  async handleMessage(sender_psid, received_message) {
    try {
      const userProfile = await this.getUserInfo(sender_psid);
      let response;

      // Checks if the message contains text
      if (received_message.text) {
        // Create the payload for a basic text message, which
        // will be added to the body of our request to the Send API
        response = {
          text: `${userProfile.name || 'You'} sent the message: "${
            received_message.text
          }". Now send me an attachment!`,
        };
      } else if (received_message.attachments) {
        // Get the URL of the message attachment
        const attachment_url = received_message.attachments[0].payload.url;
        response = {
          attachment: {
            type: 'template',
            payload: {
              template_type: 'generic',
              elements: [
                {
                  title: 'Is this the right picture?',
                  subtitle: 'Tap a button to answer.',
                  image_url: attachment_url,
                  buttons: [
                    {
                      type: 'postback',
                      title: 'Yes!',
                      payload: 'yes',
                    },
                    {
                      type: 'postback',
                      title: 'No!',
                      payload: 'no',
                    },
                  ],
                },
              ],
            },
          },
        };
      }

      // Sends the response message
      return await this.callSendAPI(sender_psid, response);
    } catch (error) {
      this.logger.error(`${this.getUserInfo.name} : ${error.message}`);
    }
  }

  // Handles messaging_postbacks events
  handlePostback(sender_psid, received_postback) {
    let response;

    // Get the payload for the postback
    const payload = received_postback.payload;

    // Set the response based on the postback payload
    if (payload === 'yes') {
      response = { text: 'Thanks!' };
    } else if (payload === 'no') {
      response = { text: 'Oops, try sending another image.' };
    }
    // Send the message to acknowledge the postback
    this.callSendAPI(sender_psid, response);
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

      const get_started = {
        get_started: {
          payload: 'GET_STARTED',
        },
      };

      const greeting = {
        greeting: [
          {
            locale: 'default',
            text: 'Hello!',
          },
          {
            locale: 'en_US',
            text: 'Timeless apparel for the masses.',
          },
        ],
      };
      const persistent_menu = {
        persistent_menu: [
          {
            locale: 'default',
            composer_input_disabled: false,
            call_to_actions: [
              {
                type: 'postback',
                title: 'Talk to an agent',
                payload: 'CARE_HELP',
              },
              {
                type: 'postback',
                title: 'Outfit suggestions',
                payload: 'CURATION',
              },
              {
                type: 'web_url',
                title: 'Shop now',
                url: 'https://www.originalcoastclothing.com/',
                webview_height_ratio: 'full',
              },
            ],
          },
        ],
      };

      const url = `https://graph.facebook.com/v15.0/me/messenger_profile?access_token=${config.facebook.verifyToken}`;
      const payload = {
        ...persistent_menu,
        ...greeting,
        ...get_started,
      };
      return await this.httpService.post(url, payload).toPromise();
    } catch (error) {
      this.logger.error(`${this.getUserInfo.name} : ${error.message}`);
      return {};
    }
  }
}
