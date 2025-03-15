import { Module } from '@nestjs/common';
import PrismaService from 'src/prisma.service';
import { VentaController } from './venta.controller';
import { VentaService } from './venta.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [VentaController],
  providers: [VentaService, PrismaService, JwtService]
})
export class VentaModule {}
