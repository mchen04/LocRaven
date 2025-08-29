import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [{
    ignores: [
        ".next/**",
        ".open-next/**",
        "dist/**",
        "build/**",
        "out/**",
        "node_modules/**",
        ".env*",
        "*.tmp",
        "temp/**",
        "tmp/**",
        "*.d.ts",
        "!types/index.d.ts",
        "next.config.mjs",
        "tailwind.config.js",
        "postcss.config.js",
        "coverage/**",
        "*.test.ts",
        "*.test.tsx",
        "*.spec.ts",
        "*.spec.tsx",
        ".wrangler/**",
        ".vercel/**"
    ]
}, ...compat.extends("next/core-web-vitals", "next/typescript"), {
    plugins: {
        "@typescript-eslint": typescriptEslint,
    },

    languageOptions: {
        parser: tsParser,
    },

    rules: {
        "@typescript-eslint/no-unused-vars": "warn",
        "@typescript-eslint/no-explicit-any": "warn",
        "prefer-const": "warn",
        "no-console": "warn",
    },
}];