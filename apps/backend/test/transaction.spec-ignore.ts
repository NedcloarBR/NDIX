import { Test, type TestingModule } from "@nestjs/testing";
import type { CustomPrismaService } from "nestjs-prisma";
import { UnauthorizedError } from "src/common/errors";
import { UserModule } from "src/modules";
import type { ExtendedPrismaClient } from "src/modules/database/ExtendedPrismaClient";
import {
	TransactionController,
	TransactionEntity,
	TransactionRepository,
	TransactionService,
} from "src/modules/transaction";
import { TransactionDTO } from "src/modules/transaction/transaction.dto";
import { UserEntity, UserRepository, UserService } from "src/modules/user";
import { Repositories, Services } from "src/types/constants";
import { beforeEach, describe, expect, it } from "vitest";
import type { DeepMockProxy } from "vitest-mock-extended";
import { mockPrismaProvider, transactionMockInput } from "./__mocks__";

describe("TransactionModule Tests", () => {
	let transactionController: TransactionController;
	let transactionService: TransactionService;
	let userService: UserService;
	let transactionRepository: TransactionRepository;
	let prismaMock: DeepMockProxy<ExtendedPrismaClient>;

	beforeEach(async () => {
		const moduleRef: TestingModule = await Test.createTestingModule({
			// imports: [UserModule],
			controllers: [TransactionController],
			providers: [
				{
					provide: Services.Transaction,
					useClass: TransactionService,
				},
				{
					provide: Repositories.Transaction,
					useClass: TransactionRepository,
				},
				{
					provide: Services.User,
					useClass: UserService,
				},
				{
					provide: Repositories.User,
					useClass: UserRepository,
				},
				mockPrismaProvider,
			],
		}).compile();

		transactionController = moduleRef.get<TransactionController>(
			TransactionController,
		);
		transactionService = moduleRef.get<TransactionService>(
			Services.Transaction,
		);
		userService = moduleRef.get<UserService>(Services.User);
		transactionRepository = moduleRef.get<TransactionRepository>(
			Repositories.Transaction,
		);
		prismaMock = moduleRef.get<
			DeepMockProxy<CustomPrismaService<ExtendedPrismaClient>>
		>(Services.Prisma).client;
	});

	describe("Is dependencies defined?", () => {
		it("transactionController", () => {
			expect(transactionController).toBeDefined();
		});

		it("transactionService", () => {
			expect(transactionService).toBeDefined();
		});

		it("transactionRepository", () => {
			expect(transactionRepository).toBeDefined();
		});

		it("userService", () => {
			expect(userService).toBeDefined();
		});

		it("prismaMock", () => {
			expect(prismaMock).toBeDefined();
		});
	});

	it("should return the controller message", () => {
		const expected = { message: "TransactionModule Controller" };

		const result = transactionController.get();

		expect(result).toStrictEqual(expected);
	});

	describe("/POST transaction", () => {
		let cpfUser1: UserEntity;
		let cpfUser2: UserEntity;
		let cnpjUser1: UserEntity;
		let cnpjUser2: UserEntity;

		beforeEach(async () => {
			const users = await transactionMockInput();

			cpfUser1 = users.cpfUser1;
			cpfUser2 = users.cpfUser2;
			cnpjUser1 = users.cnpjUser1;
			cnpjUser2 = users.cnpjUser2;
		});

		it("should create a transaction from CPF to CPF user", async () => {
			prismaMock.user.findFirst.mockResolvedValue({
				...cpfUser1,
				id: 0,
				password: "Mock",
			});
			const sender = await userService.findByPublicId(cpfUser1.publicId);
			prismaMock.user.findFirst.mockResolvedValue({
				...cpfUser2,
				id: 1,
				password: "Mock",
			});
			const receiver = await userService.findByPublicId(cpfUser2.publicId);

			const data: TransactionDTO = {
				senderDocument: sender.document,
				receiverDocument: receiver.document,
				value: 100,
			};

			const expected = {
				id: "cd2df795-58e9-45a9-b018-31c77f74b47f",
				senderId: sender.publicId,
				receiverId: receiver.publicId,
				timestamp: expect.any(Date),
				value: 100,
			};

			prismaMock.transaction.create.mockResolvedValue({
				id: "cd2df795-58e9-45a9-b018-31c77f74b47f",
				senderId: sender.publicId,
				receiverId: receiver.publicId,
				timestamp: new Date(),
				value: 100,
			});
			const transaction = await transactionController.create(data);

			expect(expected).toStrictEqual(transaction);
			expect(sender.money).toBe(0);
			expect(receiver.money).toBe(200);
		});

		it("should create a transaction from CPF to CNPJ user", async () => {
			prismaMock.user.findFirst.mockResolvedValue({
				...cpfUser1,
				id: 0,
				password: "Mock",
			});
			const sender = await userService.findByPublicId(cpfUser1.publicId);
			prismaMock.user.findFirst.mockResolvedValue({
				...cnpjUser1,
				id: 1,
				password: "Mock",
			});
			const receiver = await userService.findByPublicId(cnpjUser1.publicId);

			const data: TransactionDTO = {
				senderDocument: sender.document,
				receiverDocument: receiver.document,
				value: 100,
			};

			const expected = {
				id: "cd2df795-58e9-45a9-b018-31c77f74b47f",
				senderId: sender.publicId,
				receiverId: receiver.publicId,
				timestamp: expect.any(Date),
				value: 100,
			};

			prismaMock.transaction.create.mockResolvedValue({
				id: "cd2df795-58e9-45a9-b018-31c77f74b47f",
				senderId: sender.publicId,
				receiverId: receiver.publicId,
				timestamp: new Date(),
				value: 100,
			});
			const transaction = await transactionController.create(data);

			expect(expected).toStrictEqual(transaction);
			expect(sender.money).toBe(0);
			expect(receiver.money).toBe(200);
		});

		it("should not create a transaction from CNPJ to CNPJ user", async () => {
			prismaMock.user.findFirst.mockResolvedValue({
				...cpfUser1,
				id: 0,
				password: "Mock",
			});
			const sender = await userService.findByPublicId(cnpjUser1.publicId);
			prismaMock.user.findFirst.mockResolvedValue({
				...cnpjUser1,
				id: 1,
				password: "Mock",
			});
			const receiver = await userService.findByPublicId(cnpjUser2.publicId);

			const data: TransactionDTO = {
				senderDocument: sender.document,
				receiverDocument: receiver.document,
				value: 100,
			};

			try {
				await transactionController.create(data);
			} catch (error) {
				expect(error).toBeInstanceOf(UnauthorizedError);
				expect(error.message).toBe("CNPJ não pode enviar");
			}
		});

		it("should not create a transaction from CNPJ to CPF user", async () => {
			prismaMock.user.findFirst.mockResolvedValue({
				...cpfUser1,
				id: 0,
				password: "Mock",
			});
			const sender = await userService.findByPublicId(cnpjUser1.publicId);
			prismaMock.user.findFirst.mockResolvedValue({
				...cnpjUser1,
				id: 1,
				password: "Mock",
			});
			const receiver = await userService.findByPublicId(cpfUser1.publicId);

			const data: TransactionDTO = {
				senderDocument: sender.document,
				receiverDocument: receiver.document,
				value: 100,
			};

			prismaMock.transaction.create.mockRejectedValue(
				new UnauthorizedError("CNPJ não pode enviar"),
			);
			try {
				await transactionController.create(data);
			} catch (error) {
				expect(error).toBeInstanceOf(UnauthorizedError);
				expect(error.message).toBe("CNPJ não pode enviar");
			}
		});

		it("should not create a transaction because user don't have the specified money amount", async () => {
			prismaMock.user.findFirst.mockResolvedValue({
				...cpfUser1,
				id: 0,
				password: "Mock",
			});
			const sender = await userService.findByPublicId(cpfUser1.publicId);
			prismaMock.user.findFirst.mockResolvedValue({
				...cpfUser2,
				id: 1,
				password: "Mock",
			});
			const receiver = await userService.findByPublicId(cpfUser2.publicId);

			const data: TransactionDTO = {
				senderDocument: sender.document,
				receiverDocument: receiver.document,
				value: 200,
			};

			prismaMock.transaction.create.mockRejectedValue(
				new UnauthorizedError("Sender não tem dinheiro o suficiente"),
			);
			try {
				await transactionController.create(data);
			} catch (error) {
				expect(error).toBeInstanceOf(UnauthorizedError);
				expect(error.message).toBe("Sender não tem dinheiro o suficiente");
			}
		});

		it("should not create a transaction because user cannot transfer to yourself", async () => {
			prismaMock.user.findFirst.mockResolvedValue({
				...cpfUser1,
				id: 0,
				password: "Mock",
			});
			const sender = await userService.findByPublicId(cpfUser1.publicId);
			prismaMock.user.findFirst.mockResolvedValue({
				...cpfUser1,
				id: 1,
				password: "Mock",
			});
			const receiver = await userService.findByPublicId(cpfUser1.publicId);

			const data: TransactionDTO = {
				senderDocument: sender.document,
				receiverDocument: receiver.document,
				value: 100,
			};

			prismaMock.transaction.create.mockRejectedValue(
				new UnauthorizedError("Não é possível enviar para si mesmo"),
			);
			try {
				await transactionController.create(data);
			} catch (error) {
				expect(error).toBeInstanceOf(UnauthorizedError);
				expect(error.message).toBe("Não é possível enviar para si mesmo");
			}
		});
	});
});
