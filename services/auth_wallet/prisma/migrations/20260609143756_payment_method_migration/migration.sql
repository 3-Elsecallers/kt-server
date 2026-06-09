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

-- AddForeignKey
ALTER TABLE "payment_methods" ADD CONSTRAINT "payment_methods_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
