export class CreatePaymentDto {
  type: 'post' | 'message' | 'subscripiton';
  userId: string;
  metadata: {
    postId: string;
  };
}
