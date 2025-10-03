// // src/productos/dto/create-producto.dto.ts
// import { IsString, IsNumber, IsNotEmpty, IsPositive } from 'class-validator';

// export class CreateProductoDto {
//   @IsNotEmpty({ message: 'El nombre del producto no puede estar vacío.' })
//   @IsString()
//   nombre: string;

//   @IsString()
//   descripcion: string;

//   @IsNotEmpty()
//   @IsNumber()
//   @IsPositive()
//   precio: number; // Ej: 25.99

//   // Podrías agregar campos iniciales como color y talla, o manejarlos en Inventario
// }

// // src/productos/dto/update-producto.dto.ts
// import { PartialType } from '@nestjs/mapped-types';
// import { CreateProductoDto } from './create-producto.dto';

// // Permite que todos los campos sean opcionales al actualizar
// export class UpdateProductoDto extends PartialType(CreateProductoDto) {}