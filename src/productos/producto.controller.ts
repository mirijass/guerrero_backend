import { BadRequestException, Body, Controller, Delete, Get, Param, ParseBoolPipe, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UtilsService } from 'src/shared/services/utils/utils.service';
import { AuthGuard } from 'src/shared/guard/auth/auth.guard';
import { ProductoService } from './producto.service';
import { CreateProductoDto } from './dto/create-producto.dto';

@Controller('api/producto')
@ApiTags('Productos')
@UseGuards(AuthGuard)
export class ProductoController {

    constructor(private  productoSvc: ProductoService,
        private utilSvc: UtilsService){}

    @UseGuards(AuthGuard)
    @Get()
    async ListarProducto(){
        return await this. productoSvc.listarProductos();
     }

    @Post ()
    async insertarProducto(@Body() producto: CreateProductoDto) {

        //TODO:Si el producto existe
        const usernames = await this. productoSvc.verificarProducto(producto.descripcion);
        if(usernames.length > 0){
            throw new BadRequestException ('El nombre de Producto ya existe');
        }


        // Insertar Producto y devolver el Producto insertado
        return await this.productoSvc.insertar(producto);

     }

    @Patch (':cveProducto')
    async actualizarProducto(@Param('cveProducto', ParseIntPipe) cveProducto: number, @Body() Producto:CreateProductoDto){
        
        // //TODO: Verificar que el Producto existe
        const verifyUser = await this. productoSvc.verificarClave(cveProducto);
        if (verifyUser.length <= 0){
            throw new BadRequestException('El Producto no existe');
        }

        //TODO:Si el nombre del producto existe
        const usernames = await this.productoSvc.verificarProducto(Producto.descripcion);

        if(usernames.length > 0){
            if(usernames[0].cveProducto!=cveProducto){
                throw new BadRequestException ('No se puede actualizar el producto, ya existe uno con el mismo nombre');
            }
        }


        //Actualizar la informacion y devolver el Producto actualizado
        return await this. productoSvc.actualizar(cveProducto, Producto);
     }

    @Delete(':cveProducto')
    async eliminarProducto(@Param ('cveProducto', ParseIntPipe) cveProducto: number){

    //verificar que el Producto existe
    const verifyUser = await this. productoSvc.verificarClave(cveProducto);
    if (verifyUser.length <= 0) {
        throw new BadRequestException('El Producto no existe');
    }
        //Eliminar el Producto
        return await this.productoSvc.eliminar(cveProducto);
        
    }

    @Patch (':cveProducto/:estatus')
    async cambiarEstatus(@Param('cveProducto', ParseIntPipe) cveProducto: number, @Param('estatus', ParseBoolPipe) estatus: boolean){

        //Actualizar la informacion y devolver el Producto actualizado
        return await this. productoSvc.cambiarEstatus(cveProducto, estatus);
     }

    @Get('autocomplete')
    async autocomplete(@Query('q') query: string) {
        if (!query) {
            return [];
        }

        // Llamamos al servicio de autocompletado
        const suggestions = await this.productoSvc.autocompleteUserNames(query);
        return suggestions;
    }


}

