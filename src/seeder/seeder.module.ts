import { Module } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { RbacModule } from 'src/modules/rbac/rbac.module';
import { UsersModule } from 'src/api/v1/users/users.module';
import { CountriesModule } from 'src/api/v1/countries/countries.module';

@Module({
  imports: [
    CountriesModule,
    RbacModule,
    UsersModule,
  ],
  providers: [SeederService],
})
export class SeederModule {}
