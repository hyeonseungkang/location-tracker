import { Body, Controller, Get, Post } from '@nestjs/common';
import { LocationService } from './location.service';

@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Post()
  async receive(@Body() body: unknown) {
    return this.locationService.save(body);
  }

  @Get()
  async locations() {
    return this.locationService.getAll();
  }
}
