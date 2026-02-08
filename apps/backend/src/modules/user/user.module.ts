import { Module, type Provider } from "@nestjs/common";
import { Repositories, Services } from "../../types/constants";
import { UserController, UserRepository, UserService } from ".";

const dependencies: Provider[] = [
	{
		provide: Services.User,
		useClass: UserService,
	},
	{
		provide: Repositories.User,
		useClass: UserRepository,
	},
];

@Module({
	controllers: [UserController],
	providers: [...dependencies],
	exports: [...dependencies],
})
export class UserModule {}
