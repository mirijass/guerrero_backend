import { Injectable } from '@nestjs/common';
import PrismaService from 'src/prisma.service';
import { CreateVentaDto } from './dto/create-venta.dto';
import { DetalleVentaDto } from './dto/create-detalle-venta.dto';
import { EstadoVenta } from '@prisma/client';

@Injectable()
export class VentaService {

    constructor(private prismaSvc: PrismaService, 
        
    ){}

    async listar(){
        return await this.prismaSvc.venta.findMany({
            include:{
                DetalleVenta: {
                    include:{
                        venta: false, 
                        producto: {
                            select:{
                                nombre: true,
                                descripcion: true,
                            }
                        }
                    }
                },
                usuario: {
                    select:{
                        nombre: true,
                        apellidos: true
                    }
                }
            }
        });
    }

    async insertar(venta: CreateVentaDto){
        let ventaNew= {
            totalVenta: venta.totalVenta,
            cveUsuario: venta.cveUsuario
        }
        let ventaInsert = await this.prismaSvc.venta.create({
            data: ventaNew,
            select: {
                cveVenta: true,
                fechaVenta: true,
                estado: true,
            }
        });


        venta.detalleVenta.forEach(element => {

            let detalleVenta={
                cantidad: element.cantidad,
                precioProducto: element.precioProducto,
                cveProducto: element.cveProducto,
                cveVenta: ventaInsert.cveVenta
            }
            this.insertarDetalleVenta(detalleVenta);
            this.actualizarStock(detalleVenta.cveProducto, detalleVenta.cantidad);

        });


        return ventaInsert;

    }

    async insertarDetalleVenta(detalleVenta: DetalleVentaDto){

        return await this.prismaSvc.detalleVenta.create({
                data: detalleVenta, 
                select:{
                    cveDetalleVenta:true
                }
            })
    }

    async actualizarStock(cveProducto: number, cantidad: number) {
        // Obtener la cantidad actual del producto
        const productoActual = await this.prismaSvc.producto.findUnique({
            where: {
                cveProducto: cveProducto
            },
            select: {
                cantidad: true
            }
        });
    
        // Verificar que el producto existe
        if (!productoActual) {
            throw new Error("El producto no existe");
        }
    
        // Calcular la nueva cantidad
        const nuevaCantidad = productoActual.cantidad - cantidad;
    
        // Actualizar la cantidad del producto
        return await this.prismaSvc.producto.update({
            where: {
                cveProducto: cveProducto
            },
            data: {
                cantidad: nuevaCantidad
            },
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
    
    async cambiarEstado(cveVenta: number, nuevoEstado: string) {
        // Validar que el nuevo estado sea válido
        const estadosValidos:EstadoVenta[] = ['Pendiente', 'Procesando', 'Enviado', 'Entregado', 'Cancelado'];
        if (!estadosValidos.includes(nuevoEstado as EstadoVenta)) {
            throw new Error('El estado proporcionado no es válido');
        }
    
        // Actualizar el estado de la venta
        return await this.prismaSvc.venta.update({
            where: { cveVenta },
            data: { estado: nuevoEstado as EstadoVenta },
        });
    }

}