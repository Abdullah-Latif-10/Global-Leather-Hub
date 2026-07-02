const Product = require('../models/Product');
const currencyService = require('../services/CurrencyService');

const formatProductCurrency = (product, currency) => {
  if (!product) return product;
  const p = product.toObject ? product.toObject() : { ...product };
  if (p.pricingTiers && Array.isArray(p.pricingTiers)) {
    p.pricingTiers = p.pricingTiers.map(tier => ({
      ...tier,
      price: currencyService.convert(tier.price_usd, currency)
    }));
  }
  p.currency = currency;
  return p;
};

// GET /api/products public listing of active products
const getProducts = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 12));
    const skip = (page - 1) * limit;

    const filter = { status: 'active' };

    if (req.query.category) filter.category = req.query.category;
    console.log(req.query)
    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
        // { moq: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    if (req.query.minPrice || req.query.maxPrice) {
      filter['pricingTiers.price_usd'] = {};
      const currency = req.user?.preferredCurrency || 'USD';
      if (req.query.minPrice) {
        // Convert local currency back to USD for filtering
        filter['pricingTiers.price_usd'].$gte = parseFloat(req.query.minPrice) / (currencyService.rates[currency] || 1);
      }
      if (req.query.maxPrice) {
        filter['pricingTiers.price_usd'].$lte = parseFloat(req.query.maxPrice) / (currencyService.rates[currency] || 1);
      }
    }

    const sortOptions = {};
    switch (req.query.sort) {
      case 'price-asc':
        sortOptions['pricingTiers.0.price_usd'] = 1;
        break;
      case 'price-desc':
        sortOptions['pricingTiers.0.price_usd'] = -1;
        break;
      case 'name-asc':
        sortOptions.name = 1;
        break;
      case 'name-desc':
        sortOptions.name = -1;
        break;
      default:
        sortOptions.createdAt = -1;
    }

    const [productsRaw, total] = await Promise.all([
      Product.find(filter).sort(sortOptions).skip(skip).limit(limit).lean(),
      Product.countDocuments(filter),
    ]);

    const currency = req.user?.preferredCurrency || 'USD';
    const products = productsRaw.map(p => formatProductCurrency(p, currency));

    res.status(200).json({
      success: true,
      data: {
        products,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/products/:id — single active product
const getProductById = async (req, res, next) => {
  try {
    const productRaw = await Product.findOne({
      _id: req.params.id,
      status: 'active',
    }).lean();

    if (!productRaw) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }

    const currency = req.user?.preferredCurrency || 'USD';
    const product = formatProductCurrency(productRaw, currency);

    res.status(200).json({
      success: true,
      data: { product },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProducts, getProductById };
