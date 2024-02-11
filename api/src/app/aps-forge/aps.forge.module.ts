import { Module } from '@nestjs/common';
import { ApsForgeResolver } from './aps.forge.resolver';
import { ApsForgeService } from './aps.forge.service';

@Module({
    imports: [],
    providers: [ ApsForgeService],
    exports: [],
    controllers:[ApsForgeResolver]
})
export class ApsForgeModule {}
