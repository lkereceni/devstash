-- Rename tables to plural snake_case and columns to snake_case.
-- Written as renames rather than the drop/create Prisma generates for
-- @@map changes, so no data is lost and it is safe on any environment.

ALTER TABLE "User" RENAME TO "users";
ALTER TABLE "users" RENAME COLUMN "emailVerified" TO "email_verified";
ALTER TABLE "users" RENAME COLUMN "isPro" TO "is_pro";
ALTER TABLE "users" RENAME COLUMN "stripeCustomerId" TO "stripe_customer_id";
ALTER TABLE "users" RENAME COLUMN "stripeSubscriptionId" TO "stripe_subscription_id";
ALTER TABLE "users" RENAME COLUMN "createdAt" TO "created_at";
ALTER TABLE "users" RENAME COLUMN "updatedAt" TO "updated_at";

ALTER TABLE "Account" RENAME TO "accounts";
ALTER TABLE "accounts" RENAME COLUMN "userId" TO "user_id";
ALTER TABLE "accounts" RENAME COLUMN "providerAccountId" TO "provider_account_id";
ALTER TABLE "accounts" RENAME COLUMN "createdAt" TO "created_at";
ALTER TABLE "accounts" RENAME COLUMN "updatedAt" TO "updated_at";

ALTER TABLE "Session" RENAME TO "sessions";
ALTER TABLE "sessions" RENAME COLUMN "sessionToken" TO "session_token";
ALTER TABLE "sessions" RENAME COLUMN "userId" TO "user_id";
ALTER TABLE "sessions" RENAME COLUMN "createdAt" TO "created_at";
ALTER TABLE "sessions" RENAME COLUMN "updatedAt" TO "updated_at";

ALTER TABLE "VerificationToken" RENAME TO "verification_tokens";

ALTER TABLE "ItemType" RENAME TO "item_types";
ALTER TABLE "item_types" RENAME COLUMN "isSystem" TO "is_system";
ALTER TABLE "item_types" RENAME COLUMN "userId" TO "user_id";
ALTER TABLE "item_types" RENAME COLUMN "createdAt" TO "created_at";
ALTER TABLE "item_types" RENAME COLUMN "updatedAt" TO "updated_at";

ALTER TABLE "Collection" RENAME TO "collections";
ALTER TABLE "collections" RENAME COLUMN "isFavorite" TO "is_favorite";
ALTER TABLE "collections" RENAME COLUMN "userId" TO "user_id";
ALTER TABLE "collections" RENAME COLUMN "createdAt" TO "created_at";
ALTER TABLE "collections" RENAME COLUMN "updatedAt" TO "updated_at";

ALTER TABLE "Tag" RENAME TO "tags";
ALTER TABLE "tags" RENAME COLUMN "userId" TO "user_id";
ALTER TABLE "tags" RENAME COLUMN "createdAt" TO "created_at";

ALTER TABLE "Item" RENAME TO "items";
ALTER TABLE "items" RENAME COLUMN "contentType" TO "content_type";
ALTER TABLE "items" RENAME COLUMN "fileUrl" TO "file_url";
ALTER TABLE "items" RENAME COLUMN "fileName" TO "file_name";
ALTER TABLE "items" RENAME COLUMN "fileSize" TO "file_size";
ALTER TABLE "items" RENAME COLUMN "isFavorite" TO "is_favorite";
ALTER TABLE "items" RENAME COLUMN "isPinned" TO "is_pinned";
ALTER TABLE "items" RENAME COLUMN "userId" TO "user_id";
ALTER TABLE "items" RENAME COLUMN "typeId" TO "type_id";
ALTER TABLE "items" RENAME COLUMN "collectionId" TO "collection_id";
ALTER TABLE "items" RENAME COLUMN "createdAt" TO "created_at";
ALTER TABLE "items" RENAME COLUMN "updatedAt" TO "updated_at";

ALTER TABLE "ItemTag" RENAME TO "item_tags";
ALTER TABLE "item_tags" RENAME COLUMN "itemId" TO "item_id";
ALTER TABLE "item_tags" RENAME COLUMN "tagId" TO "tag_id";

-- Constraints and indexes keep their old names after a table rename.
ALTER TABLE "users" RENAME CONSTRAINT "User_pkey" TO "users_pkey";
ALTER TABLE "accounts" RENAME CONSTRAINT "Account_pkey" TO "accounts_pkey";
ALTER TABLE "sessions" RENAME CONSTRAINT "Session_pkey" TO "sessions_pkey";
ALTER TABLE "verification_tokens" RENAME CONSTRAINT "VerificationToken_pkey" TO "verification_tokens_pkey";
ALTER TABLE "items" RENAME CONSTRAINT "Item_pkey" TO "items_pkey";
ALTER TABLE "item_types" RENAME CONSTRAINT "ItemType_pkey" TO "item_types_pkey";
ALTER TABLE "collections" RENAME CONSTRAINT "Collection_pkey" TO "collections_pkey";
ALTER TABLE "tags" RENAME CONSTRAINT "Tag_pkey" TO "tags_pkey";
ALTER TABLE "item_tags" RENAME CONSTRAINT "ItemTag_pkey" TO "item_tags_pkey";
ALTER INDEX "User_email_key" RENAME TO "users_email_key";
ALTER INDEX "User_stripeCustomerId_key" RENAME TO "users_stripe_customer_id_key";
ALTER INDEX "User_stripeSubscriptionId_key" RENAME TO "users_stripe_subscription_id_key";
ALTER INDEX "ItemType_userId_name_key" RENAME TO "item_types_user_id_name_key";
ALTER INDEX "Collection_userId_name_key" RENAME TO "collections_user_id_name_key";
ALTER INDEX "Tag_userId_name_key" RENAME TO "tags_user_id_name_key";
ALTER INDEX "Account_userId_idx" RENAME TO "accounts_user_id_idx";
ALTER INDEX "Session_userId_idx" RENAME TO "sessions_user_id_idx";
ALTER INDEX "Item_userId_idx" RENAME TO "items_user_id_idx";
ALTER INDEX "Item_typeId_idx" RENAME TO "items_type_id_idx";
ALTER INDEX "Item_collectionId_idx" RENAME TO "items_collection_id_idx";
ALTER INDEX "Item_userId_updatedAt_idx" RENAME TO "items_user_id_updated_at_idx";
ALTER INDEX "Item_userId_isPinned_idx" RENAME TO "items_user_id_is_pinned_idx";
ALTER INDEX "Item_userId_isFavorite_idx" RENAME TO "items_user_id_is_favorite_idx";
ALTER INDEX "ItemType_userId_idx" RENAME TO "item_types_user_id_idx";
ALTER INDEX "Collection_userId_idx" RENAME TO "collections_user_id_idx";
ALTER INDEX "Collection_userId_updatedAt_idx" RENAME TO "collections_user_id_updated_at_idx";
ALTER INDEX "Collection_userId_isFavorite_idx" RENAME TO "collections_user_id_is_favorite_idx";
ALTER INDEX "Tag_userId_idx" RENAME TO "tags_user_id_idx";
ALTER INDEX "ItemTag_tagId_idx" RENAME TO "item_tags_tag_id_idx";
ALTER TABLE "accounts" RENAME CONSTRAINT "Account_userId_fkey" TO "accounts_user_id_fkey";
ALTER TABLE "sessions" RENAME CONSTRAINT "Session_userId_fkey" TO "sessions_user_id_fkey";
ALTER TABLE "items" RENAME CONSTRAINT "Item_userId_fkey" TO "items_user_id_fkey";
ALTER TABLE "items" RENAME CONSTRAINT "Item_typeId_fkey" TO "items_type_id_fkey";
ALTER TABLE "items" RENAME CONSTRAINT "Item_collectionId_fkey" TO "items_collection_id_fkey";
ALTER TABLE "item_types" RENAME CONSTRAINT "ItemType_userId_fkey" TO "item_types_user_id_fkey";
ALTER TABLE "collections" RENAME CONSTRAINT "Collection_userId_fkey" TO "collections_user_id_fkey";
ALTER TABLE "tags" RENAME CONSTRAINT "Tag_userId_fkey" TO "tags_user_id_fkey";
ALTER TABLE "item_tags" RENAME CONSTRAINT "ItemTag_itemId_fkey" TO "item_tags_item_id_fkey";
ALTER TABLE "item_tags" RENAME CONSTRAINT "ItemTag_tagId_fkey" TO "item_tags_tag_id_fkey";
