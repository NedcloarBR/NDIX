import { HttpStatus } from "@nestjs/common";
import { Test, type TestingModule } from "@nestjs/testing";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import type { CustomPrismaService } from "nestjs-prisma";
import type { ExtendedPrismaClient } from "src/modules/database/ExtendedPrismaClient";
import {
	UserController,
	UserEntity,
	UserRepository,
	UserService,
} from "src/modules/user";
import { Repositories, Services } from "src/types/constants";
import { beforeEach, describe, expect, it } from "vitest";
import type { DeepMockProxy } from "vitest-mock-extended";
import { mockPrismaProvider, userMockInput } from "./__mocks__";

describe("UserModule Tests", () => {
	let userController: UserController;
	let userService: UserService;
	let userRepository: UserRepository;
	let prismaMock: DeepMockProxy<ExtendedPrismaClient>;

	beforeEach(async () => {
		const moduleRef: TestingModule = await Test.createTestingModule({
			controllers: [UserController],
			providers: [
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

		userController = moduleRef.get<UserController>(UserController);
		userService = moduleRef.get<UserService>(Services.User);
		userRepository = moduleRef.get<UserRepository>(Repositories.User);
		prismaMock = moduleRef.get<
			DeepMockProxy<CustomPrismaService<ExtendedPrismaClient>>
		>(Services.Prisma).client;
	});

	describe("Is dependencies defined?", () => {
		it("userController", () => {
			expect(userController).toBeDefined();
		});

		it("userService", () => {
			expect(userService).toBeDefined();
		});

		it("userRepository", () => {
			expect(userRepository).toBeDefined();
		});

		it("prismaMock", () => {
			expect(prismaMock).toBeDefined();
		});
	});

	it("should return the controller message", () => {
		const expected = { message: "UserModule Controller" };

		const result = userController.get();

		expect(result).toStrictEqual(expected);
	});

	describe("/POST users", async () => {
		const { mockInput, expected, rawInput } =
			await userMockInput("79148189090");

		it("should create a user", async () => {
			prismaMock.user.create.mockResolvedValue(mockInput);
			const result = await userController.create(rawInput);

			expect(result).toStrictEqual(expected);
		});

		it("should not create a user", async () => {
			prismaMock.user.create.mockRejectedValue(
				new PrismaClientKnownRequestError(
					"Failed to create user in the database",
					{
						code: HttpStatus.CONFLICT.toString(),
						clientVersion: "mock",
					},
				),
			);

			try {
				await userController.create(rawInput);
			} catch (error) {
				expect(error).toBeInstanceOf(PrismaClientKnownRequestError);
				expect(error.message).toBe("Failed to create user in the database");
			}
		});
	});

	describe("GET /document", async () => {
		let document: string;

		it("should get a user using CPF", async () => {
			document = "79148189090";
			const { expected, mockInput } = await userMockInput(document);

			prismaMock.user.findFirstOrThrow.mockResolvedValue(mockInput);
			const result = await userController.findByDocument({ document });

			expect(result).toStrictEqual(expected);
		});

		it("should get a user using CNPJ", async () => {
			document = "30347915000139";
			const { expected, mockInput } = await userMockInput(document);

			prismaMock.user.findFirstOrThrow.mockResolvedValue(mockInput);
			const result = await userController.findByDocument({ document });

			expect(result).toStrictEqual(expected);
		});

		it("should not get a user", async () => {
			document = "";

			prismaMock.user.findFirstOrThrow.mockRejectedValue(
				new PrismaClientKnownRequestError("User not found in the database", {
					code: HttpStatus.NOT_FOUND.toString(),
					clientVersion: "mock",
				}),
			);

			try {
				await userController.findByDocument({ document });
			} catch (error) {
				expect(error).toBeInstanceOf(PrismaClientKnownRequestError);
				expect(error.message).toBe("User not found in the database");
			}
		});
	});

	describe("GET /email", async () => {
		let email: string;
		it("should get a user using CNPJ", async () => {
			email = "nedcloar1@hotmail.com";
			const { expected, mockInput } = await userMockInput();

			prismaMock.user.findFirstOrThrow.mockResolvedValue(mockInput);
			const result = await userController.findByEmail({ email });

			expect(result).toStrictEqual(expected);
		});

		it("should not get a user", async () => {
			email = "";

			prismaMock.user.findFirstOrThrow.mockRejectedValue(
				new PrismaClientKnownRequestError("User not found in the database", {
					code: HttpStatus.NOT_FOUND.toString(),
					clientVersion: "mock",
				}),
			);

			try {
				await userController.findByEmail({ email });
			} catch (error) {
				expect(error).toBeInstanceOf(PrismaClientKnownRequestError);
				expect(error.message).toBe("User not found in the database");
			}
		});
	});

	describe("GET /", async () => {
		let publicId: string;
		it("should get a user using publicId", async () => {
			publicId = "0a8ee1f5-1373-4767-9389-f76abf22bf4f";
			const { expected, mockInput } = await userMockInput();

			prismaMock.user.findFirstOrThrow.mockResolvedValue(mockInput);
			const result = await userController.findById(publicId);

			expect(result).toStrictEqual(expected);
		});

		it("should not get a user", async () => {
			publicId = "";

			prismaMock.user.findFirstOrThrow.mockRejectedValue(
				new PrismaClientKnownRequestError("User not found in the database", {
					code: HttpStatus.NOT_FOUND.toString(),
					clientVersion: "mock",
				}),
			);

			try {
				await userController.findById(publicId);
			} catch (error) {
				expect(error).toBeInstanceOf(PrismaClientKnownRequestError);
				expect(error.message).toBe("User not found in the database");
			}
		});
	});

	it("should get all users", async () => {
		const { expected: userData } = await userMockInput();
		const users: UserEntity[] = [];
		const mockReturn = [];
		for (let i = 0; i < 10; i++) {
			mockReturn.push(userData.data);
			users.push({ ...userData.data });
		}

		prismaMock.user.findMany.mockResolvedValue(mockReturn);
		prismaMock.user.count.mockResolvedValue(10);

		const result = await userController.list();
		const expected = {
			count: users.length,
			data: users,
		};

		expect(result).toStrictEqual(expected);
	});
});
