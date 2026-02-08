import type { NestFastifyApplication } from "@nestjs/platform-fastify";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

export function configureSwagger(app: NestFastifyApplication): void {
	const swaggerConfig = new DocumentBuilder()
		.setTitle("NDIX")
		.setDescription("The API Documentation")
		.setVersion("1.1.0")
		.build();

	const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
	SwaggerModule.setup("docs", app, swaggerDocument);
}
