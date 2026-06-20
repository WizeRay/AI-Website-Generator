CREATE SCHEMA "public";
CREATE TYPE "role" AS ENUM('user', 'assistant');
CREATE TABLE "account" (
	"id" text PRIMARY KEY,
	"accountId" text NOT NULL,
	"providerId" text NOT NULL,
	"userId" text NOT NULL,
	"accessToken" text,
	"refreshToken" text,
	"idToken" text,
	"accessTokenExpiresAt" timestamp with time zone,
	"refreshTokenExpiresAt" timestamp with time zone,
	"scope" text,
	"password" text,
	"createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp with time zone NOT NULL
);
CREATE TABLE "conversation" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"role" role NOT NULL,
	"content" text NOT NULL,
	"timestamp" timestamp DEFAULT now() NOT NULL,
	"project_id" uuid NOT NULL
);
CREATE TABLE "session" (
	"id" text PRIMARY KEY,
	"expiresAt" timestamp with time zone NOT NULL,
	"token" text NOT NULL CONSTRAINT "session_token_key" UNIQUE,
	"createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp with time zone NOT NULL,
	"ipAddress" text,
	"userAgent" text,
	"userId" text NOT NULL
);
CREATE TABLE "transaction" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"is_paid" boolean DEFAULT false NOT NULL,
	"plan_id" text NOT NULL,
	"amount" double precision NOT NULL,
	"credits" integer NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
CREATE TABLE "user" (
	"id" text PRIMARY KEY,
	"name" text NOT NULL,
	"email" text NOT NULL CONSTRAINT "user_email_key" UNIQUE,
	"emailVerified" boolean NOT NULL,
	"image" text,
	"createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"totalCreation" integer DEFAULT 0 NOT NULL,
	"credits" integer DEFAULT 20 NOT NULL
);
CREATE TABLE "verification" (
	"id" text PRIMARY KEY,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expiresAt" timestamp with time zone NOT NULL,
	"createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE TABLE "version" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"code" text NOT NULL,
	"description" text,
	"timestamp" timestamp DEFAULT now() NOT NULL,
	"project_id" uuid NOT NULL
);
CREATE TABLE "website_project" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" text NOT NULL,
	"initial_prompt" text NOT NULL,
	"current_code" text,
	"current_version_index" text DEFAULT '' NOT NULL,
	"user_id" text NOT NULL,
	"is_published" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
CREATE UNIQUE INDEX "account_pkey" ON "account" ("id");
CREATE INDEX "account_userId_idx" ON "account" ("userId");
CREATE UNIQUE INDEX "conversation_pkey" ON "conversation" ("id");
CREATE UNIQUE INDEX "session_pkey" ON "session" ("id");
CREATE UNIQUE INDEX "session_token_key" ON "session" ("token");
CREATE INDEX "session_userId_idx" ON "session" ("userId");
CREATE UNIQUE INDEX "transaction_pkey" ON "transaction" ("id");
CREATE UNIQUE INDEX "user_email_key" ON "user" ("email");
CREATE UNIQUE INDEX "user_pkey" ON "user" ("id");
CREATE INDEX "verification_identifier_idx" ON "verification" ("identifier");
CREATE UNIQUE INDEX "verification_pkey" ON "verification" ("id");
CREATE UNIQUE INDEX "version_pkey" ON "version" ("id");
CREATE UNIQUE INDEX "website_project_pkey" ON "website_project" ("id");
ALTER TABLE "account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE;
ALTER TABLE "conversation" ADD CONSTRAINT "fk_conversation_project" FOREIGN KEY ("project_id") REFERENCES "website_project"("id") ON DELETE CASCADE;
ALTER TABLE "session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE;
ALTER TABLE "transaction" ADD CONSTRAINT "fk_transaction_user" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;
ALTER TABLE "version" ADD CONSTRAINT "fk_version_project" FOREIGN KEY ("project_id") REFERENCES "website_project"("id") ON DELETE CASCADE;
ALTER TABLE "website_project" ADD CONSTRAINT "fk_project_user" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;