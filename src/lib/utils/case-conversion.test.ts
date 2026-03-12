import {
  snakeToCamel,
  camelToSnake,
  mapKeysSnakeToCamel,
  mapKeysCamelToSnake,
} from "./case-conversion";

let passed = 0;
let failed = 0;

function assert(label: string, actual: unknown, expected: unknown) {
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expected);
  if (a === e) {
    passed++;
    console.log(`  ✅ ${label}`);
  } else {
    failed++;
    console.error(`  ❌ ${label}`);
    console.error(`     expected: ${e}`);
    console.error(`     actual:   ${a}`);
  }
}

console.log("\n--- snakeToCamel ---");
assert("simple", snakeToCamel("featured_image"), "featuredImage");
assert("multiple underscores", snakeToCamel("youtube_video_id"), "youtubeVideoId");
assert("single word", snakeToCamel("slug"), "slug");
assert("already camel", snakeToCamel("createdAt"), "createdAt");
assert("leading underscore preserved", snakeToCamel("_id"), "_id");

console.log("\n--- camelToSnake ---");
assert("simple", camelToSnake("featuredImage"), "featured_image");
assert("multiple caps", camelToSnake("youtubeVideoId"), "youtube_video_id");
assert("single word", camelToSnake("slug"), "slug");
assert("already snake", camelToSnake("created_at"), "created_at");

console.log("\n--- mapKeysSnakeToCamel ---");
assert(
  "flat object",
  mapKeysSnakeToCamel({ created_at: "2024-01-01", is_active: true }),
  { createdAt: "2024-01-01", isActive: true },
);
assert(
  "preserves _id",
  mapKeysSnakeToCamel({ _id: "abc", featured_image: "url" }),
  { _id: "abc", featuredImage: "url" },
);
assert(
  "nested object",
  mapKeysSnakeToCamel({ author_bio: { first_name: "John" } }),
  { authorBio: { firstName: "John" } },
);
assert(
  "array of objects",
  mapKeysSnakeToCamel([{ start_date: "x" }, { end_date: "y" }]),
  [{ startDate: "x" }, { endDate: "y" }],
);
assert("null", mapKeysSnakeToCamel(null), null);
assert("undefined", mapKeysSnakeToCamel(undefined), undefined);
assert("primitive string", mapKeysSnakeToCamel("hello"), "hello");
assert("array of primitives", mapKeysSnakeToCamel(["a", "b"]), ["a", "b"]);

console.log("\n--- mapKeysCamelToSnake ---");
assert(
  "flat object",
  mapKeysCamelToSnake({ createdAt: "2024-01-01", isActive: true }),
  { created_at: "2024-01-01", is_active: true },
);
assert(
  "preserves _id",
  mapKeysCamelToSnake({ _id: "abc", featuredImage: "url" }),
  { _id: "abc", featured_image: "url" },
);
assert(
  "nested object",
  mapKeysCamelToSnake({ authorBio: { firstName: "John" } }),
  { author_bio: { first_name: "John" } },
);
assert(
  "array of objects",
  mapKeysCamelToSnake([{ startDate: "x" }, { endDate: "y" }]),
  [{ start_date: "x" }, { end_date: "y" }],
);
assert("null", mapKeysCamelToSnake(null), null);
assert("undefined", mapKeysCamelToSnake(undefined), undefined);

console.log("\n--- Round-trip ---");
const original = {
  _id: "123",
  created_at: "2024-01-01",
  is_active: true,
  featured_image_url: "https://example.com/img.jpg",
  title: { fr: "Bonjour", pt: "Olá", en: "Hello" },
  tags: ["a", "b"],
};
assert(
  "snake→camel→snake round-trip",
  mapKeysCamelToSnake(mapKeysSnakeToCamel(original)),
  original,
);

console.log(`\n${passed} passed, ${failed} failed\n`);
process.exit(failed > 0 ? 1 : 0);
