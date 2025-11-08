import { Test, TestingModule } from '@nestjs/testing';
import { AdminanalyticsController } from './adminanalytics.controller';
import { AdminanalyticsService } from './adminanalytics.service';

describe('AdminanalyticsController', () => {
  let controller: AdminanalyticsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminanalyticsController],
      providers: [AdminanalyticsService],
    }).compile();

    controller = module.get<AdminanalyticsController>(AdminanalyticsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
