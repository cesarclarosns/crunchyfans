export class GetUsersProfileBasicDto {
  ids?: string[];
  query: string;
  skip: number;
  limit: number;
  cursor: string;
}
