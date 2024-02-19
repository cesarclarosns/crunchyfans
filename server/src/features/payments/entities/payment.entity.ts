import { Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ collection: 'payments' })
export class Payment {}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
