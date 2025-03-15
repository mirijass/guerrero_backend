import { Injectable } from '@nestjs/common';
import { CategoriaDto } from './dto/categoria.dto';
import PrismaService from 'src/prisma.service';

@Injectable()
export class CategoriaService {

    constructor(private prismaSvc: PrismaService){}

    async listar(){
        return await this.prismaSvc.categoria.findMany();
    }

    async listarActivas(){
        return await this.prismaSvc.categoria.findMany({
            where:{
                activo: true
            }
        });
    }


     async Insertar(categoria: CategoriaDto){
        return await this.prismaSvc.categoria.create({
            data:{
                descripcion: categoria.descripcion,
                activo: true

            }
        });
    }

     async actualizar(cveCategoria: number, categoria: CategoriaDto){
        console.log(categoria);
        console.log(cveCategoria)
        return await this.prismaSvc.categoria.update({
            where:{
                cveCategoria: cveCategoria
            },
            data: categoria
        });
    }


     async eliminar(cveCategoria: number){
        return await this.prismaSvc.categoria.delete({
            where: {
                cveCategoria: cveCategoria 
            }
        });
     }


     async cambiarEstatus(cveCategoria: number, estatus: boolean){
        return await this.prismaSvc.categoria.update({
            where: {
                cveCategoria: cveCategoria
            },
            data: {
                activo: estatus
            }
        });
     }

     async verificarProductos(cveCategoria: number){
        return await this.prismaSvc.producto.findMany({
            where:{
                cveCategoria: cveCategoria
            }
        });
     }

     async verificarCategoriaPorNombre(categoria: string){
        return await this.prismaSvc.categoria.findMany({
            where:{
                descripcion: categoria
            }
        });
     }
}