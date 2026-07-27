import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
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

  @Get('/:id')
  async location(@Param('id') id: number) {
    return this.locationService.get(id);
  }

  @Get('/geojson')
  async geojsons() {
    return this.locationService.geojsons();
  }

  @Get('/geojson/:id')
  async geojson(@Param('id') id: number) {
    return this.locationService.geojson(id);
  }
}
