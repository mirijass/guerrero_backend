import { BadRequestException, Injectable } from '@nestjs/common';
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
                cveUsuario: parseInt(cveUsuario.toString())
            },
            include: {
                DetalleCarrito: {
                 include:{
                    producto: true
                 }   
                }
            }
        });

        if (!carrito) {
             throw new BadRequestException("El carrito no existe");
        }

        if (carrito.DetalleCarrito.length==0) {
             throw new BadRequestException("Carrito vacio");
        }

        // Calcular el total de la venta
        const totalVenta = carrito.DetalleCarrito.reduce((total, item) => {
            return total + (item.cantidad * item.producto.precio);
        }, 0);

        // Crear la venta
        let ventaNew = {
            totalVenta: totalVenta,
            cveUsuario: parseInt(cveUsuario.toString())
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
                precioProducto: item.producto.precio,
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
             throw new BadRequestException("El producto no existe");
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

    // Verificar si el producto ya existe en el detalleCarrito
    const detalleExistente = await this.prismaSvc.detalleCarrito.findUnique({
        where: {
            cveCarrito_cveProducto: {
                cveCarrito: carrito.cveCarrito,
                cveProducto: createCarritoDto.cveProducto
            }
        }
    });

    // Obtener el producto para verificar el stock
    const producto = await this.prismaSvc.producto.findUnique({
        where: {
            cveProducto: createCarritoDto.cveProducto
        },
        select: {
            cantidad: true // Stock disponible
        }
    });

    if (!producto) {
        throw new BadRequestException("El producto no existe");
    }

        // Calcular la cantidad total que se desea agregar
        const cantidadSolicitada = detalleExistente
        ? detalleExistente.cantidad + createCarritoDto.cantidad
        : createCarritoDto.cantidad;

    // Validar si hay suficiente stock
    if (cantidadSolicitada > producto.cantidad) {
        throw new BadRequestException(
            `Stock insuficiente. Solo hay ${producto.cantidad} unidades disponibles.`
        );
    }


    if (detalleExistente) {
        // Si el producto ya existe, actualizar la cantidad
        return await this.prismaSvc.detalleCarrito.update({
            where: {
                cveCarrito_cveProducto: {
                    cveCarrito: carrito.cveCarrito,
                    cveProducto: createCarritoDto.cveProducto
                }
            },
            data: {
                cantidad: detalleExistente.cantidad + createCarritoDto.cantidad
            }
        });
        } else {
            // Si el producto no existe, agregarlo al carrito
            return await this.prismaSvc.detalleCarrito.create({
                data: {
                    cveCarrito: carrito.cveCarrito,
                    cveProducto: createCarritoDto.cveProducto,
                    cantidad: createCarritoDto.cantidad
                }
            });
        }
    }

    async eliminarProductoDelCarrito(cveUsuario: number, cveProducto: number) {
        // Obtener el carrito del usuario
        const carrito = await this.prismaSvc.carrito.findUnique({
            where: {
                cveUsuario: parseInt(cveUsuario.toString())
            }
        });

        if (!carrito) {
             throw new BadRequestException("El carrito no existe");
        }

        // Eliminar el producto del carrito
        return await this.prismaSvc.detalleCarrito.deleteMany({
            where: {
                cveCarrito: carrito.cveCarrito,
                cveProducto: parseInt(cveProducto.toString())
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