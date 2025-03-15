import { Injectable } from '@nestjs/common';
import PrismaService from 'src/prisma.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { Producto } from '@prisma/client';

@Injectable()
export class ProductoService {
    
    constructor(private prisma: PrismaService){}

    async listarProductos(){
        return await this.prisma.producto.findMany({
            select: {
                descripcion: true,
                precio: true,
                cantidad: true,
                categoria: true,
                cveCategoria: true,
                cveProducto: true, 
                activo: true             
            }

        });
    }

    async verificarProducto(producto: string){
        return await this.prisma.producto.findMany({
            where:{
                descripcion: producto
            }
        });
    }

    async verificarClave(cveProducto:number){
        return await this.prisma.producto.findMany({
            where: {
                cveProducto : cveProducto
            }
        });
    }

    async insertar(producto: CreateProductoDto){
        producto.activo= true;
        return await this.prisma.producto.create({
            data: producto,
            select: {
                descripcion: true,
                precio: true,
                cantidad: true,
                categoria: true,
                cveCategoria: true,
                cveProducto: true, 
                activo: true              
            }
        });
    }

    async actualizar(cveProducto: number, producto: CreateProductoDto){
        return await this.prisma.producto.update({
            where: {
                cveProducto: cveProducto
            },
            data: producto,
            select: {
                descripcion: true,
                precio: true,
                cantidad: true,
                categoria: true,
                cveCategoria: true,
                cveProducto: true,
                activo: true                
            }
        });
    }
    async eliminar(cveProducto: number){
        return await this.prisma.producto.delete({
            where: {
                cveProducto: cveProducto
            },
            select: {
                descripcion: true,
                precio: true,
                cantidad: true,
                categoria: true,
                cveCategoria: true,
                cveProducto: true                
            }
        });
    }

    async cambiarEstatus(cveProducto: number, estatus: boolean){
        return await this.prisma.producto.update({
            where: {
                cveProducto: cveProducto
            },
            data: {
                activo: estatus
            }
        });
     }


  async autocompleteUserNames(query: string) {
    return await this.prisma.producto.findMany({
      where: {
        descripcion: {
          contains: query
        },
        activo: true
      },
      select: {
        descripcion: true,
                precio: true,
                cantidad: true,
                categoria: true,
                cveCategoria: true,
                cveProducto: true  
      },
      take: 10, // Limita el número de resultados
    });
  }



}
