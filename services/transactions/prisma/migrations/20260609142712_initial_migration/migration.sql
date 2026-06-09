-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('PRE_AUTH', 'TOP_UP', 'CAPTURE', 'REFUND');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED');

-- CreateTable
CREATE TABLE "payment_methods" (
    "payment_method_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "gateway_customer_token" TEXT NOT NULL,
    "gateway_payment_token" TEXT NOT NULL,
    "provider_type" TEXT NOT NULL,
    "masked_identifier" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "tabs" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payment_methods_pkey" PRIMARY KEY ("payment_method_id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "transaction_id" TEXT NOT NULL,
    "tab_id" TEXT NOT NULL,
    "idempotency_key" TEXT NOT NULL,
    "gateway_transaction_id" TEXT,
    "type" "TransactionType" NOT NULL,
    "status" "TransactionStatus" NOT NULL DEFAULT 'PENDING',
    "amount_pesewas" INTEGER NOT NULL,
    "gratuity_pesewas" INTEGER NOT NULL DEFAULT 0,
    "error_message" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("transaction_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "transactions_idempotency_key_key" ON "transactions"("idempotency_key");
