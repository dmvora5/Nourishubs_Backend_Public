import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import { ParentSignUpDto, SchoolSignUpDto, SignUpDto, VendorSignUpDto } from './api/v1/auth/dto/signUp.dto';
import { ConfigService } from '@nestjs/config';

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    })
    .setTitle("Nourishubs API Documentation")
    .setDescription("API documentation for Nourishubs")
    .setVersion("1.0")
    .build();

  const documentFactory = () => {
    const document = SwaggerModule.createDocument(app, config, {
      extraModels: [SignUpDto, SchoolSignUpDto, ParentSignUpDto, VendorSignUpDto],
    });

    document.paths = Object.keys(document.paths).reduce((paths, pathKey) => {
      const path = document.paths[pathKey];

      paths[pathKey] = Object.keys(path).reduce((methods, methodKey) => {
        const method = path[methodKey];

        method.parameters = [
          ...(method.parameters || []),
          {
            name: 'Accept-Language',
            in: 'header',
            description: 'Language for the response (e.g., en, fr, es)',
            required: false,
            schema: { type: 'string', default: 'en' },
          },
        ];

        methods[methodKey] = method;
        return methods;
      }, {});
      return paths;
    }, {});

    return document;
  };

  SwaggerModule.setup('swagger', app, documentFactory(), {
    swaggerOptions: {
      defaultModelsExpandDepth: -1,
    },
  });
}


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');

  app.enableCors({
    origin: ['http://localhost:3000', 'https://dev.nourishubs.com','https://nourishubs.com/en'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Baggage",
      "sentry-trace",
      "x-api-key",
      "Origin",
      'Accept-Language',
      'ngrok-skip-browser-warning'
    ],
  })


  setupSwagger(app);

  const configService = app.get(ConfigService);

  const port = configService.get<number>("PORT") || 8000;

  await app.listen(port);
}
bootstrap();
