import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Location } from './location/location.entity';
import { ConfigModule } from '@nestjs/config';
import { LocationModule } from './location/location.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'data/locations.db',
      entities: [Location],
      synchronize: true,
    }),
    ConfigModule.forRoot(),
    LocationModule,
  ],
})
export class AppModule {}
