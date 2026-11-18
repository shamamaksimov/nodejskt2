const express = require('express');
const router = express.Router();
const { validateProduct } = require('../middleware/validate');
const upload = require('../middleware/upload');

// Временное хранилище (in-memory) для демонстрации
let products = [];

// GET /api/products - Список товаров с фильтрацией и пагинацией
router.get('/', (req, res) => {
    let result = [...products];
    const { category, minPrice, maxPrice, page = 1, limit = 10 } = req.query;

    // Фильтрация
    if (category) {
        result = result.filter(p => p.category === category);
    }
    if (minPrice) {
        result = result.filter(p => p.price >= Number(minPrice));
    }
    if (maxPrice) {
        result = result.filter(p => p.price <= Number(maxPrice));
    }

    // Пагинация
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = pageNum * limitNum;
    
    const paginatedResult = result.slice(startIndex, endIndex);

    res.json({
        total: result.length,
        page: pageNum,
        limit: limitNum,
        data: paginatedResult
    });
});

// GET /api/products/:id - Получить товар по ID
router.get('/:id', (req, res) => {
    const product = products.find(p => p.id === req.params.id);
    if (!product) {
        return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
});

// POST /api/products - Создать товар (с загрузкой изображения)
router.post('/', upload.single('image'), validateProduct, (req, res) => {
    const { name, description, category, price, stock } = req.body;
    
    const newProduct = {
        id: Date.now().toString(),
        name,
        description,
        category,
        price: Number(price),
        stock: Number(stock) || 0,
        imageUrl: req.file ? `/uploads/${req.file.filename}` : req.body.imageUrl || null
    };

    products.push(newProduct);
    res.status(201).json(newProduct);
});

// PUT /api/products/:id - Обновить товар
router.put('/:id', upload.single('image'), validateProduct, (req, res) => {
    const index = products.findIndex(p => p.id === req.params.id);
    if (index === -1) {
        return res.status(404).json({ error: 'Product not found' });
    }

    const { name, description, category, price, stock } = req.body;
    
    // Обновляем поля
    products[index] = {
        ...products[index],
        name: name || products[index].name,
        description: description !== undefined ? description : products[index].description,
        category: category || products[index].category,
        price: price ? Number(price) : products[index].price,
        stock: stock !== undefined ? Number(stock) : products[index].stock,
        imageUrl: req.file ? `/uploads/${req.file.filename}` : products[index].imageUrl
    };

    res.json(products[index]);
});

// DELETE /api/products/:id - Удалить товар
router.delete('/:id', (req, res) => {
    const index = products.findIndex(p => p.id === req.params.id);
    if (index === -1) {
        return res.status(404).json({ error: 'Product not found' });
    }

    products.splice(index, 1);
    res.status(204).send();
});

module.exports = router;