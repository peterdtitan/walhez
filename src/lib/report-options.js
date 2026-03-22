export const REPORT_TYPES = [
  { value: "EXPENSE", label: "Expense" },
  { value: "INCOME", label: "Income" },
];

export const EXPENSE_CATEGORIES = [
  { value: "PREVENTIVE_MAINTENANCE", label: "Preventive maintenance" },
  { value: "ROUTINE_SERVICING", label: "Routine servicing" },
  { value: "BREAKDOWN_REPAIR", label: "Breakdown repair" },
  { value: "OPERATIONAL_EXPENSE", label: "Operational expense" },
];

export const INCOME_CATEGORIES = [
  { value: "RENTAL_INCOME", label: "Rental income" },
  { value: "PROJECT_INCOME", label: "Project income" },
  { value: "OTHER_INCOME", label: "Other income" },
];

export const CATEGORY_LABELS = {
  PREVENTIVE_MAINTENANCE: "Preventive maintenance",
  ROUTINE_SERVICING: "Routine servicing",
  BREAKDOWN_REPAIR: "Breakdown repair",
  OPERATIONAL_EXPENSE: "Operational expense",
  RENTAL_INCOME: "Rental income",
  PROJECT_INCOME: "Project income",
  OTHER_INCOME: "Other income",
};

export const TYPE_LABELS = {
  EXPENSE: "Expense",
  INCOME: "Income",
};

export function getCategoriesForType(type) {
  return type === "INCOME" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
}
