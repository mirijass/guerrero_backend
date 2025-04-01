import { BadRequestException, Injectable } from '@nestjs/common';
import PrismaService from 'src/prisma.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Injectable()
export class UsuarioService {
    
    constructor(private prisma: PrismaService){}

    async listarUsuarios(){
        return await this.prisma.usuario.findMany({
            select: {
                cveUsuario: true,
                nombre: true,
                apellidos: true,
                username: true,
                fechaRegistro: true,
                cveRol: true,
                rol: true
            }

        });
    }
    async verificarRol(cveRol: number){
        return await this.prisma.rol.findMany({
            where: {
                cveRol: cveRol
            }
        });
    }

    async verificarUsername(username: string){
        return await this.prisma.usuario.findMany({
            where:{
                username: username
            }
        });
    }

    async verificarClave(cveUsuario:number){
        return await this.prisma.usuario.findMany({
            where: {
                cveUsuario : cveUsuario
            }
        });
    }

    async insertar(usuario: CreateUsuarioDto){
        return await this.prisma.usuario.create({
            data: usuario,
            select: {
                cveUsuario: true,
                nombre: true,
                apellidos: true,
                username: true,
                password: false,
                fechaRegistro: true,
                cveRol: true,
                rol: false
            }
        });
    }

    async actualizar(cveUsuario: number, usuario: UpdateUsuarioDto){
        return await this.prisma.usuario.update({
            where: {
                cveUsuario: cveUsuario
            },
            data: usuario,
            select:{
                cveUsuario: true,
                apellidos: true,
                username: true,
                password: false,
                fechaRegistro: false,
                cveRol:true,
                rol: false
            }
        });
    }
    async eliminar(cveUsuario: number){
        try {
            return await this.prisma.usuario.delete({
                where: {
                    cveUsuario: cveUsuario
                },
                select:{
                    cveUsuario: true,
                    apellidos: true,
                    username: true,
                    password: false,
                    fechaRegistro: false,
                    cveRol:true,
                    rol: false
                }
            });
        } catch (error) {
            // Verificar si el error es por restricciones de integridad referencial
            if (error.code === 'P2003') { // Código de error de Prisma para violación de clave foránea
                throw new BadRequestException(
                    'No se puede eliminar el usuario porque tiene compras o un carrito relacionado.'
                );
            }
            // Lanzar otros errores no controlados
            throw new BadRequestException(error.message);
    
        }
       
    }
}
