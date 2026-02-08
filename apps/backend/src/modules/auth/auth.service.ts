import { Inject, Injectable } from "@nestjs/common";
// biome-ignore lint/style/useImportType: <Cannot useImportType in classes used in Injection>
import { JwtService } from "@nestjs/jwt";
import { plainToClass } from "class-transformer";
import { UserNotFoundError } from "../../common/errors";
import type { JwtPayload } from "../../types";
import { Services } from "../../types/constants";
import { PasswordUtils } from "../../utils/password";
// biome-ignore lint/style/useImportType: <Cannot useImportType in classes used in Injection or DTOs>
import { IUserService, UserEntity, UserLoginDTO } from "../user";
import type { IAuthService } from ".";

@Injectable()
export class AuthService implements IAuthService {
	public constructor(
		@Inject(Services.User) private readonly userService: IUserService,
		private readonly jwtService: JwtService,
	) {}

	public async validateUser(details: UserLoginDTO): Promise<UserEntity> {
		const user = await this.userService.findByDocument(details.document);
		if (await PasswordUtils.compare(details.password, user.password)) {
			return plainToClass(UserEntity, user);
		}

		throw new UserNotFoundError();
	}

	public async find(payload: JwtPayload): Promise<UserEntity> {
		const user = await this.userService.findByPublicId(payload.publicId);
		return plainToClass(UserEntity, user);
	}

	public async login(payload: JwtPayload): Promise<string> {
		const token = await this.jwtService.signAsync({ payload });
		return token;
	}
}
