import { IsNumber, IsObject } from "class-validator";

export class DetalleVentaDto{
    @IsNumber()
    cantidad:number;
    @IsNumber()
    precioProducto:number;
    @IsNumber()
    cveProducto:number;
    @IsNumber()
    cveVenta:number;
}