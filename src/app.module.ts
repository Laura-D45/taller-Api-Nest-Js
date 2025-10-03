import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductoModule } from './producto/producto.module';
import { PedidoModule } from './pedido/pedido.module';


@Module({
  imports: [ProductoModule, PedidoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
