export interface IFollowersRepository {
  createFollower(): Promise<void>;
  deleteFollower(): Promise<void>;
}
