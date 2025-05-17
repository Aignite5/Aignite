import { Module } from '@nestjs/common';
import { GoogletoolsService } from './googletools.service';
import { GoogletoolsController } from './googletools.controller';

@Module({
  controllers: [GoogletoolsController],
  providers: [GoogletoolsService],
})
export class GoogletoolsModule {}
