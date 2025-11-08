import { Test, TestingModule } from '@nestjs/testing';
import { AdminanalyticsService } from './adminanalytics.service';

describe('AdminanalyticsService', () => {
  let service: AdminanalyticsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminanalyticsService],
    }).compile();

    service = module.get<AdminanalyticsService>(AdminanalyticsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
