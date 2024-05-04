import { HttpException, HttpStatus } from '@nestjs/common';

export function getRandomNumber(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function validateEventEmitterAsyncResults(results: any[]) {
  for (const result of results) {
    if (!result) {
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
