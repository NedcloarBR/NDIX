import { type ExecutionContext, createParamDecorator } from "@nestjs/common";
import type { FastifyRequest } from "fastify";

export const AuthUser = createParamDecorator(
	(data: unknown, ctx: ExecutionContext) => {
		const request = ctx.switchToHttp().getRequest<FastifyRequest>();
		return request.user;
	},
);
