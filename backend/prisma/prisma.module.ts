// backend/src/prisma/prisma.module.ts
import { Global, Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Global() // Makes this module global so it's available everywhere
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // Export so other modules can use it
})
export class PrismaModule {}