import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { json, urlencoded } from "express";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
  app.use(json({ limit: "20mb" }));
  app.use(urlencoded({ extended: true, limit: "20mb" }));
}
bootstrap();
