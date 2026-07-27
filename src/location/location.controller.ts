import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { LocationService } from './location.service';

@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async receive(@Body() body: unknown) {
    await this.locationService.save(body);
    return { result: 'ok' };
  }

  @Get('/')
  async locations() {
    return this.locationService.getAll();
  }

  @Get('geojsons')
  async geojsons() {
    return this.locationService.geojsons();
  }
}
