import { defineConfig } from "vitest/config";

// biome-ignore lint/style/noDefaultExport: <explanation>
export default defineConfig({
	plugins: [],
	test: {
		watch: false,
		deps: {
			interopDefault: true,
		},
		environment: "node",
		coverage: {
			provider: "v8",
			reporter: ["text", "html", "lcov"],
			reportsDirectory: "test/coverage",
		},
		reporters: "default",
		include: ["**/*.spec.ts"],
	},
	root: ".",
});
