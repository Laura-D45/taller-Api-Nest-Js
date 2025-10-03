import { Controller, Post, Body, Get, Param, Patch, ParseIntPipe, Delete } from '@nestjs/common';

@Controller('pedido')
export class PedidoController {
    private productos = [
        { referencia: 'CF-001', nombre: 'Camisa Polo' },
        { referencia: 'CF-002', nombre: 'Camisa Formal' }
    ];

    @Post()
    crearPedido(@Body() body: any) {
    // validacion en relacion si el producto existe dentro del pedido
    const productoExiste = this.productos.some(p => p.referencia === body.producto);
    if (!productoExiste) {
        return { mensaje: `El producto ${body.producto} no existe.` };
    }
    return { mensaje: 'Pedido creado', pedido: body };
    }

    @Get(':id/:producto')
    obtenerPedido(
        @Param('id',) id: number,
        @Param('producto') producto: string,
        ) {
        return { mensaje: `Pedido consultado con el id ${id} es: ${producto} ` };
    }

    @Patch(':id')
    actualizarPedido(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
        return { mensaje: 'Pedido actualizado', id, cambios: body };
    }

    @Delete(':id')
    eliminarPedido(@Param('id', ParseIntPipe) id: number) {
        return { mensaje: 'Pedido eliminado', id };
    }
}
