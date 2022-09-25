import * as dotenv from 'dotenv';
dotenv.config();
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from './config/configuration';
import { AllExceptionsFilter } from './middleware/http-exception.filter';
import 'reflect-metadata';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AffiliateModule } from './affiliate/affiliate.module';

async function bootstrap() {
  const globalPrefix = 'api/v1';
  const port = config.env.port || 3000;

  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new AllExceptionsFilter());
  app.setGlobalPrefix(globalPrefix);

  const configDocument = new DocumentBuilder()
    .setTitle('Blog-Affiliate documantion')
    .setDescription('The blog-affiliate API description')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, configDocument, {
    include: [AppModule, AffiliateModule],
  });

  SwaggerModule.setup(`${globalPrefix}/document`, app, document);

  // await AppDataSource.initialize()
  //   .then(async () => {
  //     Logger.log('Data Source has been initialized!');
  //   })
  //   .catch((err) => {
  //     Logger.error('Error during Data Source initialization', err);
  //   });

  await app.listen(port, () => {
    Logger.log(`Listening at http://localhost:${port}/${globalPrefix}`);
    Logger.log(
      `Listening at http://localhost:${port}/${globalPrefix}/document`,
    );
  });
}
bootstrap();
