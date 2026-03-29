import "server-only";

import {
  CATEGORY_LABELS,
  OPERATIONAL_EXPENSE_LABELS,
  REPORT_TARGET_DETAILS,
  REPORT_TARGET_LABELS,
} from "./report-options";
import { prisma } from "./prisma";

export function toEquipmentCard(equipment) {
  return {
    ...equipment,
    characteristics: [...equipment.characteristics].sort(
      (left, right) => left.sortOrder - right.sortOrder
    ),
  };
}

function getEntryDateKey(value) {
  return new Date(value).toISOString().slice(0, 10);
}

function formatTrendDateLabel(dateKey) {
  const [year, month, day] = dateKey.split("-").map(Number);

  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
  });
}

function getTargetMeta(entry) {
  if (entry.equipment) {
    return {
      targetKey: entry.equipmentId || entry.equipment.id,
      targetName: entry.equipment.name,
      targetKind: "equipment",
      targetDescription: `${entry.equipment.company} ${entry.equipment.model}`.trim(),
    };
  }

  const details = entry.reportTarget ? REPORT_TARGET_DETAILS[entry.reportTarget] : null;

  return {
    targetKey: entry.reportTarget || entry.id,
    targetName: details?.label || "Unknown target",
    targetKind: details?.targetType?.toLowerCase() || "unknown",
    targetDescription: details?.description || "Unknown target",
  };
}

function toReportEntry(entry) {
  const { targetKey, targetName, targetKind, targetDescription } = getTargetMeta(entry);

  return {
    ...entry,
    targetKey,
    targetName,
    targetKind,
    targetDescription,
    categoryLabel: CATEGORY_LABELS[entry.category],
    operationalExpenseLabel: entry.operationalExpenseType
      ? OPERATIONAL_EXPENSE_LABELS[entry.operationalExpenseType]
      : null,
  };
}

export async function getAllEquipment() {
  const equipment = await prisma.equipment.findMany({
    include: {
      characteristics: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return equipment.map(toEquipmentCard);
}

export async function getAdminDashboardData() {
  const [equipment, entries, recentEntries] = await Promise.all([
    prisma.equipment.findMany({
      include: {
        characteristics: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.reportEntry.findMany({
      include: {
        equipment: true,
      },
      orderBy: [
        { entryDate: "desc" },
        { createdAt: "desc" },
      ],
    }),
    prisma.reportEntry.findMany({
      include: {
        equipment: true,
      },
      orderBy: {
        entryDate: "desc",
      },
      take: 12,
    }),
  ]);

  const totals = entries.reduce(
    (accumulator, entry) => {
      if (entry.type === "EXPENSE") {
        accumulator.expense += entry.amount;
      } else {
        accumulator.income += entry.amount;
      }

      return accumulator;
    },
    { expense: 0, income: 0 }
  );

  const equipmentExpenseMap = new Map();
  const categoryExpenseMap = new Map();
  const trendByDateMap = new Map();

  for (const item of equipment) {
    equipmentExpenseMap.set(item.id, {
      equipmentId: item.id,
      equipmentName: item.name,
      expense: 0,
      income: 0,
      entries: 0,
    });
  }

  for (const entry of entries) {
    const metricKey = entry.equipmentId || entry.reportTarget || entry.id;
    const equipmentMetric = equipmentExpenseMap.get(metricKey) || {
      equipmentId: metricKey,
      equipmentName:
        entry.equipment?.name || REPORT_TARGET_LABELS[entry.reportTarget] || "Unknown target",
      expense: 0,
      income: 0,
      entries: 0,
    };

    equipmentMetric.entries += 1;

    if (entry.type === "EXPENSE") {
      equipmentMetric.expense += entry.amount;

      const categoryMetric = categoryExpenseMap.get(entry.category) || {
        category: entry.category,
        label: CATEGORY_LABELS[entry.category],
        total: 0,
      };
      categoryMetric.total += entry.amount;
      categoryExpenseMap.set(entry.category, categoryMetric);
    } else {
      equipmentMetric.income += entry.amount;
    }

    equipmentExpenseMap.set(metricKey, equipmentMetric);

    const dateKey = getEntryDateKey(entry.entryDate);
    const trendMetric = trendByDateMap.get(dateKey) || {
      dateKey,
      label: formatTrendDateLabel(dateKey),
      expense: 0,
      income: 0,
    };

    if (entry.type === "EXPENSE") {
      trendMetric.expense += entry.amount;
    } else {
      trendMetric.income += entry.amount;
    }

    trendByDateMap.set(dateKey, trendMetric);
  }

  const equipmentMetrics = [...equipmentExpenseMap.values()]
    .map((item) => ({
      ...item,
      net: item.income - item.expense,
    }))
    .sort((left, right) => right.expense - left.expense);

  const monthlyTrend = [...trendByDateMap.values()]
    .sort((left, right) => left.dateKey.localeCompare(right.dateKey))
    .slice(-10);

  const topExpenseCategories = [...categoryExpenseMap.values()]
    .sort((left, right) => right.total - left.total)
    .slice(0, 5);

  return {
    equipment: equipment.map(toEquipmentCard),
    recentEntries: recentEntries.map(toReportEntry),
    dashboardMetrics: {
      totalEquipment: equipment.length,
      totalEntries: entries.length,
      totalExpense: totals.expense,
      totalIncome: totals.income,
      netPosition: totals.income - totals.expense,
      highestExpenseEquipment: equipmentMetrics.slice(0, 5),
      equipmentPerformance: equipmentMetrics.slice(0, 6),
      monthlyTrend,
      topExpenseCategories,
    },
  };
}

export async function getComprehensiveReportData() {
  const [equipment, entries] = await Promise.all([
    prisma.equipment.findMany({
      include: {
        characteristics: true,
      },
      orderBy: [
        { name: "asc" },
        { createdAt: "asc" },
      ],
    }),
    prisma.reportEntry.findMany({
      include: {
        equipment: true,
      },
      orderBy: [
        { entryDate: "desc" },
        { createdAt: "desc" },
      ],
    }),
  ]);

  const normalizedEntries = entries.map(toReportEntry);
  const totals = normalizedEntries.reduce(
    (accumulator, entry) => {
      if (entry.type === "EXPENSE") {
        accumulator.expense += entry.amount;
      } else {
        accumulator.income += entry.amount;
      }

      return accumulator;
    },
    { expense: 0, income: 0 }
  );

  const categoryTotalsMap = new Map();
  const operationalExpenseTotalsMap = new Map();
  const targetSummaryMap = new Map();
  const targetEntriesMap = new Map();
  const monthlyTotalsMap = new Map();

  for (const entry of normalizedEntries) {
    const categoryTotal = categoryTotalsMap.get(entry.category) || {
      category: entry.category,
      label: entry.categoryLabel,
      type: entry.type,
      total: 0,
      entries: 0,
    };
    categoryTotal.total += entry.amount;
    categoryTotal.entries += 1;
    categoryTotalsMap.set(entry.category, categoryTotal);

    if (entry.operationalExpenseType) {
      const operationalTotal = operationalExpenseTotalsMap.get(entry.operationalExpenseType) || {
        type: entry.operationalExpenseType,
        label: entry.operationalExpenseLabel || OPERATIONAL_EXPENSE_LABELS[entry.operationalExpenseType],
        total: 0,
        entries: 0,
      };
      operationalTotal.total += entry.amount;
      operationalTotal.entries += 1;
      operationalExpenseTotalsMap.set(entry.operationalExpenseType, operationalTotal);
    }

    const targetSummary = targetSummaryMap.get(entry.targetKey) || {
      targetKey: entry.targetKey,
      targetName: entry.targetName,
      targetKind: entry.targetKind,
      targetDescription: entry.targetDescription,
      expense: 0,
      income: 0,
      entries: 0,
    };
    targetSummary.entries += 1;

    if (entry.type === "EXPENSE") {
      targetSummary.expense += entry.amount;
    } else {
      targetSummary.income += entry.amount;
    }

    targetSummaryMap.set(entry.targetKey, targetSummary);

    const targetEntries = targetEntriesMap.get(entry.targetKey) || [];
    targetEntries.push(entry);
    targetEntriesMap.set(entry.targetKey, targetEntries);

    const monthKey = new Date(entry.entryDate).toISOString().slice(0, 7);
    const [year, month] = monthKey.split("-");
    const monthlyTotal = monthlyTotalsMap.get(monthKey) || {
      monthKey,
      label: new Date(Number(year), Number(month) - 1, 1).toLocaleDateString("en-GB", {
        month: "long",
        year: "numeric",
      }),
      expense: 0,
      income: 0,
      entries: 0,
    };

    if (entry.type === "EXPENSE") {
      monthlyTotal.expense += entry.amount;
    } else {
      monthlyTotal.income += entry.amount;
    }

    monthlyTotal.entries += 1;
    monthlyTotalsMap.set(monthKey, monthlyTotal);
  }

  const targetSummaries = [...targetSummaryMap.values()]
    .map((item) => ({
      ...item,
      net: item.income - item.expense,
    }))
    .sort((left, right) => right.expense + right.income - (left.expense + left.income));

  return {
    generatedAt: new Date().toISOString(),
    totals: {
      totalEquipment: equipment.length,
      totalTargetsWithEntries: targetSummaryMap.size,
      totalEntries: normalizedEntries.length,
      totalExpense: totals.expense,
      totalIncome: totals.income,
      netPosition: totals.income - totals.expense,
    },
    categoryTotals: [...categoryTotalsMap.values()].sort(
      (left, right) => right.total - left.total
    ),
    operationalExpenseTotals: [...operationalExpenseTotalsMap.values()].sort(
      (left, right) => right.total - left.total
    ),
    targetSummaries,
    targetEntryGroups: targetSummaries.map((summary) => ({
      ...summary,
      ledgerEntries: targetEntriesMap.get(summary.targetKey) || [],
    })),
    monthlyTotals: [...monthlyTotalsMap.values()].sort((left, right) =>
      left.monthKey.localeCompare(right.monthKey)
    ),
    equipmentRecords: equipment.map((item) => ({
      id: item.id,
      name: item.name,
      company: item.company,
      model: item.model,
      description: item.description,
      characteristics: [...item.characteristics].sort(
        (left, right) => left.sortOrder - right.sortOrder
      ),
      createdAt: item.createdAt,
    })),
    entries: normalizedEntries,
  };
}

export async function getOperationsReportData() {
  const [equipment, entries] = await Promise.all([
    prisma.equipment.findMany({
      orderBy: {
        name: "asc",
      },
    }),
    prisma.reportEntry.findMany({
      include: {
        equipment: true,
      },
      orderBy: [
        { entryDate: "desc" },
        { createdAt: "desc" },
      ],
    }),
  ]);

  const totals = entries.reduce(
    (accumulator, entry) => {
      if (entry.type === "EXPENSE") {
        accumulator.expense += entry.amount;
      } else {
        accumulator.income += entry.amount;
      }

      return accumulator;
    },
    { expense: 0, income: 0 }
  );

  const categoryTotalsMap = new Map();
  const equipmentTotalsMap = new Map();
  const reportTargetsMap = new Map();

  for (const item of equipment) {
    equipmentTotalsMap.set(item.id, {
      equipmentId: item.id,
      equipmentName: item.name,
      expense: 0,
      income: 0,
    });
    reportTargetsMap.set(item.id, {
      id: item.id,
      name: item.name,
      description: `${item.company} ${item.model}`.trim(),
      kind: "equipment",
    });
  }

  for (const [value, details] of Object.entries(REPORT_TARGET_DETAILS)) {
    reportTargetsMap.set(value, {
      id: value,
      name: details.label,
      description: details.description,
      kind: details.targetType.toLowerCase(),
    });
  }

  for (const entry of entries) {
    const categoryTotal = categoryTotalsMap.get(entry.category) || {
      category: entry.category,
      label: CATEGORY_LABELS[entry.category],
      type: entry.type,
      total: 0,
    };

    categoryTotal.total += entry.amount;
    categoryTotalsMap.set(entry.category, categoryTotal);

    const metricKey = entry.equipmentId || entry.reportTarget || entry.id;
    const equipmentTotal = equipmentTotalsMap.get(metricKey) || {
      equipmentId: metricKey,
      equipmentName:
        entry.equipment?.name || REPORT_TARGET_LABELS[entry.reportTarget] || "Unknown target",
      expense: 0,
      income: 0,
    };

    if (entry.type === "EXPENSE") {
      equipmentTotal.expense += entry.amount;
    } else {
      equipmentTotal.income += entry.amount;
    }

    equipmentTotalsMap.set(metricKey, equipmentTotal);
  }

  const equipmentSummaries = [...equipmentTotalsMap.values()]
    .map((summary) => ({
      ...summary,
      net: summary.income - summary.expense,
    }))
    .sort((left, right) => right.expense + right.income - (left.expense + left.income));

  return {
    equipment,
    reportTargets: [...reportTargetsMap.values()],
    entries: entries.map(toReportEntry),
    totals: {
      ...totals,
      net: totals.income - totals.expense,
    },
    categoryTotals: [...categoryTotalsMap.values()].sort(
      (left, right) => right.total - left.total
    ),
    equipmentSummaries,
  };
}
