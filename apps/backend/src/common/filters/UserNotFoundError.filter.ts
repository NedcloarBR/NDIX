import {
	type ArgumentsHost,
	Catch,
	type ExceptionFilter,
} from "@nestjs/common";
import type { FastifyReply } from "fastify";
import { UserNotFoundError } from "../errors";

@Catch(UserNotFoundError)
export class UserNotFoundErrorFilter<T extends UserNotFoundError>
	implements ExceptionFilter
{
	public catch(exception: T, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<FastifyReply>();
		const status = exception.getStatus();
		const exceptionResponse = exception.getResponse();
		const error =
			typeof response === "string"
				? { message: exceptionResponse }
				: (exceptionResponse as object);

		response
			.status(status)
			.send({ ...error, timestamp: new Date().toISOString() });
	}
}
