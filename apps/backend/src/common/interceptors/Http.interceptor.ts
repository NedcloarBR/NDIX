import {
	type CallHandler,
	type ExecutionContext,
	Injectable,
	type NestInterceptor,
} from "@nestjs/common";
import type { FastifyReply } from "fastify";
import type { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable()
export class HttpInterceptor implements NestInterceptor {
	public intercept(
		context: ExecutionContext,
		next: CallHandler,
	): Observable<unknown> | Promise<Observable<unknown>> {
		const response = context.switchToHttp().getResponse<FastifyReply>();
		const status = response.statusCode;
		const timestamp = new Date().toISOString();
		return next.handle().pipe(
			map((data) => ({
				status,
				timestamp,
				...data,
			})),
		);
	}
}
