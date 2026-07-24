import { Injectable } from "@nestjs/common";
import Database from "better-sqlite3";

@Injectable()
export class AppService {
  private readonly db = new Database(process.env.DB_PATH ?? "locations.db");

  constructor() {
    this.db.exec(
      "CREATE TABLE IF NOT EXISTS locations (id INTEGER PRIMARY KEY AUTOINCREMENT, body TEXT NOT NULL, createdAt TEXT NOT NULL)",
    );
  }

  save(body: unknown) {
    this.db
      .prepare("INSERT INTO locations (body, createdAt) VALUES (?, ?)")
      .run(JSON.stringify(body), new Date().toISOString());
  }

  getAll() {
    return this.db.prepare("SELECT * FROM locations").all();
  }
}
