import { TestBed } from '@automock/jest';
import { Test, TestingModule } from '@nestjs/testing';

import { MediaDto } from './dto/media.dto';
import { MediaService } from './media.service';
import { StorageService } from './storage.service';

describe('MediaService', () => {
  let mediaService: MediaService;
  let storageService: jest.Mocked<StorageService>;

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(MediaService).compile();
    mediaService = unit;
    storageService = unitRef.get(StorageService);
  });

  it('should be defined', () => {
    expect(mediaService).toBeDefined();
  });

  // CRUD
  describe('create', () => {});
  describe('createImage', () => {});
  describe('findAll', () => {});
  describe('findOneById', () => {});
  describe('findAll', () => {});
  describe('findOneById', () => {});
  describe('update', () => {});
  // Uploads
  describe('createUpload', () => {});
  describe('createMultipartUpload', () => {});
  describe('deleteMultipartUpload', () => {});
  // Downloads
  describe('downloadMedia', () => {});
});
