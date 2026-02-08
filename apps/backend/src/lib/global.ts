import { ValidationPipe } from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";
import type { NestFastifyApplication } from "@nestjs/platform-fastify";
import { PrismaClientExceptionFilter } from "nestjs-prisma";
import { HttpExceptionFilter } from "../common/filters";
import {
	HttpInterceptor,
	UnauthorizedInterceptor,
} from "../common/interceptors";

export function configureGlobals(app: NestFastifyApplication): void {
	const { httpAdapter } = app.get(HttpAdapterHost);

	app.useGlobalFilters(
		new HttpExceptionFilter(),
		new PrismaClientExceptionFilter(httpAdapter),
	);

	app.useGlobalInterceptors(
		new HttpInterceptor(),
		new UnauthorizedInterceptor(),
	);
	app.useGlobalPipes(
		new ValidationPipe({
			always: true,
			forbidNonWhitelisted: true,
			whitelist: true,
			transform: true,
		}),
	);
	app.setGlobalPrefix("api");
}
