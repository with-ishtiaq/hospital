const colors = require('colors');
const db = require('../models');

// Ensure model is initialized even if not registered centrally
const ensureModel = () => {
  if (!db.MedicineShop) {
    const factory = require('../models/medicineShop');
    db.MedicineShop = factory(db.sequelize, db.Sequelize);
  }
  return db.MedicineShop;
};

const shops = [
  { name: 'Lazz Pharma', website: 'https://www.lazzpharma.com/' },
  { name: 'Arogga', website: 'https://www.arogga.com/' },
  { name: 'Osudpotro', website: 'https://osudpotro.com/' },
  { name: 'Medeasy', website: 'https://medeasy.health/' },
  { name: 'Medex', website: 'https://medex.com.bd/' },
];

const importData = async () => {
  try {
    const MedicineShop = ensureModel();
    await db.sequelize.authenticate();
    await db.sequelize.sync();

    await MedicineShop.destroy({ where: {}, truncate: true, cascade: true });

    const created = await MedicineShop.bulkCreate(
      shops.map(s => ({ name: s.name, website: s.website, isActive: true })),
      { validate: true }
    );

    console.log('Medicine shops imported successfully!'.green.inverse);
    console.log(`${created.length} shops created.`.cyan);
    process.exit(0);
  } catch (err) {
    console.error(`Error importing medicine shops: ${err.message}`.red.inverse);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    const MedicineShop = ensureModel();
    await db.sequelize.authenticate();
    await db.sequelize.sync();
    await MedicineShop.destroy({ where: {}, truncate: true, cascade: true });
    console.log('Medicine shops destroyed successfully!'.red.inverse);
    process.exit(0);
  } catch (err) {
    console.error(`Error destroying medicine shops: ${err.message}`.red.inverse);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
