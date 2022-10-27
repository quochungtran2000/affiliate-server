import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/common';
import { config } from '../config/configuration';
@Injectable()
export class MessengerService {
  private readonly logger = new Logger(`${MessengerService.name}`);
  constructor(private readonly httpService: HttpService) {}
  // Handles messages events
  handleMessage(sender_psid, received_message) {
    let response;

    // Checks if the message contains text
    if (received_message.text) {
      // Create the payload for a basic text message, which
      // will be added to the body of our request to the Send API
      response = {
        text: `You sent the message: "${received_message.text}". Now send me an attachment!`,
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
    this.callSendAPI(sender_psid, response);
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
  callSendAPI(sender_psid, response) {
    const request_body = {
      recipient: {
        id: sender_psid,
      },
      message: response,
    };

    // Send the HTTP request to the Messenger Platform
    const url = `https://graph.facebook.com/v2.6/me/messages?access_token=${config.facebook.verifyToken}`;
    this.httpService
      .post(url, request_body)
      .toPromise()
      .then(() => this.logger.log(`${this.callSendAPI.name}`))
      .catch((error) =>
        this.logger.error(
          `${this.callSendAPI.name} Error: ${JSON.stringify(error)}`,
        ),
      );
  }
}
