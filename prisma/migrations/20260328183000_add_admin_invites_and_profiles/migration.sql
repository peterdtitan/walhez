ALTER TABLE "AdminUser"
ADD COLUMN "firstName" TEXT,
ADD COLUMN "lastName" TEXT,
ADD COLUMN "inviteToken" TEXT,
ADD COLUMN "inviteExpiresAt" TIMESTAMP(3),
ADD COLUMN "invitedAt" TIMESTAMP(3),
ADD COLUMN "activatedAt" TIMESTAMP(3);

ALTER TABLE "AdminUser"
ALTER COLUMN "passwordHash" DROP NOT NULL;

UPDATE "AdminUser"
SET "activatedAt" = NOW()
WHERE "passwordHash" IS NOT NULL
  AND "activatedAt" IS NULL;

CREATE UNIQUE INDEX "AdminUser_inviteToken_key" ON "AdminUser"("inviteToken");
