import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { VentaService } from './venta.service';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/shared/guard/auth/auth.guard';
import { CreateVentaDto } from './dto/create-venta.dto';

@Controller('api/venta')
@ApiTags('Ventas')
@UseGuards(AuthGuard)
export class VentaController {

    constructor(private ventaSvc: VentaService){}

    @Get('/')
    async listarVentas(){
        return await this.ventaSvc.listar();
    }

    @Post()
    async insertarVenta(@Body() venta: CreateVentaDto) {
       
        //Todo: actualizar stock
        


        // Insertar usuario y devolver el usuario insertado
        return await this.ventaSvc.insertar(venta);

     }
}
