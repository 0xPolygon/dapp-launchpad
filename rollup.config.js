import path from "path";
import { defineConfig } from "rollup";
import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import { builtinModules } from 'module';
import terser from '@rollup/plugin-terser';

export default defineConfig({
    input: 'index.ts',
    output: {
        file: path.resolve("bin", "cli.js"),
        format: 'es',
        compact: true
    },
    external: [...builtinModules, "shelljs", "commander", "ethers", "chokidar", "chalk"],
    plugins: [
        nodeResolve(),
        json(),
        typescript({
            exclude: 'node_modules'
        }),
        terser()
    ],
    watch: {
        include: [
            "index.ts",
            "commands/**/*",
            "config/**/*",
            "utils/**/*"
        ]
    }
});