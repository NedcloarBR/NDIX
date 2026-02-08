import { Inject, Injectable } from "@nestjs/common";
// biome-ignore lint/style/useImportType: <Cannot useImportType in classes used in Injection>
import { CustomPrismaService } from "nestjs-prisma";
import { Services } from "../../types/constants";
import type { ExtendedPrismaClient } from "../database/ExtendedPrismaClient";
import type { IUserRepository, UserEntity } from ".";
import type { UserDTO } from "./user.dto";

@Injectable()
export class UserRepository implements IUserRepository {
	public constructor(
		@Inject(Services.Prisma)
		private readonly prisma: CustomPrismaService<ExtendedPrismaClient>,
	) {}

	public async create(data: UserDTO): Promise<UserEntity> {
		return await this.prisma.client.user.create({
			data,
			include: {
				receivedTransactions: true,
				sentTransactions: true,
			},
		});
	}

	public async findByPublicId(publicId: string): Promise<UserEntity> {
		return await this.prisma.client.user.findFirstOrThrow({
			where: {
				publicId,
			},
			include: {
				receivedTransactions: true,
				sentTransactions: true,
			},
		});
	}

	public async findByDocument(document: string): Promise<UserEntity> {
		return await this.prisma.client.user.findFirstOrThrow({
			where: {
				document,
			},
			include: {
				receivedTransactions: true,
				sentTransactions: true,
			},
		});
	}

	public async findByEmail(email: string): Promise<UserEntity> {
		return await this.prisma.client.user.findFirstOrThrow({
			where: {
				email,
			},
			include: {
				receivedTransactions: true,
				sentTransactions: true,
			},
		});
	}

	public async findMany(): Promise<UserEntity[]> {
		return await this.prisma.client.user.findMany({
			include: {
				receivedTransactions: true,
				sentTransactions: true,
			},
		});
	}

	public async update(document: string, money: number): Promise<UserEntity> {
		return await this.prisma.client.user.update({
			where: {
				document,
			},
			data: {
				money,
			},
			include: {
				receivedTransactions: true,
				sentTransactions: true,
			},
		});
	}

	public async count(): Promise<number> {
		return await this.prisma.client.user.count();
	}
}
