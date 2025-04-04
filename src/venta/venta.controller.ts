import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { VentaService } from './venta.service';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/shared/guard/auth/auth.guard';
import { CreateVentaDto } from './dto/create-venta.dto';

@Controller('carrito/venta')
@ApiTags('Ventas')
@UseGuards(AuthGuard)
export class VentaController {

    constructor(private ventaSvc: VentaService){}

    @Get('/')
    async listarVentas(){
        return await this.ventaSvc.listar();
    }

    @Get('usuario/:cveUsuario')
    async listarVentasPorUsuario(@Param('cveUsuario', ParseIntPipe) cveUsuario: number) {
        return await this.ventaSvc.listarPorUsuario(cveUsuario);
    }

    @Post()
    async insertarVenta(@Body() venta: CreateVentaDto) {
       
        //Todo: actualizar stock
        


        // Insertar usuario y devolver el usuario insertado
        return await this.ventaSvc.insertar(venta);

     }

     @Patch(':cveVenta/estado/:nuevoEstado')
     async cambiarEstadoVenta(
         @Param('cveVenta', ParseIntPipe) cveVenta: number,
         @Param('nuevoEstado') nuevoEstado: string,
     ) {
         return await this.ventaSvc.cambiarEstado(cveVenta, nuevoEstado);
     }
}
