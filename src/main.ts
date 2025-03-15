import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //Configuracion de Validation (Pipe)
app.useGlobalPipes(new ValidationPipe({
  whitelist: true
}));

//Configuracion de SWAGGER
  const config = new DocumentBuilder ()
  .setTitle('Sistema Ventas API')
  .setDescription ('Api para el control de un sistema de ventas al publico')
  .setVersion ('1.0')
  .addTag ('api')
  .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  //Configuracion de CORS
  app.enableCors();
  
  await app.listen(3000);
}
bootstrap();
