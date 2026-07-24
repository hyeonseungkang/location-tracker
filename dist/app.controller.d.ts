import { AppService } from "./app.service";
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    receive(body: unknown): {
        result: string;
    };
    locations(): unknown[];
}
