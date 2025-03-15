import { Module } from '@nestjs/common';
import PrismaService from 'src/prisma.service';
import { UtilsService } from 'src/shared/services/utils/utils.service';
import { JwtService } from '@nestjs/jwt';
import { ProductoController } from './producto.controller';
import { ProductoService } from './producto.service';

@Module({
  controllers: [ProductoController],
  providers: [ProductoService, PrismaService, UtilsService, JwtService]
})
export class ProductoModule {}
