import path from "path";
import { defineConfig } from "rollup";
import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import { builtinModules } from 'module';
import terser from '@rollup/plugin-terser';
import commonjs from '@rollup/plugin-commonjs';

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
        commonjs({
            include: /node_modules/,
            requireReturnsDefault: 'auto'
        }),
        typescript({
            exclude: 'node_modules'
        }),
        terser()
    ],
    watch: {
        clearScreen: true,
        include: [
            "index.ts",
            "commands/**/*",
            "config/**/*",
            "utils/**/*"
        ]
    }
});
