import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from './location.entity';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
  ) {}

  save(body: unknown) {
    return this.locationRepository.save({
      body: JSON.stringify(body),
      createdAt: new Date().toISOString(),
    });
  }

  getAll() {
    return this.locationRepository.find();
  }
}
