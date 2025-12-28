-- CreateTable
CREATE TABLE "email_verified_tokens" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "expiredAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "email_verified_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "email_verified_tokens_token_key" ON "email_verified_tokens"("token");

-- CreateIndex
CREATE INDEX "email_verified_tokens_email_idx" ON "email_verified_tokens"("email");
