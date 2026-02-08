import type { JwtPayload } from "src/types";
import type { UserEntity } from "../user";
import type { UserLoginDTO } from "../user/user.dto";

export interface IAuthService {
	validateUser(details: UserLoginDTO): Promise<UserEntity>;
	find(payload: JwtPayload): Promise<UserEntity>;
	login(payload: JwtPayload): Promise<string>;
}
