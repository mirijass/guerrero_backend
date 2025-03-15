import { Module } from '@nestjs/common';
import { UsuarioController } from './usuario.controller';
import { UsuarioService } from './usuario.service';
import PrismaService from 'src/prisma.service';
import { UtilsService } from 'src/shared/services/utils/utils.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [UsuarioController],
  providers: [UsuarioService, PrismaService, UtilsService, JwtService]
})
export class UsuarioModule {}
