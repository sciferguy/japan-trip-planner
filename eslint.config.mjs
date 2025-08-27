import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Prevent direct Date serialization in API responses
      "no-restricted-syntax": [
        "error",
        {
          "selector": "ReturnStatement > ObjectExpression > Property[key.name='data'] > NewExpression[callee.name='Date']",
          "message": "Avoid returning raw Date objects in API responses. Use toISOString() instead."
        },
        {
          "selector": "ReturnStatement > CallExpression[callee.object.name='NextResponse'][callee.property.name='json'] > ObjectExpression > Property > NewExpression[callee.name='Date']",
          "message": "Avoid serializing raw Date objects in API responses. Use toISOString() instead."
        }
      ],

      // Enforce consistent model naming (plural for Prisma models)
      "no-restricted-properties": [
        "error",
        {
          "object": "prisma",
          "property": "trip",
          "message": "Use prisma.trips (plural) instead of prisma.trip. Check NAMING_CONVENTIONS.md"
        },
        {
          "object": "prisma",
          "property": "day",
          "message": "Use prisma.days (plural) instead of prisma.day. Check NAMING_CONVENTIONS.md"
        },
        {
          "object": "prisma",
          "property": "place",
          "message": "Use prisma.places (plural) instead of prisma.place. Check NAMING_CONVENTIONS.md"
        },
        {
          "object": "prisma",
          "property": "itinerary_item",
          "message": "Use prisma.itinerary_items (plural) instead of prisma.itinerary_item. Check NAMING_CONVENTIONS.md"
        }
      ],

      // Prevent inconsistent API response formats
      "prefer-const": "error",
      "no-var": "error",

      // Enforce consistent error handling in API routes
      "no-console": ["warn", { "allow": ["warn", "error"] }],

      // React/Next.js specific improvements
      "@next/next/no-img-element": "error",
      "react/jsx-key": "error",
      "react/no-unescaped-entities": "error",

      // TypeScript improvements
      "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
      "@typescript-eslint/no-explicit-any": "warn",
      // Disabled because it requires type-aware linting; re-enable when parserOptions.project is configured
      "@typescript-eslint/prefer-optional-chain": "off",

      // Import organization
      "import/order": [
        "error",
        {
          "groups": [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index"
          ],
          "newlines-between": "never"
        }
      ]
    }
  }
];

export default eslintConfig;