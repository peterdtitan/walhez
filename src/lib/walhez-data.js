import "server-only";

import { CATEGORY_LABELS } from "./report-options";
import { prisma } from "./prisma";

export function toEquipmentCard(equipment) {
  return {
    ...equipment,
    characteristics: [...equipment.characteristics].sort(
      (left, right) => left.sortOrder - right.sortOrder
    ),
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
  const [equipment, entries] = await Promise.all([
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
      orderBy: {
        entryDate: "desc",
      },
      take: 12,
    }),
  ]);

  return {
    equipment: equipment.map(toEquipmentCard),
    recentEntries: entries.map((entry) => ({
      ...entry,
      categoryLabel: CATEGORY_LABELS[entry.category],
    })),
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

  for (const item of equipment) {
    equipmentTotalsMap.set(item.id, {
      equipmentId: item.id,
      equipmentName: item.name,
      expense: 0,
      income: 0,
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

    const equipmentTotal = equipmentTotalsMap.get(entry.equipmentId);

    if (entry.type === "EXPENSE") {
      equipmentTotal.expense += entry.amount;
    } else {
      equipmentTotal.income += entry.amount;
    }

    equipmentTotalsMap.set(entry.equipmentId, equipmentTotal);
  }

  const equipmentSummaries = [...equipmentTotalsMap.values()]
    .map((summary) => ({
      ...summary,
      net: summary.income - summary.expense,
    }))
    .sort((left, right) => right.expense + right.income - (left.expense + left.income));

  return {
    equipment,
    entries: entries.map((entry) => ({
      ...entry,
      categoryLabel: CATEGORY_LABELS[entry.category],
    })),
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
