import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UtilsService } from './shared/services/utils/utils.service';
import { JwtService } from '@nestjs/jwt';
import { UsuarioModule } from './usuario/usuario.module';
import { CategoriaModule } from './categoria/categoria.module';
import { GeneralModule } from './general/general.module';
import { ProductoModule } from './productos/producto.module';
import { RolModule } from './rol/rol.module';
import { VentaModule } from './venta/venta.module';
import { CarritoModule } from './carrito/carrito.module';

@Module({
  imports: [AuthModule, UsuarioModule, CategoriaModule, GeneralModule, ProductoModule, RolModule, VentaModule, CarritoModule],
  controllers: [AppController],
  providers: [AppService, UtilsService, JwtService],
})
export class AppModule {}
