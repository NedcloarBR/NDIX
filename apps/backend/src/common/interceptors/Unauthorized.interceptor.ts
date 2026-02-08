import {
	type CallHandler,
	type ExecutionContext,
	Injectable,
	type NestInterceptor,
	UnauthorizedException,
} from "@nestjs/common";
import { type Observable, catchError } from "rxjs";

@Injectable()
export class UnauthorizedInterceptor implements NestInterceptor {
	intercept(
		context: ExecutionContext,
		next: CallHandler<unknown>,
	): Observable<unknown> | Promise<Observable<unknown>> {
		return next.handle().pipe(
			catchError((error) => {
				if (error instanceof UnauthorizedException) {
					throw new UnauthorizedException(error.message);
				}
				throw error;
			}),
		);
	}
}
