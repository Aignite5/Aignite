import { Test, TestingModule } from '@nestjs/testing';
import { AzureOpenaiService } from './azure-openai.service';

describe('AzureOpenaiService', () => {
  let service: AzureOpenaiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AzureOpenaiService],
    }).compile();

    service = module.get<AzureOpenaiService>(AzureOpenaiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
