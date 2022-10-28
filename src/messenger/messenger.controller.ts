import { MessengerService } from './messenger.service';
import { Request, Response } from 'express';
import {
  Controller,
  Get,
  Post,
  Body,
  Res,
  Query,
  Logger,
  HttpException,
  Req,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetWebhookQueryDTO } from './dto/messenger.dto';
import { config } from '../config/configuration';

@ApiTags('Affiliate')
@Controller('messenger')
export class MessengerController {
  private logger = new Logger(`${MessengerController.name}`);
  constructor(private readonly messengerService: MessengerService) {}

  @Post('/webhook')
  async postWebhook(@Body() body: any, @Res() res: Response) {
    try {
      this.logger.log(`${this.postWebhook.name} Body:${JSON.stringify(body)}`);
      this.logger.log(`\u{1F7EA} Received webhook:`);
      console.dir(body, { depth: null });

      if (body.object === 'page') {
        body.entry.forEach(async (entry) => {
          // Get the webhook event. entry.messaging is an array, but
          // will only ever contain one event, so we get index 0
          const webhook_event = entry.messaging[0];
          this.logger.log(
            `${this.postWebhook.name} Webhook Event: ${JSON.stringify(
              webhook_event,
            )}`,
          );

          const sender_psid = webhook_event.sender.id;
          this.logger.log(
            `${this.postWebhook.name} Sender PSID: :${sender_psid}`,
          );

          if (webhook_event.message) {
            await this.messengerService.handleMessage(
              sender_psid,
              webhook_event.message,
            );
          } else if (webhook_event.postback) {
            await this.messengerService.handlePostback(
              sender_psid,
              webhook_event.postback,
            );
          }
        });

        // Returns a '200 OK' response to all requests
        return res.status(200).send('EVENT_RECEIVED');
        // Determine which webhooks were triggered and get sender PSIDs and locale, message content and more.
      } else {
        // Return a '404 Not Found' if event is not from a page subscription
        return res.sendStatus(404);
      }
    } catch (error) {
      this.logger.error(`${this.postWebhook.name}: ${error.message}`);
      throw new HttpException(error, error.status || 500);
    }
  }

  @Get('/webhook')
  getWebhook(@Res() res: Response, @Query() query: GetWebhookQueryDTO) {
    try {
      const mode = query['hub.mode'];
      const token = query['hub.verify_token'];
      const challenge = query['hub.challenge'];
      this.logger.log(
        `${this.getWebhook.name} Query:${JSON.stringify({ mode, challenge })}`,
      );

      // Checks if a token and mode is in the query string of the request
      if (mode && token) {
        // Checks the mode and token sent is correct
        if (mode === 'subscribe' && token === config.facebook.verifyToken) {
          // Responds with the challenge token from the request
          this.logger.log(`${this.getWebhook.name} -> WEBHOOK_VERIFIED`);
          return res.status(200).send(challenge);
        } else {
          // Responds with '403 Forbidden' if verify tokens do not match
          return res.sendStatus(403);
        }
      }
      return res.sendStatus(403);
    } catch (error) {
      this.logger.error(`${this.getWebhook.name}: ${error.message}`);
      throw new HttpException(error, error.status || 500);
    }
  }

  @Post('setup-messenger-profile')
  async setupMessengerProfile(@Req() req: Request, @Res() res: Response) {
    try {
      this.logger.log(`${this.setupMessengerProfile.name} called`);
      await this.messengerService.setupMessengerProfile();
      return res.status(200).json({
        success: true,
        message: 'setup messenger profile successfully',
      });
    } catch (error) {
      this.logger.error(`${this.setupMessengerProfile.name} called`);
      throw new HttpException(error, error.status || 500);
    }
  }
}
