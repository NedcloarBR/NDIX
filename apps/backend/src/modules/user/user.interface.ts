import type { UserEntity } from ".";
import type { UserDTO } from "./user.dto";

export interface IUserService {
	create(data: UserDTO): Promise<UserEntity>;
	findByPublicId(publicId: string): Promise<UserEntity>;
	findByDocument(document: string): Promise<UserEntity>;
	findByEmail(email: string): Promise<UserEntity>;
	findMany(): Promise<UserEntity[]>;
	update(document: string, money: number): Promise<UserEntity>;
	count(): Promise<number>;
}

export interface IUserRepository {
	create(data: UserDTO): Promise<UserEntity>;
	findByPublicId(publicId: string): Promise<UserEntity>;
	findByDocument(document: string): Promise<UserEntity>;
	findByEmail(email: string): Promise<UserEntity>;
	findMany(): Promise<UserEntity[]>;
	update(document: string, money: number): Promise<UserEntity>;
	count(): Promise<number>;
}
