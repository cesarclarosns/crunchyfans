import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsRecord(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: IsRecord.name,
      options: validationOptions,
      propertyName,
      target: object.constructor,
      validator: {
        defaultMessage: () => {
          return `${propertyName} is not a valid record`;
        },
        validate(value: any) {
          let isValid = true;

          Object.values(value).forEach((value) => {
            if (typeof value !== 'string') isValid = false;
          });

          return isValid;
        },
      },
    });
  };
}
