import { Injectable } from '@nestjs/common';
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
    }
}
