import { plainToInstance } from 'class-transformer';
import { ClassConstructor } from 'class-transformer/types/interfaces';

export class TransformUtil {
  static toDto<T, V>(dtoClass: ClassConstructor<T>, entity: V): T {
    return plainToInstance(dtoClass, entity, { excludeExtraneousValues: true });
  }

  static toDtoArray<T, V>(dtoClass: ClassConstructor<T>, entities: V[]): T[] {
    return entities.map((entity) =>
      plainToInstance(dtoClass, entity, { excludeExtraneousValues: true }),
    );
  }
}
