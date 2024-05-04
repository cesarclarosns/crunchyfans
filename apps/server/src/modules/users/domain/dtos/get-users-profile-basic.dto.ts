export class GetUsersProfileBasicDto {
  ids?: string[];
  username?: string;
  name?: string;
  skip: number;
  limit: number;
  cursor: string;
}
