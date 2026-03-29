ALTER TABLE "AdminUser"
ADD COLUMN "email" TEXT;

CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");
