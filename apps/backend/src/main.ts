import { Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import {
	FastifyAdapter,
	type NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { AppModule } from "./app.module";
import { Configure } from "./lib";

async function bootstrap(): Promise<void> {
	const app = await NestFactory.create<NestFastifyApplication>(
		AppModule,
		new FastifyAdapter(),
	);

	const logger = new Logger("main");
	const configService = app.get<ConfigService>(ConfigService);
	const PORT = configService.getOrThrow<number>("PORT");

	Configure.App(app);
	Configure.Fastify(app);
	Configure.Globals(app);
	Configure.Swagger(app);

	try {
		await app.listen(PORT, "0.0.0.0");
		logger.log(`Listening to PORT: ${PORT} | URL: ${await app.getUrl()}`);
	} catch (error) {
		logger.error(error);
	}
}

bootstrap();
