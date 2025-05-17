import { Test, TestingModule } from '@nestjs/testing';
import { GoogletoolsService } from './googletools.service';

describe('GoogletoolsService', () => {
  let service: GoogletoolsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GoogletoolsService],
    }).compile();

    service = module.get<GoogletoolsService>(GoogletoolsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
