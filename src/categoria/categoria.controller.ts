import { BadRequestException, Body, Controller, Delete, Get, Param, ParseBoolPipe, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { CategoriaDto } from './dto/categoria.dto';
import { CategoriaService } from './categoria.service';

@Controller('api/categoria')
export class CategoriaController {

    constructor(private categoriaSvc: CategoriaService){}


    @Get('/')
    async listarCategorias(){
        return await this.categoriaSvc.listar();
    }

    @Get('/activas')
    async listarCategoriasActivas(){
        return await this.categoriaSvc.listarActivas();
    }


    @Post('/')
    async insertarCategorias(@Body() categoria:CategoriaDto){

        //TODO:Si el username existe
        const productos = await this.categoriaSvc.verificarCategoriaPorNombre(categoria.descripcion);
        if(productos.length > 0){
            throw new BadRequestException ('No se puede insertar la categoria, ya existe una con el mismo nombre');
        }
        return await this.categoriaSvc.Insertar(categoria);
    }

    @Patch(':cveCategoria')
    async actualizarCategorias(@Param('cveCategoria', ParseIntPipe )cveCategoria: number, @Body() categoria: CategoriaDto){

        //TODO:Si el username existe
        const productos = await this.categoriaSvc.verificarCategoriaPorNombre(categoria.descripcion);
        if(productos.length > 0){
            if(productos[0].cveCategoria!=cveCategoria){
                throw new BadRequestException ('No se puede actualizar la categoria, ya existe una con el mismo nombre');
            }
            
        }

        return await this.categoriaSvc.actualizar(cveCategoria, categoria);
    }

    @Delete(':cveCategoria')
    async eliminarCategorias(@Param('cveCategoria', ParseIntPipe)cveCategoria: number){
        //TODO:Si el username existe
        const productos = await this.categoriaSvc.verificarProductos(cveCategoria);
        if(productos.length > 0){
            throw new BadRequestException ('No se puede eliminar la categoria, tiene productos asigandos');
        }
        
        return await this.categoriaSvc.eliminar(cveCategoria);
    }

    @Patch(':cveCategoria/:estatus')
    async cambiarEstatusCategoria(@Param('cveCategoria', ParseIntPipe)cveCategoria: number, @Param('estatus', ParseBoolPipe) estatus: boolean){
        return await this.categoriaSvc.cambiarEstatus(cveCategoria, estatus);
    }
}
