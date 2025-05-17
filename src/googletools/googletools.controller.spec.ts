import { Test, TestingModule } from '@nestjs/testing';
import { GoogletoolsController } from './googletools.controller';
import { GoogletoolsService } from './googletools.service';

describe('GoogletoolsController', () => {
  let controller: GoogletoolsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GoogletoolsController],
      providers: [GoogletoolsService],
    }).compile();

    controller = module.get<GoogletoolsController>(GoogletoolsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
