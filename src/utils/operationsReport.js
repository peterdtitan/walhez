const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const crewAllowances = [
  { role: "Dredger Master", dailyAllowance: 5000, headcount: 1 },
  { role: "Engineer", dailyAllowance: 5000, headcount: 1 },
  { role: "Deckhand", dailyAllowance: 3000, headcount: 2 },
];

const diesel = {
  pricePerKeg: 35500,
  litersPerKeg: 30,
  kegsPerDay: 16,
  weeklyBuffer: 100000,
};

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value);

const formatNumber = (value, maximumFractionDigits = 0) =>
  new Intl.NumberFormat("en-NG", { maximumFractionDigits }).format(value);

const dailyCrewTotal = crewAllowances.reduce(
  (total, member) => total + member.dailyAllowance * member.headcount,
  0
);

const dieselDailyTotal = diesel.pricePerKeg * diesel.kegsPerDay;
const dieselWeeklyTotal = dieselDailyTotal * weekDays.length;
const crewWeeklyTotal = dailyCrewTotal * weekDays.length;
const weeklySubtotal = dieselWeeklyTotal + crewWeeklyTotal;
const weeklyGrandTotal = weeklySubtotal + diesel.weeklyBuffer;
const weeklyLiters = diesel.litersPerKeg * diesel.kegsPerDay * weekDays.length;
const costPerLiter = diesel.pricePerKeg / diesel.litersPerKeg;

const dailyBreakdown = weekDays.map((day) => ({
  day,
  dieselCost: dieselDailyTotal,
  crewCost: dailyCrewTotal,
  totalCost: dieselDailyTotal + dailyCrewTotal,
  dieselKegs: diesel.kegsPerDay,
  dieselLiters: diesel.kegsPerDay * diesel.litersPerKeg,
}));

const crewBreakdown = crewAllowances.map((member) => ({
  ...member,
  teamSizeLabel: member.headcount > 1 ? `${member.headcount} crew` : "1 crew",
  dailyTotal: member.dailyAllowance * member.headcount,
  weeklyTotal: member.dailyAllowance * member.headcount * weekDays.length,
}));

const costComposition = [
  { label: "Diesel", value: dieselWeeklyTotal, color: "#f2c94c" },
  { label: "Crew allowances", value: crewWeeklyTotal, color: "#1e2d44" },
  { label: "Diesel buffer", value: diesel.weeklyBuffer, color: "#9c3d2b" },
];

export const operationsReport = {
  title: "Weekly Dredging & Sand Supply Operations Sheet",
  subtitle: "Financial breakdown for Monday to Saturday operations",
  weekDays,
  diesel,
  crewAllowances,
  dailyCrewTotal,
  dieselDailyTotal,
  dieselWeeklyTotal,
  crewWeeklyTotal,
  weeklySubtotal,
  weeklyGrandTotal,
  weeklyLiters,
  costPerLiter,
  dailyBreakdown,
  crewBreakdown,
  costComposition,
  formatCurrency,
  formatNumber,
};
