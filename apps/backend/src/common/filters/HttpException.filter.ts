import { type ArgumentsHost, Catch, type ExceptionFilter, HttpException } from "@nestjs/common";
import type { FastifyReply } from "fastify";

@Catch(HttpException)
export class HttpExceptionFilter<T extends HttpException> implements ExceptionFilter {
	public catch(exception: T, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<FastifyReply>();
		const status = exception.getStatus();
		const exceptionResponse = exception.getResponse();
		const error = typeof response === "string" ? { message: exceptionResponse } : (exceptionResponse as object);

		response.status(status).send({ ...error, timestamp: new Date().toISOString() });
	}
}
