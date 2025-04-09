import { Controller, Post, Get, Delete, Param, Body } from '@nestjs/common';
import { CarritoService } from './carrito.service';
import { CreateCarritoDto } from './dto/create-carrito.dto';

@Controller('api/carrito')
export class CarritoController {
  constructor(private readonly carritoService: CarritoService) {}

  @Post()
  createCarrito(@Body() createCarritoDto: CreateCarritoDto) {
    return this.carritoService.agregarProductoAlCarrito(createCarritoDto);
  }

  @Get(':cveUsuario')
  obtenerCarrito(@Param('cveUsuario') cveUsuario: number) {
    return this.carritoService.obtenerCarrito(cveUsuario);
  }

  @Delete(':cveUsuario/:cveProducto')
  eliminarProductoDelCarrito(
    @Param('cveUsuario') cveUsuario: number,
    @Param('cveProducto') cveProducto: number
  ) {
    return this.carritoService.eliminarProductoDelCarrito(cveUsuario, cveProducto);
  }

  @Post('insertarDesdeCarrito/:cveUsuario')
  insertarDesdeCarrito(@Param('cveUsuario') cveUsuario: number) {
    return this.carritoService.insertarDesdeCarrito(cveUsuario);
  }
  
}