import { Module } from '@nestjs/common';
import { DevolucionesController } from './devoluciones.controller';

@Module({
  controllers: [DevolucionesController]
})
export class DevolucionesModule {}
