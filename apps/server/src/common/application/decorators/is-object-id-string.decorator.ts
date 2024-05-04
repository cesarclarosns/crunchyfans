import { registerDecorator, ValidationOptions } from 'class-validator';
import { Types as MongooseTypes } from 'mongoose';

export function IsObjectIdString(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: IsObjectIdString.name,
      options: validationOptions,
      propertyName,
      target: object.constructor,
      validator: {
        defaultMessage: () => {
          return `${propertyName} is not a valid ObjectId`;
        },
        validate(value: any) {
          return MongooseTypes.ObjectId.isValid(value);
        },
      },
    });
  };
}
