import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UtilsService } from 'src/shared/services/utils/utils.service';
import PrismaService from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [AuthController],
  providers: [AuthService, UtilsService, PrismaService, JwtService]
})
export class AuthModule {}
