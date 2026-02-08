import {
	Body,
	Controller,
	Get,
	HttpStatus,
	Inject,
	Param,
	Post,
} from "@nestjs/common";
import {
	ApiBody,
	ApiConflictResponse,
	ApiCreatedResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiParam,
	ApiResponse,
	ApiTags,
} from "@nestjs/swagger";
import { plainToClass } from "class-transformer";
// biome-ignore lint/style/useImportType: <Cannot useImportType in DTOs>
import {
	type IUserService,
	UserDTO,
	UserDocumentDTO,
	UserEmailDTO,
	UserEntity,
} from ".";
import { Routes, Services } from "../../types/constants";

@Controller(Routes.User)
@ApiTags(Routes.User)
export class UserController {
	public constructor(
		@Inject(Services.User) private readonly userService: IUserService,
	) {}

	@Get()
	@ApiResponse({ status: HttpStatus.OK, description: "User Controller health" })
	public get(): { message: string } {
		return { message: "UserModule Controller" };
	}

	@Post()
	@ApiBody({
		type: UserDTO,
	})
	@ApiCreatedResponse({ description: "User Created" })
	@ApiConflictResponse({
		description: "Already exists an User with this email or document",
	})
	public async create(@Body() data: UserDTO): Promise<{ data: UserEntity }> {
		const user = await this.userService.create(data);

		return {
			data: plainToClass(UserEntity, user),
		};
	}

	@Get("document/:document")
	@ApiParam({
		name: "document",
		description: "A valid CPF or CNPJ",
	})
	@ApiOkResponse({ description: "User found", example: UserDTO })
	@ApiNotFoundResponse({ description: "There is no user with this document" })
	public async findByDocument(
		@Param() { document }: UserDocumentDTO,
	): Promise<{ data: UserEntity }> {
		const user = await this.userService.findByDocument(document);

		return {
			data: plainToClass(UserEntity, user),
		};
	}

	@Get("email/:email")
	@ApiParam({
		name: "email",
		description: "A valid email",
	})
	@ApiOkResponse({ description: "User found", example: UserDTO })
	@ApiNotFoundResponse({ description: "There is no user with this email" })
	public async findByEmail(
		@Param() { email }: UserEmailDTO,
	): Promise<{ data: UserEntity }> {
		const user = await this.userService.findByEmail(email);

		return {
			data: plainToClass(UserEntity, user),
		};
	}

	@Get(":id")
	@ApiParam({
		name: "id",
		description: "A user PublicId (UUID)",
		example: "0a8ee1f5-1373-4767-9389-f76abf22bf4f",
	})
	@ApiOkResponse({ description: "User found", example: UserDTO })
	@ApiNotFoundResponse({ description: "There is no user with this email" })
	public async findById(
		@Param("id") id: string,
	): Promise<{ data: UserEntity }> {
		const user = await this.userService.findByPublicId(id);

		return {
			data: plainToClass(UserEntity, user),
		};
	}

	@Get("list")
	@ApiOkResponse({
		description: "Users found",
		example: UserDTO,
		isArray: true,
	})
	public async list(): Promise<{ count: number; data: UserEntity[] }> {
		const users = await this.userService.findMany();

		return {
			count: await this.userService.count(),
			data: users.map((user) => plainToClass(UserEntity, user)),
		};
	}
}
