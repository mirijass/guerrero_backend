import { Injectable } from '@nestjs/common';
import PrismaService from 'src/prisma.service';

@Injectable()
export class RolService {

    constructor(private prismaSvc: PrismaService){}

    async listar(){
        return await this.prismaSvc.rol.findMany();
    }

}