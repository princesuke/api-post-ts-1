import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().positive().max(65535),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string(),
  HASHER_MEMORY_COST: z.coerce.number().positive(),
  HASHER_TIME_COST: z.coerce.number().positive(),
  HASHER_PARALLELISM: z.coerce.number().positive(),
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
});

export type Env = z.infer<typeof envSchema>;

function parseEnv(config: Record<string, string | undefined>): Env {
  const result = envSchema.safeParse(config);

  if (!result.success) {
    console.error(
      "❌ Invalid environment variables:",
      result.error.flatten().fieldErrors
    );
    throw new Error("Failed to load environment variables.");
  }

  return result.data;
}

export const env = parseEnv(process.env);
