import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
// biome-ignore lint/style/useImportType: <Cannot useImportType in classes used in Injection>
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import type { JwtPayload } from "../../types";
import { Services } from "../../types/constants";
import type { UserEntity } from "../user";
// biome-ignore lint/style/useImportType: <Cannot useImportType in classes used in Injection>
import { AuthService } from "./auth.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "JWT") {
	constructor(
		@Inject(Services.Auth) private readonly authService: AuthService,
		private readonly config: ConfigService,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: config.getOrThrow<string>("JWT_SECRET"),
		});
	}

	async validate(payload: JwtPayload): Promise<UserEntity> {
		const user = await this.authService.find(payload);
		if (!user) {
			throw new UnauthorizedException();
		}
		return user;
	}
}
