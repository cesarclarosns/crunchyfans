import { registerDecorator, ValidationOptions } from 'class-validator';
import { Types as MongooseTypes } from 'mongoose';

export function IsObjectId(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: 'IsObjectId',
      options: validationOptions,
      propertyName,
      target: object.constructor,
      validator: {
        defaultMessage: (validationArguments) => {
          return `${validationArguments?.property} is not a valid ObjectId`;
        },
        validate(value: any) {
          return MongooseTypes.ObjectId.isValid(value);
        },
      },
    });
  };
}
