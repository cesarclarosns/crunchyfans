export interface IEmailService {
  sendEmail: () => Promise<void>;
}

export const IEmailService = Symbol('IEmailService');
