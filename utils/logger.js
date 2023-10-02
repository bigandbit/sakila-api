import winston from "winston";
import mysql from 'mysql2';
import DailyRotateFile  from 'winston-daily-rotate-file';

//Rotation
const dailyRotateFile = new DailyRotateFile({
    filename: 'logs/application-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
  });

// MySQL database connection configuration
const dbConnection = mysql.createConnection({
    host : '127.0.0.1',
    user : 'root',
    password : 'admin123',
    database : 'sakila'
});

// Create a custom Winston transport for MySQL
class MySQLTransport extends winston.Transport {
    constructor(options) {
        super(options);
        this.connection = dbConnection;
    }

    log(info, callback) {
        const { level, message, timestamp } = info;
        const logEntry = {
            level,
            message,
            timestamp,
        };

        // Thêm log vào MySQL
        this.connection.query('INSERT INTO logs SET ?', logEntry, (err) => {
            if (err) {
                console.error('Error writing log to MySQL:', err);
            }
            callback(null, true);
        });
    }
}
  
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        dailyRotateFile,
        new MySQLTransport(),
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' })
    ],
});

export default logger;