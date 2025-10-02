import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InventarioModule } from './inventario/inventario.module';
import { DevolucionesModule } from './devoluciones/devoluciones.module';

@Module({
  imports: [InventarioModule, DevolucionesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
