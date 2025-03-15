import { Injectable } from '@nestjs/common';
import PrismaService from 'src/prisma.service';

@Injectable()
export class AuthService {

    constructor(private prisma: PrismaService){}

    async obtenerUsuario(username: string){
       return await this.prisma.usuario.findFirst({
            where: {
              username: username
                 }
             });
    }
}
