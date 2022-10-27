import { MessengerService } from './messenger.service';
import { Response } from 'express';
import {
  Controller,
  Get,
  Post,
  Body,
  Res,
  Query,
  Logger,
  HttpException,
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
  postWebhook(@Body() body: any, @Res() res: Response) {
    try {
      this.logger.log(`${this.postWebhook.name} Body:${JSON.stringify(body)}`);
      this.logger.log(`\u{1F7EA} Received webhook:`);
      console.dir(body, { depth: null });

      if (body.object === 'page') {
        // Returns a '200 OK' response to all requests
        res.status(200).send('EVENT_RECEIVED');
        // Determine which webhooks were triggered and get sender PSIDs and locale, message content and more.
      } else {
        // Return a '404 Not Found' if event is not from a page subscription
        res.sendStatus(404);
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
}
