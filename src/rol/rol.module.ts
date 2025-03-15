import { Module } from '@nestjs/common';
import PrismaService from 'src/prisma.service';
import { RolController } from './rol.controller';
import { RolService } from './rol.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [RolController],
  providers: [RolService, PrismaService, JwtService]
})
export class RolModule {}
