@@ .. @@
 -- AddForeignKey
 ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

+-- Add missing columns to User table for Google OAuth
+ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "google_oauth_id" VARCHAR(255);
+
+-- Add missing columns to events table
+ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "qr_code" TEXT;
+ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "event_url" TEXT;
+ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "sui_event_id" VARCHAR(255);
+ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "creator_wallet_address" VARCHAR(255);
+ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "poap_description" TEXT;