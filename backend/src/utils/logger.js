const winston = require('winston');
const path = require('path');
const fs = require('fs');

// Pastikan direktori logs ada
const logDir = path.join(__dirname, '..', '..', 'logs');
fs.mkdirSync(logDir, { recursive: true });

// Konfigurasi Winston
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.json()
    ),
    defaultMeta: { service: 'sipale-backend' },
    transports: process.env.NODE_ENV === 'production' 
        ? [new winston.transports.Console()]
        : [
            // File untuk error
            new winston.transports.File({
                filename: path.join(logDir, 'error.log'),
                level: 'error',
                maxsize: 5242880, // 5MB
                maxFiles: 5
            }),
            // File untuk kombinasi log
            new winston.transports.File({
                filename: path.join(logDir, 'combined.log'),
                maxsize: 5242880, // 5MB
                maxFiles: 5
            }),
            // Console untuk development
            new winston.transports.Console({
                format: winston.format.combine(
                    winston.format.colorize(),
                    winston.format.simple()
                )
            })
        ],
    exceptionHandlers: [
        new winston.transports.File({ 
            filename: path.join(logDir, 'exceptions.log') 
        })
    ],
    rejectionHandlers: [
        new winston.transports.File({ 
            filename: path.join(logDir, 'rejections.log') 
        })
    ]
});

module.exports = logger;