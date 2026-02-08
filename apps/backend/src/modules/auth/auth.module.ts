import { Module, type Provider } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { Services } from "../../types/constants";
import { UserModule } from "../";
import { AuthController, AuthService, JwtStrategy } from ".";

const authServiceProvider: Provider<AuthService> = {
	provide: Services.Auth,
	useClass: AuthService,
};

@Module({
	imports: [
		JwtModule.registerAsync({
			inject: [ConfigService],
			useFactory: async (config: ConfigService) => ({
				secret: config.getOrThrow<string>("JWT_SECRET"),
				signOptions: {
					expiresIn: config.getOrThrow<string>("JWT_EXPIRE"),
				},
			}),
		}),
		PassportModule.register({
			session: true,
		}),
		UserModule,
	],
	controllers: [AuthController],
	providers: [JwtStrategy, authServiceProvider],
	exports: [authServiceProvider],
})
export class AuthModule {}
