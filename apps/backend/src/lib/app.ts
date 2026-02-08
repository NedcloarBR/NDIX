import type { NestFastifyApplication } from "@nestjs/platform-fastify";

export function configureApp(app: NestFastifyApplication) {
	app.enableCors({
		origin: "*",
		methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
		credentials: true,
	});
}
