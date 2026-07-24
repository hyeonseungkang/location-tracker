import { Body, Controller, Get, Post } from "@nestjs/common";
import { AppService } from "./app.service";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  receive(@Body() body: unknown) {
    this.appService.save(body);
    return { result: "ok" };
  }

  @Get()
  locations() {
    return this.appService.getAll();
  }
}
