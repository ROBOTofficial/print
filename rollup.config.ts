import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import { defineConfig } from "rollup";

export default defineConfig({
	input: "src/index.ts",
	output: {
		esModule: true,
		file: "dist/index.js",
		format: "es",
		sourcemap: true
	},
	plugins: [typescript(), nodeResolve({ preferBuiltins: true }), commonjs()]
});
