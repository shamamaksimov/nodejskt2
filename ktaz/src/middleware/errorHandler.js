const errorHandler = (err, req, res, next) => {
    console.error(err.stack || err);

    // Обработка ошибок Multer (например, превышение размера)
    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File too large. Maximum size is 2MB.' });
    }
    
    // Обработка ошибок валидации файла
    if (err.message && err.message.includes('Invalid file type')) {
        return res.status(400).json({ error: err.message });
    }

    // Обработка ошибок Joi (если они не были перехвачены в validate)
    if (err.isJoi) {
        return res.status(400).json({ error: 'Validation Error', details: err.details });
    }

    // Общая ошибка сервера
    res.status(500).json({ 
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
};

module.exports = errorHandler;