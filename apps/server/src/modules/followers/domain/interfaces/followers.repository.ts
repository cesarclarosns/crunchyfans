export interface IFollowerRepository {
  findFollowersByUserId: (userId: string, viewerId?: string) => void;
  findFolloweesByUserId: (userId: string, viewerId?: string) => void;
  createFollower: (followerId: string, followeeId: string) => void;
  deleteFollower: (followerId: string, followeeId: string) => void;
}
