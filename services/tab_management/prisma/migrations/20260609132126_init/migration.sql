-- CreateEnum
CREATE TYPE "TabStatus" AS ENUM ('OPEN', 'ACTIVE', 'PENDING_SETTLEMENT', 'CLOSED', 'ABANDONED');

-- CreateTable
CREATE TABLE "tabs" (
    "tab_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "venue_id" TEXT NOT NULL,
    "payment_method_id" TEXT NOT NULL,
    "pos_tab_reference" TEXT,
    "status" "TabStatus" NOT NULL DEFAULT 'OPEN',
    "pre_auth_amount_pesewas" INTEGER NOT NULL,
    "running_total_pesewas" INTEGER NOT NULL DEFAULT 0,
    "opened_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_activity_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "closed_at" TIMESTAMP(3),
    "transactions" TEXT[],

    CONSTRAINT "tabs_pkey" PRIMARY KEY ("tab_id")
);

-- CreateTable
CREATE TABLE "tab_items" (
    "item_id" TEXT NOT NULL,
    "tab_id" TEXT NOT NULL,
    "pos_item_id" TEXT NOT NULL,
    "item_name" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "unit_price_pesewas" INTEGER NOT NULL,
    "total_price_pesewas" INTEGER NOT NULL,
    "ordered_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tab_items_pkey" PRIMARY KEY ("item_id")
);

-- CreateIndex
CREATE INDEX "idx_tabs_status_venue" ON "tabs"("status", "venue_id");

-- AddForeignKey
ALTER TABLE "tab_items" ADD CONSTRAINT "tab_items_tab_id_fkey" FOREIGN KEY ("tab_id") REFERENCES "tabs"("tab_id") ON DELETE CASCADE ON UPDATE CASCADE;
