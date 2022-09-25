import { AppService } from './app.service';
import { Controller, Get, Logger } from '@nestjs/common';

@Controller()
export class AppController {
  private logger = new Logger(`Affiliate-${AppController.name}`);
  constructor(
    private readonly appService: AppService, // private readonly httpService: HttpService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
