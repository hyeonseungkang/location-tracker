import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from './location.entity';
import { FeatureCollection } from 'geojson';
import { LocationBody } from './location-body.interface';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
  ) {}

  async save(body: unknown) {
    return this.locationRepository.save({
      body: JSON.stringify(body),
      createdAt: new Date().toISOString(),
    });
  }

  async get(id: number): Promise<Location | null> {
    const location = await this.locationRepository.findOneBy({ id });
    if (!location) {
      throw new NotFoundException();
    }
    return location;
  }

  async getAll(): Promise<Location[]> {
    return this.locationRepository.find();
  }

  async geojson(id: number): Promise<LocationBody> {
    const location = await this.locationRepository.findOneBy({ id });
    if (!location) {
      throw new NotFoundException();
    }
    return JSON.parse(location.body) as LocationBody;
  }

  async geojsons(): Promise<FeatureCollection> {
    const locations = await this.locationRepository.find();
    return {
      type: 'FeatureCollection',
      features: locations
        .map(
          (location) => (JSON.parse(location.body) as LocationBody).locations,
        )
        .flat(),
    };
  }
}
