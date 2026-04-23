-- CreateEnum
CREATE TYPE "TenantStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('SUPER_ADMIN', 'TENANT_OWNER', 'FARM_MANAGER', 'ACCOUNTANT', 'FIELD_OFFICER', 'WORKER');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INVITED', 'INACTIVE');

-- CreateEnum
CREATE TYPE "FarmStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "FieldStatus" AS ENUM ('AVAILABLE', 'PLANTED', 'FALLOW', 'MAINTENANCE');

-- CreateEnum
CREATE TYPE "SeasonStatus" AS ENUM ('PLANNED', 'ACTIVE', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "CropPlanStatus" AS ENUM ('PLANNED', 'PLANTED', 'GROWING', 'HARVESTED', 'FAILED');

-- CreateEnum
CREATE TYPE "ActivityType" AS ENUM ('LAND_PREPARATION', 'PLANTING', 'WEEDING', 'IRRIGATION', 'FERTILIZER_APPLICATION', 'PESTICIDE_APPLICATION', 'HARVESTING', 'SCOUTING', 'MAINTENANCE', 'OTHER');

-- CreateEnum
CREATE TYPE "ActivityStatus" AS ENUM ('PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ExpenseCategory" AS ENUM ('LABOR', 'SEEDS', 'FERTILIZER', 'CHEMICALS', 'TRANSPORT', 'UTILITIES', 'MACHINERY_MAINTENANCE', 'MISCELLANEOUS');

-- CreateEnum
CREATE TYPE "InventoryItemType" AS ENUM ('SEED', 'FERTILIZER', 'CHEMICAL', 'TOOL', 'FUEL', 'OTHER');

-- CreateEnum
CREATE TYPE "InventoryTransactionType" AS ENUM ('STOCK_IN', 'STOCK_OUT', 'ADJUSTMENT');

-- CreateEnum
CREATE TYPE "UnitOfMeasure" AS ENUM ('KG', 'TON', 'LITRE', 'BAG', 'UNIT', 'HECTARE', 'ACRE');

-- CreateEnum
CREATE TYPE "YieldQualityGrade" AS ENUM ('PREMIUM', 'STANDARD', 'SUBSTANDARD');

-- CreateTable
CREATE TABLE "Tenant" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "legal_name" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "country" TEXT,
    "state" TEXT,
    "city" TEXT,
    "address" TEXT,
    "status" "TenantStatus" NOT NULL DEFAULT 'ACTIVE',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Tenant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenant_settings" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'NGN',
    "timezone" TEXT NOT NULL DEFAULT 'Africa/Lagos',
    "financial_year_start_month" INTEGER NOT NULL DEFAULT 1,
    "date_format" TEXT NOT NULL DEFAULT 'YYYY-MM-DD',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tenant_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "tenant_id" UUID,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "refresh_token_hash" TEXT,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "phone" TEXT,
    "job_title" TEXT,
    "role" "UserRole" NOT NULL,
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "last_login_at" TIMESTAMP(3),
    "created_by_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Farm" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "description" TEXT,
    "address" TEXT,
    "country" TEXT,
    "state" TEXT,
    "city" TEXT,
    "latitude" DECIMAL(10,7),
    "longitude" DECIMAL(10,7),
    "size_in_hectares" DECIMAL(12,2),
    "status" "FarmStatus" NOT NULL DEFAULT 'ACTIVE',
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Farm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Field" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "farm_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "size_in_hectares" DECIMAL(12,2),
    "soil_type" TEXT,
    "latitude" DECIMAL(10,7),
    "longitude" DECIMAL(10,7),
    "status" "FieldStatus" NOT NULL DEFAULT 'AVAILABLE',
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Field_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Season" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "farm_id" UUID,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3),
    "status" "SeasonStatus" NOT NULL DEFAULT 'PLANNED',
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Season_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CropPlan" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "farm_id" UUID NOT NULL,
    "field_id" UUID NOT NULL,
    "season_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "variety" TEXT,
    "planting_date" TIMESTAMP(3),
    "expected_harvest_date" TIMESTAMP(3),
    "actual_harvest_date" TIMESTAMP(3),
    "status" "CropPlanStatus" NOT NULL DEFAULT 'PLANNED',
    "area_cultivated" DECIMAL(12,2),
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "CropPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FarmActivity" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "farm_id" UUID NOT NULL,
    "field_id" UUID,
    "season_id" UUID,
    "crop_plan_id" UUID,
    "assigned_user_id" UUID,
    "activity_type" "ActivityType" NOT NULL,
    "status" "ActivityStatus" NOT NULL DEFAULT 'PLANNED',
    "scheduled_date" TIMESTAMP(3) NOT NULL,
    "completed_date" TIMESTAMP(3),
    "notes" TEXT,
    "estimated_cost" DECIMAL(12,2),
    "actual_cost" DECIMAL(12,2),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "FarmActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Expense" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "farm_id" UUID NOT NULL,
    "field_id" UUID,
    "season_id" UUID,
    "crop_plan_id" UUID,
    "activity_id" UUID,
    "category" "ExpenseCategory" NOT NULL,
    "description" TEXT,
    "amount" DECIMAL(14,2) NOT NULL,
    "payment_date" TIMESTAMP(3) NOT NULL,
    "vendor" TEXT,
    "receipt_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Expense_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "YieldRecord" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "farm_id" UUID NOT NULL,
    "field_id" UUID NOT NULL,
    "season_id" UUID NOT NULL,
    "crop_plan_id" UUID NOT NULL,
    "harvest_date" TIMESTAMP(3) NOT NULL,
    "quantity" DECIMAL(14,2) NOT NULL,
    "unit" "UnitOfMeasure" NOT NULL,
    "quality_grade" "YieldQualityGrade",
    "loss_waste" DECIMAL(14,2),
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "YieldRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InventoryItem" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "sku" TEXT,
    "item_type" "InventoryItemType" NOT NULL,
    "unit" "UnitOfMeasure" NOT NULL,
    "quantity_on_hand" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "reorder_level" DECIMAL(14,2),
    "supplier" TEXT,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "InventoryItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InventoryTransaction" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "inventory_item_id" UUID NOT NULL,
    "expense_id" UUID,
    "activity_id" UUID,
    "transaction_type" "InventoryTransactionType" NOT NULL,
    "quantity" DECIMAL(14,2) NOT NULL,
    "unit_cost" DECIMAL(14,2),
    "transaction_date" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "InventoryTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tenant_slug_key" ON "Tenant"("slug");

-- CreateIndex
CREATE INDEX "Tenant_status_idx" ON "Tenant"("status");

-- CreateIndex
CREATE INDEX "Tenant_deleted_at_idx" ON "Tenant"("deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "tenant_settings_tenant_id_key" ON "tenant_settings"("tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_tenant_id_idx" ON "User"("tenant_id");

-- CreateIndex
CREATE INDEX "User_tenant_id_role_idx" ON "User"("tenant_id", "role");

-- CreateIndex
CREATE INDEX "User_tenant_id_status_idx" ON "User"("tenant_id", "status");

-- CreateIndex
CREATE INDEX "User_deleted_at_idx" ON "User"("deleted_at");

-- CreateIndex
CREATE INDEX "Farm_tenant_id_idx" ON "Farm"("tenant_id");

-- CreateIndex
CREATE INDEX "Farm_tenant_id_status_idx" ON "Farm"("tenant_id", "status");

-- CreateIndex
CREATE INDEX "Farm_deleted_at_idx" ON "Farm"("deleted_at");

-- CreateIndex
CREATE INDEX "Field_tenant_id_idx" ON "Field"("tenant_id");

-- CreateIndex
CREATE INDEX "Field_farm_id_idx" ON "Field"("farm_id");

-- CreateIndex
CREATE INDEX "Field_tenant_id_farm_id_idx" ON "Field"("tenant_id", "farm_id");

-- CreateIndex
CREATE INDEX "Field_deleted_at_idx" ON "Field"("deleted_at");

-- CreateIndex
CREATE INDEX "Season_tenant_id_idx" ON "Season"("tenant_id");

-- CreateIndex
CREATE INDEX "Season_farm_id_idx" ON "Season"("farm_id");

-- CreateIndex
CREATE INDEX "Season_tenant_id_status_idx" ON "Season"("tenant_id", "status");

-- CreateIndex
CREATE INDEX "Season_deleted_at_idx" ON "Season"("deleted_at");

-- CreateIndex
CREATE INDEX "CropPlan_tenant_id_idx" ON "CropPlan"("tenant_id");

-- CreateIndex
CREATE INDEX "CropPlan_farm_id_idx" ON "CropPlan"("farm_id");

-- CreateIndex
CREATE INDEX "CropPlan_field_id_idx" ON "CropPlan"("field_id");

-- CreateIndex
CREATE INDEX "CropPlan_season_id_idx" ON "CropPlan"("season_id");

-- CreateIndex
CREATE INDEX "CropPlan_tenant_id_status_idx" ON "CropPlan"("tenant_id", "status");

-- CreateIndex
CREATE INDEX "CropPlan_deleted_at_idx" ON "CropPlan"("deleted_at");

-- CreateIndex
CREATE INDEX "FarmActivity_tenant_id_idx" ON "FarmActivity"("tenant_id");

-- CreateIndex
CREATE INDEX "FarmActivity_farm_id_idx" ON "FarmActivity"("farm_id");

-- CreateIndex
CREATE INDEX "FarmActivity_field_id_idx" ON "FarmActivity"("field_id");

-- CreateIndex
CREATE INDEX "FarmActivity_season_id_idx" ON "FarmActivity"("season_id");

-- CreateIndex
CREATE INDEX "FarmActivity_crop_plan_id_idx" ON "FarmActivity"("crop_plan_id");

-- CreateIndex
CREATE INDEX "FarmActivity_assigned_user_id_idx" ON "FarmActivity"("assigned_user_id");

-- CreateIndex
CREATE INDEX "FarmActivity_scheduled_date_idx" ON "FarmActivity"("scheduled_date");

-- CreateIndex
CREATE INDEX "FarmActivity_tenant_id_status_idx" ON "FarmActivity"("tenant_id", "status");

-- CreateIndex
CREATE INDEX "FarmActivity_deleted_at_idx" ON "FarmActivity"("deleted_at");

-- CreateIndex
CREATE INDEX "Expense_tenant_id_idx" ON "Expense"("tenant_id");

-- CreateIndex
CREATE INDEX "Expense_farm_id_idx" ON "Expense"("farm_id");

-- CreateIndex
CREATE INDEX "Expense_field_id_idx" ON "Expense"("field_id");

-- CreateIndex
CREATE INDEX "Expense_season_id_idx" ON "Expense"("season_id");

-- CreateIndex
CREATE INDEX "Expense_crop_plan_id_idx" ON "Expense"("crop_plan_id");

-- CreateIndex
CREATE INDEX "Expense_activity_id_idx" ON "Expense"("activity_id");

-- CreateIndex
CREATE INDEX "Expense_payment_date_idx" ON "Expense"("payment_date");

-- CreateIndex
CREATE INDEX "Expense_tenant_id_category_idx" ON "Expense"("tenant_id", "category");

-- CreateIndex
CREATE INDEX "Expense_deleted_at_idx" ON "Expense"("deleted_at");

-- CreateIndex
CREATE INDEX "YieldRecord_tenant_id_idx" ON "YieldRecord"("tenant_id");

-- CreateIndex
CREATE INDEX "YieldRecord_farm_id_idx" ON "YieldRecord"("farm_id");

-- CreateIndex
CREATE INDEX "YieldRecord_field_id_idx" ON "YieldRecord"("field_id");

-- CreateIndex
CREATE INDEX "YieldRecord_season_id_idx" ON "YieldRecord"("season_id");

-- CreateIndex
CREATE INDEX "YieldRecord_crop_plan_id_idx" ON "YieldRecord"("crop_plan_id");

-- CreateIndex
CREATE INDEX "YieldRecord_harvest_date_idx" ON "YieldRecord"("harvest_date");

-- CreateIndex
CREATE INDEX "YieldRecord_deleted_at_idx" ON "YieldRecord"("deleted_at");

-- CreateIndex
CREATE INDEX "InventoryItem_tenant_id_idx" ON "InventoryItem"("tenant_id");

-- CreateIndex
CREATE INDEX "InventoryItem_tenant_id_item_type_idx" ON "InventoryItem"("tenant_id", "item_type");

-- CreateIndex
CREATE INDEX "InventoryItem_deleted_at_idx" ON "InventoryItem"("deleted_at");

-- CreateIndex
CREATE INDEX "InventoryTransaction_tenant_id_idx" ON "InventoryTransaction"("tenant_id");

-- CreateIndex
CREATE INDEX "InventoryTransaction_inventory_item_id_idx" ON "InventoryTransaction"("inventory_item_id");

-- CreateIndex
CREATE INDEX "InventoryTransaction_expense_id_idx" ON "InventoryTransaction"("expense_id");

-- CreateIndex
CREATE INDEX "InventoryTransaction_activity_id_idx" ON "InventoryTransaction"("activity_id");

-- CreateIndex
CREATE INDEX "InventoryTransaction_transaction_date_idx" ON "InventoryTransaction"("transaction_date");

-- CreateIndex
CREATE INDEX "InventoryTransaction_deleted_at_idx" ON "InventoryTransaction"("deleted_at");

-- AddForeignKey
ALTER TABLE "tenant_settings" ADD CONSTRAINT "tenant_settings_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "Tenant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Farm" ADD CONSTRAINT "Farm_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Field" ADD CONSTRAINT "Field_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Field" ADD CONSTRAINT "Field_farm_id_fkey" FOREIGN KEY ("farm_id") REFERENCES "Farm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Season" ADD CONSTRAINT "Season_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Season" ADD CONSTRAINT "Season_farm_id_fkey" FOREIGN KEY ("farm_id") REFERENCES "Farm"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CropPlan" ADD CONSTRAINT "CropPlan_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CropPlan" ADD CONSTRAINT "CropPlan_farm_id_fkey" FOREIGN KEY ("farm_id") REFERENCES "Farm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CropPlan" ADD CONSTRAINT "CropPlan_field_id_fkey" FOREIGN KEY ("field_id") REFERENCES "Field"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CropPlan" ADD CONSTRAINT "CropPlan_season_id_fkey" FOREIGN KEY ("season_id") REFERENCES "Season"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FarmActivity" ADD CONSTRAINT "FarmActivity_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FarmActivity" ADD CONSTRAINT "FarmActivity_farm_id_fkey" FOREIGN KEY ("farm_id") REFERENCES "Farm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FarmActivity" ADD CONSTRAINT "FarmActivity_field_id_fkey" FOREIGN KEY ("field_id") REFERENCES "Field"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FarmActivity" ADD CONSTRAINT "FarmActivity_season_id_fkey" FOREIGN KEY ("season_id") REFERENCES "Season"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FarmActivity" ADD CONSTRAINT "FarmActivity_crop_plan_id_fkey" FOREIGN KEY ("crop_plan_id") REFERENCES "CropPlan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FarmActivity" ADD CONSTRAINT "FarmActivity_assigned_user_id_fkey" FOREIGN KEY ("assigned_user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_farm_id_fkey" FOREIGN KEY ("farm_id") REFERENCES "Farm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_field_id_fkey" FOREIGN KEY ("field_id") REFERENCES "Field"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_season_id_fkey" FOREIGN KEY ("season_id") REFERENCES "Season"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_crop_plan_id_fkey" FOREIGN KEY ("crop_plan_id") REFERENCES "CropPlan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_activity_id_fkey" FOREIGN KEY ("activity_id") REFERENCES "FarmActivity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "YieldRecord" ADD CONSTRAINT "YieldRecord_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "YieldRecord" ADD CONSTRAINT "YieldRecord_farm_id_fkey" FOREIGN KEY ("farm_id") REFERENCES "Farm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "YieldRecord" ADD CONSTRAINT "YieldRecord_field_id_fkey" FOREIGN KEY ("field_id") REFERENCES "Field"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "YieldRecord" ADD CONSTRAINT "YieldRecord_season_id_fkey" FOREIGN KEY ("season_id") REFERENCES "Season"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "YieldRecord" ADD CONSTRAINT "YieldRecord_crop_plan_id_fkey" FOREIGN KEY ("crop_plan_id") REFERENCES "CropPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryItem" ADD CONSTRAINT "InventoryItem_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryTransaction" ADD CONSTRAINT "InventoryTransaction_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryTransaction" ADD CONSTRAINT "InventoryTransaction_inventory_item_id_fkey" FOREIGN KEY ("inventory_item_id") REFERENCES "InventoryItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryTransaction" ADD CONSTRAINT "InventoryTransaction_expense_id_fkey" FOREIGN KEY ("expense_id") REFERENCES "Expense"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryTransaction" ADD CONSTRAINT "InventoryTransaction_activity_id_fkey" FOREIGN KEY ("activity_id") REFERENCES "FarmActivity"("id") ON DELETE SET NULL ON UPDATE CASCADE;
