import type { Provider } from "@nestjs/common";
import type { CustomPrismaService } from "nestjs-prisma";
import type { ExtendedPrismaClient } from "src/modules/database/ExtendedPrismaClient";
import { Services } from "src/types/constants";
import { type DeepMockProxy, mockDeep } from "vitest-mock-extended";

export const mockPrismaProvider: Provider = {
	provide: Services.Prisma,
	useValue: <DeepMockProxy<CustomPrismaService<ExtendedPrismaClient>>>{
		client: mockDeep<ExtendedPrismaClient>(),
	},
};
