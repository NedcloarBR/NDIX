import type { UserEntity } from "src/modules/user";
import "fastify";

declare module "fastify" {
	export interface FastifyRequest {
		user: UserEntity;
	}
}

export interface JwtPayload {
	publicId: UserEntity["publicId"];
}
