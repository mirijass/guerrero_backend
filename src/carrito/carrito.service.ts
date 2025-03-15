import { Injectable } from '@nestjs/common';
import PrismaService from 'src/prisma.service';
import { DetalleVentaDto } from 'src/venta/dto/create-detalle-venta.dto';
import { CreateCarritoDto } from './dto/create-carrito.dto';


@Injectable()
export class CarritoService {
    constructor(private prismaSvc: PrismaService, 
        
    ){}
    
    async insertarDesdeCarrito(cveUsuario: number) {
        // Obtener el carrito del usuario
        const carrito = await this.prismaSvc.carrito.findUnique({
            where: {
                cveUsuario: cveUsuario
            },
            include: {
                DetalleCarrito: true
            }
        });

        if (!carrito) {
            throw new Error("El carrito no existe");
        }

        // Calcular el total de la venta
        const totalVenta = carrito.DetalleCarrito.reduce((total, item) => {
            return total + (item.cantidad * item.precioProducto);
        }, 0);

        // Crear la venta
        let ventaNew = {
            totalVenta: totalVenta,
            cveUsuario: cveUsuario
        };
        let ventaInsert = await this.prismaSvc.venta.create({
            data: ventaNew,
            select: {
                cveVenta: true,
                fechaVenta: true
            }
        });

        // Insertar los detalles de la venta y actualizar el stock
        for (const item of carrito.DetalleCarrito) {
            let detalleVenta = {
                cantidad: item.cantidad,
                precioProducto: item.precioProducto,
                cveProducto: item.cveProducto,
                cveVenta: ventaInsert.cveVenta
            };
            await this.insertarDetalleVenta(detalleVenta);
            await this.actualizarStock(detalleVenta.cveProducto, detalleVenta.cantidad);
        }

        // Vaciar el carrito del usuario
        await this.prismaSvc.detalleCarrito.deleteMany({
            where: {
                cveCarrito: carrito.cveCarrito
            }
        });

        return ventaInsert;
    }

    async insertarDetalleVenta(detalleVenta: DetalleVentaDto) {
        return await this.prismaSvc.detalleVenta.create({
            data: detalleVenta,
            select: {
                cveDetalleVenta: true
            }
        });
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

    async agregarProductoAlCarrito(createCarritoDto: CreateCarritoDto) {
        // Obtener el carrito del usuario
        console.log(createCarritoDto);
        let carrito = await this.prismaSvc.carrito.findUnique({
            where: {
                cveUsuario: createCarritoDto.cveUsuario
            }
        });

        // Si el carrito no existe, crearlo
        if (!carrito) {
            carrito = await this.prismaSvc.carrito.create({
                data: {
                    cveUsuario: createCarritoDto.cveUsuario
                }
            });
        }

        // Agregar el producto al carrito
        return await this.prismaSvc.detalleCarrito.create({
            data: {
                cveCarrito: carrito.cveCarrito,
                cveProducto: createCarritoDto.cveProducto,
                cantidad: createCarritoDto.cantidad,
                precioProducto: createCarritoDto.precioProducto
            }
        });
    }

    async eliminarProductoDelCarrito(cveUsuario: number, cveProducto: number) {
        // Obtener el carrito del usuario
        const carrito = await this.prismaSvc.carrito.findUnique({
            where: {
                cveUsuario: cveUsuario
            }
        });

        if (!carrito) {
            throw new Error("El carrito no existe");
        }

        // Eliminar el producto del carrito
        return await this.prismaSvc.detalleCarrito.deleteMany({
            where: {
                cveCarrito: carrito.cveCarrito,
                cveProducto: cveProducto
            }
        });
    }

    async obtenerCarrito(cveUsuario: number) {
        console.log(cveUsuario);
        // Obtener el carrito del usuario
        return await this.prismaSvc.carrito.findUnique({
            where: {
                cveUsuario: parseInt(cveUsuario.toString())
            },
            include: {
                DetalleCarrito: {
                    include: {
                        producto: true
                    }
                }
            }
        });
    }
}