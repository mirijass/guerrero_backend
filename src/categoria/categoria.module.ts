import { Module } from '@nestjs/common';
import { CategoriaController } from './categoria.controller';
import { CategoriaService } from './categoria.service';
import PrismaService from 'src/prisma.service';

@Module({
  controllers: [CategoriaController],
  providers: [CategoriaService, PrismaService]
})
export class CategoriaModule {}
