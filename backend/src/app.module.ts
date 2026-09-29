import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { BullModule } from "@nestjs/bullmq";
import { AppController } from "./app.controller.js";
import { ScheduleModule } from "@nestjs/schedule";
import { initializeAuth } from "./auth/auth.service.js";
import { LearningPathsModule } from "./modules/learning-paths/learning-paths.module.js";
import { ChaptersModule } from "./modules/chapters/chapters.module.js";
import { AiModule } from "./modules/ai/ai.module.js";
import { AssessmentsModule } from "./modules/assessments/assessments.module.js";
import { ChallengesModule } from "./modules/challenges/challenges.module.js";
import { DashboardModule } from "./modules/dashboard/dashboard.module.js";
import { StreaksModule } from "./modules/streaks/streaks.module.js";
import { NotificationsModule } from "./modules/notifications/notifications.module.js";

import { validate } from "./config/env.validation.js";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
      validate,
    }),
    ScheduleModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>("MONGODB_URI"),
        dbName: configService.get<string>("DB_NAME"),
        serverSelectionTimeoutMS: 10000,
        retryAttempts: 2,
        connectionFactory: (connection) =>
          initializeAuth(connection, validate(process.env)),
      }),
      inject: [ConfigService],
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        connection: {
          host: configService.get<string>("REDIS_HOST", "localhost"),
          port: configService.get<number>("REDIS_PORT", 6379),
          password: configService.get<string>("REDIS_PASSWORD"),
          tls:
            configService.get<string>("REDIS_TLS") === "true" ? {} : undefined,
        },
      }),
      inject: [ConfigService],
    }),
    LearningPathsModule,
    ChaptersModule,
    AiModule,
    AssessmentsModule,
    ChallengesModule,
    DashboardModule,
    StreaksModule,
    NotificationsModule,
  ],

  controllers: [AppController],
})
export class AppModule {}
