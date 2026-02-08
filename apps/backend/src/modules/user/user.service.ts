import { Inject, Injectable } from "@nestjs/common";
import { genSalt, hash } from "bcrypt";
import { Repositories } from "../../types/constants";
import { PasswordUtils } from "../../utils/password";
// biome-ignore lint/style/useImportType: <Cannot useImportType in DTOs>
import {
	type IUserRepository,
	type IUserService,
	UserDTO,
	type UserEntity,
} from ".";

@Injectable()
export class UserService implements IUserService {
	public constructor(
		@Inject(Repositories.User) private readonly userRepository: IUserRepository,
	) {}

	public async create(data: UserDTO): Promise<UserEntity> {
		const { password, ...rest } = data;
		const hashedPassword = await PasswordUtils.hash(password);
		return await this.userRepository.create({
			...rest,
			password: hashedPassword,
		});
	}

	public async findByPublicId(publicId: string): Promise<UserEntity> {
		return await this.userRepository.findByPublicId(publicId);
	}

	public async findByDocument(document: string): Promise<UserEntity> {
		return await this.userRepository.findByDocument(document);
	}

	public async findByEmail(email: string): Promise<UserEntity> {
		return await this.userRepository.findByEmail(email);
	}

	public async findMany(): Promise<UserEntity[]> {
		return await this.userRepository.findMany();
	}

	public async update(document: string, money: number): Promise<UserEntity> {
		return await this.userRepository.update(document, money);
	}

	public async count(): Promise<number> {
		return await this.userRepository.count();
	}

	private async hashData(data: UserDTO): Promise<UserDTO> {
		const salt = await genSalt();
		const { password, ...rest } = data;
		const hashedPassword = await hash(password, salt);
		return {
			password: hashedPassword,
			...rest,
		} as UserDTO;
	}
}
