import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InventarioModule } from './inventario/inventario.module';
import { DevolucionesModule } from './devoluciones/devoluciones.module';
import { ProductoModule } from './producto/producto.module';
import { PedidoModule } from './pedido/pedido.module';

@Module({
  imports: [InventarioModule, DevolucionesModule, ProductoModule, PedidoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
