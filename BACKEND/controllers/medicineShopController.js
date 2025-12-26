const db = require('../models');

// Ensure model is initialized even if not registered in models/index
const initMedicineShop = () => {
  if (!db.MedicineShop) {
    // lazily require factory and init
    const factory = require('../models/medicineShop');
    db.MedicineShop = factory(db.sequelize, db.Sequelize);
  }
  return db.MedicineShop;
};

exports.getShops = async (req, res) => {
  try {
    const MedicineShop = initMedicineShop();
    const shops = await MedicineShop.findAll({ where: { isActive: true }, order: [['name', 'ASC']] });
    res.json({ success: true, count: shops.length, data: shops });
  } catch (err) {
    console.error('Error fetching medicine shops:', err);
    res.status(500).json({ success: false, error: 'Failed to load medicine shops' });
  }
};

// Generate a best-effort search URL for a given website and query
const buildSearchUrl = (website, q) => {
  try {
    if (!website) return null;
    const url = new URL(website.startsWith('http') ? website : `https://${website}`);
    // Common patterns used by many e-commerce sites
    const candidates = [
      `${url.origin}/search?q=${encodeURIComponent(q)}`,
      `${url.origin}/?s=${encodeURIComponent(q)}`,
      `${url.origin}/products/search?q=${encodeURIComponent(q)}`,
    ];
    return candidates[0];
  } catch {
    return null;
  }
};

exports.searchAcrossShops = async (req, res) => {
  try {
    const q = (req.query.q || '').trim();
    if (!q) {
      return res.status(400).json({ success: false, error: 'Missing required query parameter: q' });
    }
    const MedicineShop = initMedicineShop();
    const shops = await MedicineShop.findAll({ where: { isActive: true }, order: [['name', 'ASC']] });
    const results = shops.map((s) => ({
      id: s.id,
      name: s.name,
      website: s.website,
      searchUrl: buildSearchUrl(s.website, q),
      logoUrl: s.logoUrl || null,
    }));
    return res.json({ success: true, count: results.length, data: results, query: q });
  } catch (err) {
    console.error('Error searching across medicine shops:', err);
    return res.status(500).json({ success: false, error: 'Failed to build search results' });
  }
};
