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

  get(id: number) {
    return this.locationRepository.findOneBy({ id });
  }

  getAll() {
    return this.locationRepository.find();
  }

  async geojson(id: number) {
    const location = await this.locationRepository.findOneBy({ id });
    return location?.body;
  }

  async geojsons() {
    const locations = await this.locationRepository.find();
    return locations.map((location) => location.body);
  }
}
