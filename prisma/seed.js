const { PrismaClient, ImageSource } = require("@prisma/client");
const { scryptSync, randomBytes } = require("crypto");

const prisma = new PrismaClient();

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function hashPassword(password, salt = randomBytes(16).toString("hex")) {
  return `${salt}:${scryptSync(password, salt, 64).toString("hex")}`;
}

const equipmentSeed = [
  {
    name: "Dredger",
    imagePath: "/ellicott370.png",
    company: "Elicott",
    model: "370 Dragon",
    description:
      "Primary dredging unit used for sand excavation and channel recovery jobs requiring consistent slurry movement.",
    characteristics: [
      { title: "Dredging Depth", value: '18m (12" suction ladder pipe)' },
      { title: "Production Rate", value: "800-1200m³~" },
      { title: "Pump Size", value: "+++" },
    ],
  },
  {
    name: "Payloader",
    imagePath: "/payloader980.png",
    company: "CAT",
    model: "980",
    description:
      "Heavy loading equipment used for aggregate movement, truck loading, and site clearing operations.",
    characteristics: [
      { title: "Bucket Size", value: "4.0-8.0m³~" },
      { title: "Gross Power", value: "426hp" },
      { title: "Fuel Capacity", value: "426L" },
    ],
  },
  {
    name: "Excavator",
    imagePath: "/swampbuggy.png",
    company: "Cat",
    model: "Amphibious Excavator",
    description:
      "Amphibious excavator configured for marsh and wet-site earthworks where standard machines lose mobility.",
    characteristics: [
      { title: "Type", value: "Crawler Excavator" },
      { title: "Bucket", value: "Backhoe" },
      { title: "Transmission", value: "Hydraulic" },
    ],
  },
  {
    name: "Truck",
    imagePath: "/howodumptruck.png",
    company: "Howo",
    model: "Dump Truck",
    description:
      "Dump truck used for material haulage, site evacuation, and general logistics around excavation and fill projects.",
    characteristics: [
      { title: "Engine", value: "290hp" },
      { title: "Fuel Tank", value: "300L" },
      { title: "Rated Loading Weight", value: "7920kg" },
      { title: "Lift System", value: "Middle Hydraulic Lift" },
    ],
  },
  {
    name: "Bulldozer",
    imagePath: "/d6h.png",
    company: "Cat",
    model: "D6H Bulldozer",
    description:
      "Dozer for grading, pushing spoil, and preparing working surfaces before and during heavy site operations.",
    characteristics: [
      { title: "Engine", value: "165hp" },
      { title: "Operating Weight", value: "18 tons" },
      {
        title: "Undercarriage",
        value: '22.1"(Standard Shoe Size) - 6 Track Rollers Per Side',
      },
      { title: "Hydraulic System", value: "44.2 GPM Pump Flow Capacity" },
    ],
  },
];

async function main() {
  const username = process.env.ADMIN_USERNAME || "admin";
  const password = process.env.ADMIN_PASSWORD || "walhez123";

  await prisma.adminUser.upsert({
    where: { username },
    update: {
      passwordHash: hashPassword(password),
    },
    create: {
      username,
      passwordHash: hashPassword(password),
    },
  });

  for (const item of equipmentSeed) {
    const slug = slugify(item.name);

    await prisma.equipment.upsert({
      where: { slug },
      update: {
        name: item.name,
        company: item.company,
        model: item.model,
        description: item.description,
        imagePath: item.imagePath,
        imageSource: ImageSource.STATIC,
      },
      create: {
        name: item.name,
        slug,
        company: item.company,
        model: item.model,
        description: item.description,
        imagePath: item.imagePath,
        imageSource: ImageSource.STATIC,
      },
    });

    const equipment = await prisma.equipment.findUnique({
      where: { slug },
    });

    await prisma.equipmentCharacteristic.deleteMany({
      where: { equipmentId: equipment.id },
    });

    await prisma.equipmentCharacteristic.createMany({
      data: item.characteristics.map((characteristic, index) => ({
        equipmentId: equipment.id,
        title: characteristic.title,
        value: characteristic.value,
        sortOrder: index,
      })),
    });
  }

}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
