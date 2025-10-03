import { Controller, Post, Body, Get, Param, ParseIntPipe,Query } from '@nestjs/common';
import { CrearProductoDto } from './dto/crear-producto.dto';

@Controller('producto')
export class ProductoController {
    @Post()
    // uso del dto en el verbo post para crear un producto
    crearProducto(@Body() body: CrearProductoDto){
        // return `Producto ${body.nombre} con referencia ${body.referencia} creado exitosamente. `;
        return {mensaje: 'Producto creado exitosamente', producto: body};
    }
    // uso del query param especificando el color de la camisa
    @Get()
    buscarPorColor(@Query('color') color: string){
        return { mensaje: `Buscando productos de color ${color}...` };
    }
}
