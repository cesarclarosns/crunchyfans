export interface IStorageService {
  createDownloadUrl: (fileKey: string) => Promise<string>;

  createUploadUrl: (fileKey: string) => Promise<string>;
}

export const IStorageService = Symbol('IStorageService');
