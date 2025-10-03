//En este modulo se crean, se enlistan, se cancelan y se eliminan, las devoluciones de los productos 
import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';

@Controller('devoluciones')
export class DevolucionesController {

    private descuentos: {
        [referencia: string]: string} = {
            '187abc': '12%',
            '179vnm': '20%',
            '909lom': '0%'
        };

    //se crea un elemento el cual guarde el estado de la devolución 
    private estado: {
        [id: string]: string} = {
            '01': 'buenEstado', //tener en cuenta este dato a la hora de iniciar la ruta
            '02': 'malEstado'
        };

    private motivoBueno: {
        [id: string]: string} = {
            '001': 'Talla equivocada',
            '002': 'Material no satisfactorio',
            '003': 'Color incorrecto'
        };

    private motivoMalo: {
        [id: string]: string} = {
            '004': 'Boton-en-mal-estado',
            '005': 'Prenda-sucia',
            '006': 'Prenda-rota'
        };

    //Creación de la solicitud de devolución
    @Post()
    crearSolicitud(@Body () body: any){
        //Simular el Id asignado para la nueva solicitud
        const nuevoIdSolicitud = Math.floor(Math.random() * 1000) + 1; //se genera un numero aleatoreo

        return {
            mensaje: `Solicitud de devolución N°${nuevoIdSolicitud} Creada con éxito. Pendiente en recepción.`,
            idSolicitud: nuevoIdSolicitud,
            productosDevueltos: body.items,
            fechalimite: "La respuesta su solicitud será analizada y recibirá una respuesta de 3 a 5 días habiles"
            
        };
    }

    //solicitud empieza proceso de revision

    @Post(':idSolicitud/recepcion')
    registrarRecepcion(
        @Param('idSolicitud', ParseIntPipe) idSolicitud: number,
        @Body() body: { itemsRecibidos: Array<{referencia: string, cantidad: number}> } //Elementos para el DTO

    ){
        if(idSolicitud % 5 === 0 ){
            throw new HttpException(
                `Solicitud N°${idSolicitud} no encontrada o ya ha sido procesada.`,
                HttpStatus.NOT_FOUND, //No se puede completar la orden porqueÑ no existe el dato
            );
        }
        if (!body.itemsRecibidos || body.itemsRecibidos.length === 0){
            throw new HttpException(
                'Debe enviar una lista de productos revibidos.',
                HttpStatus.BAD_REQUEST, //No se puede completar la orden por falta de datos
            );
        }

        const totalRecibido = body.itemsRecibidos.reduce((sum, item) => sum + item.cantidad, 0);

        return {
            mensaje: `Recepción de producto registrada coon éxito para la Solicitud N°${idSolicitud}.`,
            estado: 'Pendiente de Revisión de Calidad',
            totalItemsRecibidos: totalRecibido,
            fechaRecepción: new Date(). toISOString(),
        };
    }


//respuesta a solicitud
    @Get('name/:id')
    creacionFactura(
        @Param('id', ParseIntPipe) id: number,
        @Query('referencia') referencia: string,
        @Query('name') name: string
    ){  
        const descuentoAplicado =  this.descuentos[referencia];
        let mensajeDetalle: string;

        if(descuentoAplicado){
            mensajeDetalle = `tenga en cuenta que a la hora de comprar la prenda esta tuvo descuento del ${descuentoAplicado}, por lo tanto se le regresa el dinero que usted pagó por la prenda`;

        }else {
            mensajeDetalle = `La prenda con referencia ${referencia} no tuvo ningún descuento al momento de la compra. Se le regresará el monto total pagado.`;
        }


        return{
            encabezado: `Solicitud a nombre de ${name}`,
            descripcion:  "Su solicitud está siendo atendida",
            detalle: mensajeDetalle,
            fechaCreacion: new Date(). toISOString() //es el formato de fecha YYYY/MM/DD tambien incluye minutos y segundos 
        }
        
    }

    // Estado de la solicitud
    @Get(':pedidoId')
    verDetalleDevolucion(
        @Param('pedidoId', ParseIntPipe) pedidoId: number,

    ){
        //simulacion del estado de la solicitud
        const estado = (pedidoId % 2 === 0) ? 'En transito' : 'Pendiente de Revisión';

        return {
            idSolicitud: `El estado de la devolución del pedido N°${pedidoId} se encuentra ${estado}`,
        };
    }

    // Estado de la prenda y reintegración
    @Patch('devolucion/:id')
    procesarDevolucion(
        @Param('id') idDevolucion: string,
        @Query ('statuShirt') statuShirt: string,
        @Query ('codigoMotivo') codigoMotivo: string
    ){
        //Alerta para saber si el estado fue enviado en la ruta

        if(!statuShirt){
            throw new HttpException(
                'Falta el parametro de consulta statuShirt.',
                HttpStatus.BAD_REQUEST
            );
        }

        //Buscar la descripcion del estado usando el codido en del atriburo estado
        const estadoActual = this.estado[statuShirt];

        /* condicional, dependiendo del estado de la prenda se sabe si se
        en el inventario o se desecha **/
       // si la prenda está en buen estado se reintegra al inventario-stock
        if (estadoActual === 'buenEstado'){
            const devoluciontipo1 = this.motivoBueno[codigoMotivo];

            if(!codigoMotivo || !devoluciontipo1){
                throw new HttpException(
                'Devolución rechazada. Es obligatorio enviar el codigo del daño correspondiente (001, 002, 003),',
                    HttpStatus.BAD_REQUEST
                );
            }
            return{
                message: `El pedido ${idDevolucion} se encuentra en ${estadoActual}, NO presenta fallas ni alteraciones.`,
                codigo: statuShirt,
                codigoEstado: codigoMotivo,
                estadoFinal: estadoActual,
                motidoDevolucion: devoluciontipo1,
                decision: "Teniendo en cuenta el estado final, la Prenda fue reintegrada con exito al inventario"
            };
        } else if (estadoActual === 'malEstado'){

            
            //Buscar el motivo de devolucion y daño de la prenda
            const devolucionTipo2 = this.motivoMalo[codigoMotivo];
            
            if (!codigoMotivo || !devolucionTipo2){
                // si el motivo de devolución es por daño y no se envia el código de motivo valido:
                throw new HttpException(
                    'Devolución rechazada. Es obligatorio enviar el codigo del daño correspondiente (002, 003, 004),',
                    HttpStatus.BAD_REQUEST
                );
            }

            return{
                mensaje: `El pedidio ${idDevolucion} se encuentra en ${estadoActual}, por lo tanto el producto a sido desechado.`,
                codigo: statuShirt,
                motivo: devolucionTipo2,
                codigoMotivo: codigoMotivo,
                decisión: `La prenda se encuentra con la falla "${devolucionTipo2}", lo cual fue la causa de devolución`,

            }
            // si el id no correscónde a lo predeterminados se lanza la siguiente alerta
        } else {
            throw new HttpException(
                `El parametro de estado "${statuShirt}" no es un parametro válido. Intentelo de nuevo.`,
                HttpStatus.NOT_FOUND
            );
        }

    } 

    //Laura LA ELIMINACIÓN está en duda, no se si sea buena practica que se eliminé 

    @Delete(':id')
    cancelarDevolucion(
        @Param('id', ParseIntPipe) idDevolucion: number,
    ){
        return {
            mensaje: `Solicitud de devolucion N°${idDevolucion} cancelada y eliminda del sistema.`,
            fechaCancelacion: new Date(). toISOString() //o se cambia por el parseDatePipe
        };
    }

}
