import { BadRequestException, Injectable } from '@nestjs/common';
import PrismaService from 'src/prisma.service';
import { DetalleVentaDto } from 'src/venta/dto/create-detalle-venta.dto';
import { CreateCarritoDto } from './dto/create-carrito.dto';

@Injectable()
export class CarritoService {
    constructor(private prismaSvc: PrismaService) {}

    async insertarDesdeCarrito(cveUsuario: number) {
        // Obtener el carrito del usuario
        const carrito = await this.prismaSvc.carrito.findMany({
            where: {
                cveUsuario: parseInt(cveUsuario.toString())
            },
            include: {
                producto: true
            }
        });

        if (!carrito || carrito.length === 0) {
            throw new BadRequestException("El carrito está vacío o no existe");
        }

        // Calcular el total de la venta
        const totalVenta = carrito.reduce((total, item) => {
            return total + item.cantidad * item.producto.precio;
        }, 0);

        // Crear la venta
        const ventaInsert = await this.prismaSvc.venta.create({
            data: {
                totalVenta,
                cveUsuario: parseInt(cveUsuario.toString())
            },
            select: {
                cveVenta: true,
                fechaVenta: true
            }
        });

        // Insertar los detalles de la venta y actualizar el stock
        for (const item of carrito) {
            const detalleVenta = {
                cantidad: item.cantidad,
                precioProducto: item.producto.precio,
                cveProducto: item.cveProducto,
                cveVenta: ventaInsert.cveVenta
            };
            await this.insertarDetalleVenta(detalleVenta);
            await this.actualizarStock(detalleVenta.cveProducto, detalleVenta.cantidad);
        }

        // Vaciar el carrito del usuario
        await this.prismaSvc.carrito.deleteMany({
            where: {
                cveUsuario: parseInt(cveUsuario.toString())
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
        const productoActual = await this.prismaSvc.producto.findUnique({
            where: {
                cveProducto
            },
            select: {
                cantidad: true
            }
        });

        if (!productoActual) {
            throw new BadRequestException("El producto no existe");
        }

        const nuevaCantidad = productoActual.cantidad - cantidad;

        return await this.prismaSvc.producto.update({
            where: {
                cveProducto
            },
            data: {
                cantidad: nuevaCantidad
            }
        });
    }

    async agregarProductoAlCarrito(createCarritoDto: CreateCarritoDto) {
        const { cveUsuario, cveProducto, cantidad } = createCarritoDto;

        // Verificar si el producto ya existe en el carrito
        const productoEnCarrito = await this.prismaSvc.carrito.findFirst({
            where: {
                cveUsuario,
                cveProducto
            }
        });

        // Obtener el producto para verificar el stock
        const producto = await this.prismaSvc.producto.findUnique({
            where: {
                cveProducto
            },
            select: {
                cantidad: true
            }
        });

        if (!producto) {
            throw new BadRequestException("El producto no existe");
        }

        // const cantidadSolicitada = productoEnCarrito
        //     ? productoEnCarrito.cantidad + cantidad
        //     : cantidad;

        if (cantidad > producto.cantidad) {
            throw new BadRequestException(
                `Stock insuficiente. Solo hay ${producto.cantidad} unidades disponibles.`
            );
        }

        if (productoEnCarrito) {
            // Actualizar la cantidad del producto en el carrito
            return await this.prismaSvc.carrito.update({
                where: {
                    cveCarrito: productoEnCarrito.cveCarrito
                },
                data: {
                    cantidad: cantidad
                }
            });
        } else {
            // Agregar el producto al carrito
            return await this.prismaSvc.carrito.create({
                data: {
                    cveUsuario,
                    cveProducto,
                    cantidad
                }
            });
        }
    }

    async eliminarProductoDelCarrito(cveUsuario: number, cveProducto: number) {

        //Convertir cveUsuario a número
        cveUsuario = Number(cveUsuario);
        cveProducto = Number(cveProducto);

        const productoEnCarrito = await this.prismaSvc.carrito.findFirst({
            where: {
                cveUsuario,
                cveProducto
            }
        });
        if (!productoEnCarrito) {
            throw new BadRequestException("El producto no está en el carrito");
        }

        // Eliminar el producto del carrito
        return await this.prismaSvc.carrito.delete({
            where: {
                cveCarrito: productoEnCarrito.cveCarrito
            }
        });
    }

    async obtenerCarrito(cveUsuario: number) {
        console.log(cveUsuario)
        return await this.prismaSvc.carrito.findMany({
            where: {
                cveUsuario: Number(cveUsuario)
            },
            include: {
                producto: true
            }
        });
    }
}