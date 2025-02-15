import { Test, TestingModule } from '@nestjs/testing';
import { AzureOpenaiController } from './azure-openai.controller';
import { AzureOpenaiService } from './azure-openai.service';

describe('AzureOpenaiController', () => {
  let controller: AzureOpenaiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AzureOpenaiController],
      providers: [AzureOpenaiService],
    }).compile();

    controller = module.get<AzureOpenaiController>(AzureOpenaiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
