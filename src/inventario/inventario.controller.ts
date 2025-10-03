import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';

@Controller('inventario')
export class InventarioController {

    private inventario: {
        [id: number]: number } = {
            10: 50,
            11: 20
        };

    //stock simulacion de entradas
    @Post()
    stockShirt(@Body() body: any) {

      const stockBase = 70;
      const stockActualizado = body.items.reduce((sum, item) => sum + (item.cantidadReposicion || 0), 0);
      const nuevoTotal = stockBase + stockActualizado
      return{
          mensaje:`Un Stock de ${stockActualizado} unidades de la referencia ${body.referencia} añadido y procesado.`,
          nuevoStockTotal: nuevoTotal,
          stockAnterior: stockBase,
          //Información sobre la entrada y producto
          detallesRecibidos:  body.items
      };
    }


  //Eliminar un producto con el id y la referencia

    @Delete(':id/:referencia')
    eliminarReferencia(
      @Param('id', ParseIntPipe) id: number,
      @Param('referencia') referencia: string
    ){
      return{
        mensaje: `Producto con el id ${id} y la referencia ${referencia} ha sido eliminado.`,
        fechaEliminacion: new Date(). toISOString()
      };
    }


  //Lectura por Id lee el stock 
    @Get(':idProducto')
    getInventarioById(
      @Param('idProducto', ParseIntPipe) idProducto: number,
    ){
      const stock = this.inventario[idProducto] || 0; // simulacion inventario

      return `Consulta de stock de variante con Id ${idProducto}: ${stock} unidades.`;
    };

// listado 
    @Get ()
    getProducto(
      @Query('id') id: number,
      @Query('referencia') referencia: string,
      @Query('size', ParseIntPipe) size: number
    ){
      return(
          'Camisa talla: ' + size + ' con el id ' + id + ' y referecia ' + referencia
      );
    
    }

  //corrección de inventario- Actualiza el stock
    @Patch(':id/cantidad')
    ajustarStock(
      @Param ('id', ParseIntPipe) idInventario: number,
      @Body('nuevaCantidad') nuevaCantidad: number,
    ){
      const stockAnterior = this.inventario[idInventario] || 0;

      this.inventario[idInventario] = nuevaCantidad; // actualizacion de acuerdo al inventario simulado

      const nuevoStock = nuevaCantidad;
      const ajuste = nuevaCantidad - stockAnterior;

    return {
      mensaje: `Stock de la variante Id ${idInventario} actualizado.`,
      stockAnterior: stockAnterior,
      stockActualizado: nuevoStock,
      diferencia: (ajuste > 0) ? `Se añadieron ${ajuste} unidades` 
      : `se retiraron ${Math.abs(ajuste)} unidades`
      /**los dos puntos indican diferencia, si la diferencia es mayor a cero siginfica 
       * que se añadieron productos pero si es menor a cero o no se cumple con la accion
       * de añadir significa que se retiraron
       */ 

    };
  }

  //registro de las salidas
    @Patch('salida/:idInventario')
    registrarSalida(
      @Param('idInventario', ParseIntPipe) idInventario: number,
      @Body('cantidadVendida') cantidadVendida: number,
    ){
      const stockAnterior = this.inventario[idInventario];


      if (stockAnterior === undefined){
        const stockActual = this.inventario[idInventario]; // esto se alimenta del private inventario ^
        if (stockActual === undefined || stockActual === null) {
             throw new NotFoundException(`La referencia con Id ${idInventario} no se encontró en el inventario.`);
        }
      }

      const nuevoStock = (stockAnterior || 0) - cantidadVendida; 

      if (cantidadVendida > stockAnterior){
        throw new BadRequestException(`No hay suficiente stock. Solo quedan ${stockAnterior} unidades de Id ${idInventario}.`);

      }
      this.inventario[idInventario] = nuevoStock;

      return {
        mensaje: `Salida registrada. Se descontaron ${cantidadVendida} unidades de la referencia Id ${idInventario}.`,
        stockAnterior: stockAnterior,
        stockRestante: nuevoStock
      };
    }

}
