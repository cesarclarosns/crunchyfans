export interface ISubscriptionsService {
  createSubscription: (subscriberId: string) => Promise<void>;

  cancelSubscription: () => Promise<void>;

  updateSubscription: (
    subscriberId: string,
    subscribeeId: string,
    dto: any,
  ) => Promise<void>;

  getSubscription: (
    subscriberId: string,
    subscribeeId: string,
  ) => Promise<void>;
}

export const ISubscriptionsService = Symbol('ISubscriptionsService');
