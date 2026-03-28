"use server";

import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  clearAdminSession,
  createAdminSession,
  requireAdmin,
  verifyPassword,
} from "@/lib/auth";
import {
  getCategoriesForType,
  OPERATIONAL_EXPENSE_LABELS,
  REPORT_TARGET_OPTIONS,
  SALARY_OPERATIONAL_EXPENSE_VALUES,
} from "@/lib/report-options";
import { prisma } from "@/lib/prisma";

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function sanitizeFileName(filename) {
  const extension = path.extname(filename || "").toLowerCase() || ".png";
  const baseName = path
    .basename(filename || "equipment", extension)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `${baseName || "equipment"}-${Date.now()}${extension}`;
}

export async function loginAdminAction(_previousState, formData) {
  const username = String(formData.get("username") || "").trim();
  const password = String(formData.get("password") || "");

  if (!username || !password) {
    return {
      success: false,
      message: "Enter your username and password.",
    };
  }

  const admin = await prisma.adminUser.findUnique({
    where: { username },
  });

  if (!admin || !verifyPassword(password, admin.passwordHash)) {
    return {
      success: false,
      message: "Invalid login details.",
    };
  }

  await createAdminSession(admin.id);
  redirect("/admin");
}

export async function logoutAdminAction() {
  await requireAdmin();
  await clearAdminSession();
  redirect("/admin/login");
}

export async function createEquipmentAction(_previousState, formData) {
  await requireAdmin();

  const name = String(formData.get("name") || "").trim();
  const company = String(formData.get("company") || "").trim();
  const model = String(formData.get("model") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const imageMode = String(formData.get("imageMode") || "STATIC").trim();
  const imagePathInput = String(formData.get("imagePath") || "").trim();
  const imageFile = formData.get("imageFile");

  if (!name || !company || !model || !description) {
    return {
      success: false,
      message: "Fill in the name, company, model, and description fields.",
    };
  }

  const slug = slugify(name);
  const existingEquipment = await prisma.equipment.findUnique({
    where: { slug },
  });

  if (existingEquipment) {
    return {
      success: false,
      message: "An equipment with this name already exists.",
    };
  }

  let imagePath = imagePathInput;
  let imageSource = imageMode === "UPLOAD" ? "UPLOAD" : "STATIC";

  if (imageMode === "UPLOAD") {
    if (!imageFile || typeof imageFile === "string" || imageFile.size === 0) {
      return {
        success: false,
        message: "Choose an image file to upload.",
      };
    }

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    const fileName = sanitizeFileName(imageFile.name);
    const filePath = path.join(uploadsDir, fileName);
    const fileBuffer = Buffer.from(await imageFile.arrayBuffer());

    await mkdir(uploadsDir, { recursive: true });
    await writeFile(filePath, fileBuffer);
    imagePath = `/uploads/${fileName}`;
  } else if (!imagePath.startsWith("/")) {
    return {
      success: false,
      message: "Static image paths should look like /d6h.png or /tractor.png.",
    };
  }

  const characteristics = [0, 1, 2, 3]
    .map((index) => ({
      title: String(formData.get(`charTitle${index}`) || "").trim(),
      value: String(formData.get(`charValue${index}`) || "").trim(),
      sortOrder: index,
    }))
    .filter((item) => item.title && item.value);

  await prisma.equipment.create({
    data: {
      name,
      slug,
      company,
      model,
      description,
      imagePath,
      imageSource,
      characteristics: {
        create: characteristics,
      },
    },
  });

  revalidatePath("/admin");
  revalidatePath("/equipment");
  revalidatePath("/admin/reports/pdf/comprehensive");

  return {
    success: true,
    message: "Equipment added successfully.",
  };
}

export async function createReportEntryAction(_previousState, formData) {
  await requireAdmin();

  const equipmentId = String(formData.get("equipmentId") || "").trim();
  const reportTarget = String(formData.get("reportTarget") || "").trim();
  const type = String(formData.get("type") || "EXPENSE").trim();
  const category = String(formData.get("category") || "").trim();
  const titleInput = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const amountInput = Number(formData.get("amount") || 0);
  const entryDateInput = String(formData.get("entryDate") || "").trim();
  const operationalExpenseType = String(formData.get("operationalExpenseType") || "").trim();
  const quantityInput = Number(formData.get("quantity") || 0);
  const unitPriceInput = Number(formData.get("unitPrice") || 0);
  const isOperationalExpense = type === "EXPENSE" && category === "OPERATIONAL_EXPENSE";
  const isMeasuredPurchase =
    operationalExpenseType === "DIESEL_PURCHASE" ||
    operationalExpenseType === "FUEL_PURCHASE" ||
    operationalExpenseType === "SAND_PURCHASE";
  const title = titleInput || OPERATIONAL_EXPENSE_LABELS[operationalExpenseType] || "";
  const allowedReportTargets = new Set(REPORT_TARGET_OPTIONS.map((item) => item.value));
  const salaryReportTargets = new Set(
    REPORT_TARGET_OPTIONS.filter((item) => item.targetType === "SALARY").map(
      (item) => item.value
    )
  );
  const otherOperationalReportTargets = new Set(
    REPORT_TARGET_OPTIONS.filter((item) => item.targetType === "OTHER_OPERATIONAL").map(
      (item) => item.value
    )
  );
  const salaryOperationalExpenseTypes = new Set(SALARY_OPERATIONAL_EXPENSE_VALUES);
  const hasEquipmentTarget = Boolean(equipmentId);
  const hasNamedTarget = Boolean(reportTarget);

  if (!type || !category || !title || !description || !entryDateInput) {
    return {
      success: false,
      message: "Complete all report fields before saving.",
    };
  }

  if ((!hasEquipmentTarget && !hasNamedTarget) || (hasEquipmentTarget && hasNamedTarget)) {
    return {
      success: false,
      message: "Select either an equipment item or a report target.",
    };
  }

  if (hasNamedTarget && !allowedReportTargets.has(reportTarget)) {
    return {
      success: false,
      message: "Select a valid report target.",
    };
  }

  if (
    hasNamedTarget &&
    (salaryReportTargets.has(reportTarget) || otherOperationalReportTargets.has(reportTarget)) &&
    (type !== "EXPENSE" || category !== "OPERATIONAL_EXPENSE")
  ) {
    return {
      success: false,
      message: "Salary and other operational sections can only be saved as operational expenses.",
    };
  }

  if (isOperationalExpense && !operationalExpenseType) {
    return {
      success: false,
      message: "Select an operational expense item.",
    };
  }

  if (isMeasuredPurchase && (!Number.isFinite(quantityInput) || quantityInput <= 0)) {
    return {
      success: false,
      message:
        operationalExpenseType === "SAND_PURCHASE"
          ? "Enter the number of trips for the sand purchase."
          : "Enter the number of kegs for the fuel purchase.",
    };
  }

  if (isMeasuredPurchase && (!Number.isFinite(unitPriceInput) || unitPriceInput <= 0)) {
    return {
      success: false,
      message:
        operationalExpenseType === "SAND_PURCHASE"
          ? "Enter a valid unit price for each trip."
          : "Enter a valid unit price for each keg.",
    };
  }

  if (
    salaryReportTargets.has(reportTarget) &&
    !salaryOperationalExpenseTypes.has(operationalExpenseType)
  ) {
    return {
      success: false,
      message: "Salary entries must use Crew salary or Crew allowance.",
    };
  }

  if (
    otherOperationalReportTargets.has(reportTarget) &&
    salaryOperationalExpenseTypes.has(operationalExpenseType)
  ) {
    return {
      success: false,
      message: "Use the salary section for Crew salary and Crew allowance entries.",
    };
  }

  const amount = isMeasuredPurchase
    ? Math.round(quantityInput * unitPriceInput)
    : Math.round(amountInput);

  if (!Number.isFinite(amount) || amount <= 0) {
    return {
      success: false,
      message: "Amount must be a valid number greater than zero.",
    };
  }

  if (hasEquipmentTarget) {
    const equipment = await prisma.equipment.findUnique({
      where: { id: equipmentId },
    });

    if (!equipment) {
      return {
        success: false,
        message: "Select a valid equipment.",
      };
    }
  }

  const allowedCategories = getCategoriesForType(type).map((item) => item.value);

  if (!allowedCategories.includes(category)) {
    return {
      success: false,
      message: "The selected category does not match the report type.",
    };
  }

  const createData = {
    type,
    category,
    title,
    description,
    amount,
    entryDate: new Date(entryDateInput),
  };

  if (hasEquipmentTarget) {
    createData.equipmentId = equipmentId;
  }

  if (hasNamedTarget) {
    createData.reportTarget = reportTarget;
  }

  if (isOperationalExpense) {
    createData.operationalExpenseType = operationalExpenseType;
  }

  if (isMeasuredPurchase) {
    createData.quantity = Math.round(quantityInput);
    createData.unitPrice = Math.round(unitPriceInput);
  }

  await prisma.reportEntry.create({
    data: createData,
  });

  revalidatePath("/admin");
  revalidatePath("/admin/reports");
  revalidatePath("/admin/reports/pdf");
  revalidatePath("/admin/reports/pdf/comprehensive");
  revalidatePath("/operations-report");

  return {
    success: true,
    message: "Report entry recorded successfully.",
  };
}
