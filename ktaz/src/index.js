const express = require('express');
const path = require('path');
const config = require('./config');
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const productRoutes = require('./routes/products');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

// Статика для доступа к загруженным изображениям
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Маршруты
app.use('/api/products', productRoutes);

// Обработка 404 (не найдено)
app.use((req, res, next) => {
    res.status(404).json({ error: 'Not Found' });
});

// Глобальный обработчик ошибок
app.use(errorHandler);

app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
});