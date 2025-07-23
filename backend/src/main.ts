import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS 설정 (Render 배포용)
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://localhost:3000',
      process.env.FRONTEND_URL,
      /\.vercel\.app$/,
      /\.render\.com$/,
      /\.onrender\.com$/,
    ].filter(Boolean),
    credentials: true,
  });

  // 글로벌 검증 파이프 설정
  app.useGlobalPipes(new ValidationPipe());

  // Swagger 설정 (개발 환경에서만)
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('SoccerSquad API')
      .setDescription('축구 동호회 관리 시스템 API')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, document);
  }

  const port = process.env.PORT || 3001;
  await app.listen(port);
  
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? `https://your-app.onrender.com` 
    : `http://localhost:${port}`;
    
  console.log(`🚀 SoccerSquad Backend is running on: ${baseUrl}`);
  
  if (process.env.NODE_ENV !== 'production') {
    console.log(`📚 API Documentation: ${baseUrl}/api-docs`);
  }
}

bootstrap(); 