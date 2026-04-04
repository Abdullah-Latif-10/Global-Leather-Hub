const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/User');
const Product = require('../src/models/Product');
const Cart = require('../src/models/Cart');
const BulkOrder = require('../src/models/BulkOrder');
const { generateToken } = require('../src/utils/jwt');

describe('Cart API Tests', () => {
  let user, product, token;

  beforeEach(async () => {
    // Create test user
    user = new User({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    });
    await user.save();

    // Create test product
    product = new Product({
      name: 'Test Leather Jacket',
      description: 'A test product',
      category: 'leather-jackets',
      pricingTiers: [{ minQuantity: 1, maxQuantity: 10, pricePerUnit: 50 }],
      moq: 1,
      status: 'active',
      createdBy: user._id,
    });
    await product.save();

    token = generateToken(user._id);
  });

  afterEach(async () => {
    await BulkOrder.deleteMany({});
    await Cart.deleteMany({});
    await Product.deleteMany({});
    await User.deleteMany({});
  });

  describe('POST /api/cart', () => {
    it('should add item to cart', async () => {
      const response = await request(app)
        .post('/api/cart')
        .set('Authorization', `Bearer ${token}`)
        .send({ productId: product._id, quantity: 2 });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.items).toHaveLength(1);
      expect(response.body.data.items[0].quantity).toBe(2);
    });

    it('should reject quantity below MOQ', async () => {
      const response = await request(app)
        .post('/api/cart')
        .set('Authorization', `Bearer ${token}`)
        .send({ productId: product._id, quantity: 0 });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/cart', () => {
    it('should return user cart', async () => {
      const response = await request(app)
        .get('/api/cart')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.items).toBeDefined();
      expect(response.body.data.totalAmount).toBeDefined();
    });
  });
});

describe('Bulk Order API Tests', () => {
  let user, product, token;

  beforeEach(async () => {
    user = new User({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    });
    await user.save();

    product = new Product({
      name: 'Test Product',
      description: 'A test product',
      category: 'leather-jackets',
      pricingTiers: [{ minQuantity: 1, pricePerUnit: 50 }],
      moq: 1,
      status: 'active',
      createdBy: user._id,
    });
    await product.save();

    token = generateToken(user._id);
  });

  afterEach(async () => {
    await BulkOrder.deleteMany({});
    await Product.deleteMany({});
    await User.deleteMany({});
  });

  describe('POST /api/bulk-orders', () => {
    it('should create bulk order request', async () => {
      const bulkOrderData = {
        products: [{
          productId: product._id,
          name: product.name,
          quantity: 10,
          customizations: 'Custom logo',
          notes: 'Rush order'
        }],
        totalEstimatedValue: 500,
        currency: 'USD'
      };

      const response = await request(app)
        .post('/api/bulk-orders')
        .set('Authorization', `Bearer ${token}`)
        .send(bulkOrderData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.bulkOrder.status).toBe('pending');
    });

    it('should reject empty products array', async () => {
      const response = await request(app)
        .post('/api/bulk-orders')
        .set('Authorization', `Bearer ${token}`)
        .send({ products: [], totalEstimatedValue: 0 });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });
});