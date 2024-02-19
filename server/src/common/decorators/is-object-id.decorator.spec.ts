import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import mongoose from 'mongoose';

import { IsObjectId } from './is-object-id.decorator';

describe('@IsObjectId', () => {
  class TestObject {
    @IsObjectId()
    id: string;
  }

  it('should return a ValidationError if id is an invalid ObjectId', async () => {
    const testObject = plainToInstance(TestObject, { id: '1' });
    const errors = await validate(testObject);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0]).toBeInstanceOf(ValidationError);
  });

  it('should NOT return a ValidationError if id is a valid ObjectId', async () => {
    const testObject = plainToInstance(TestObject, {
      id: new mongoose.Types.ObjectId().toString(),
    });
    const errors = await validate(testObject);
    expect(errors.length).toBe(0);
  });
});
