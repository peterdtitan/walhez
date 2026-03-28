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

export const OPERATIONAL_EXPENSE_TYPES = [
  { value: "CREW_SALARY", label: "Crew salary", group: "SALARY" },
  { value: "CREW_ALLOWANCE", label: "Crew allowance", group: "SALARY" },
  { value: "DIESEL_PURCHASE", label: "Diesel purchase", group: "GENERAL" },
  { value: "FUEL_PURCHASE", label: "Fuel purchase", group: "GENERAL" },
  { value: "SAND_PURCHASE", label: "Sand purchase", group: "GENERAL" },
  { value: "REPAIRS", label: "Repairs", group: "GENERAL" },
  { value: "MOBILIZATION", label: "Mobilization", group: "GENERAL" },
  { value: "DEMOBILIZATION", label: "Demobilization", group: "GENERAL" },
  { value: "ROAD_SETTLEMENT", label: "Road settlement", group: "GENERAL" },
];

export const OPERATIONAL_EXPENSE_LABELS = {
  CREW_SALARY: "Crew salary",
  CREW_ALLOWANCE: "Crew allowance",
  DIESEL_PURCHASE: "Diesel purchase",
  FUEL_PURCHASE: "Fuel purchase",
  SAND_PURCHASE: "Sand purchase",
  REPAIRS: "Repairs",
  MOBILIZATION: "Mobilization",
  DEMOBILIZATION: "Demobilization",
  ROAD_SETTLEMENT: "Road settlement",
};

export const TYPE_LABELS = {
  EXPENSE: "Expense",
  INCOME: "Income",
};

export const REPORT_TARGET_TYPE_OPTIONS = [
  { value: "EQUIPMENT", label: "Equipment" },
  { value: "PROJECT", label: "Project" },
  { value: "SALARY", label: "Salary entries" },
  { value: "OTHER_OPERATIONAL", label: "Other operational entries" },
];

export const REPORT_TARGET_OPTIONS = [
  {
    value: "VESPA_SITE",
    label: "VESPA Site",
    targetType: "PROJECT",
    description: "Project position",
  },
  {
    value: "SALARY_ENTRIES",
    label: "Salary entries",
    targetType: "SALARY",
    description: "Crew salary and allowance entries not tied to a listed equipment.",
  },
  {
    value: "OTHER_OPERATIONAL_ENTRIES",
    label: "Other operational entries",
    targetType: "OTHER_OPERATIONAL",
    description: "Operational entries for equipment or running cost items not added yet.",
  },
];

export const REPORT_TARGET_LABELS = {
  VESPA_SITE: "VESPA Site",
  SALARY_ENTRIES: "Salary entries",
  OTHER_OPERATIONAL_ENTRIES: "Other operational entries",
};

export const REPORT_TARGET_DETAILS = {
  VESPA_SITE: {
    label: "VESPA Site",
    targetType: "PROJECT",
    description: "Project position",
  },
  SALARY_ENTRIES: {
    label: "Salary entries",
    targetType: "SALARY",
    description: "Crew salary and allowance entries not tied to a listed equipment.",
  },
  OTHER_OPERATIONAL_ENTRIES: {
    label: "Other operational entries",
    targetType: "OTHER_OPERATIONAL",
    description: "Operational entries for equipment or running cost items not added yet.",
  },
};

export const SPECIAL_REPORT_TARGET_DEFAULTS = {
  SALARY: "SALARY_ENTRIES",
  OTHER_OPERATIONAL: "OTHER_OPERATIONAL_ENTRIES",
};

export const SALARY_OPERATIONAL_EXPENSE_VALUES = [
  "CREW_SALARY",
  "CREW_ALLOWANCE",
];

export function getReportTargetsForType(targetType) {
  return REPORT_TARGET_OPTIONS.filter((item) => item.targetType === targetType);
}

export function getCategoriesForType(type) {
  return type === "INCOME" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
}
