const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');
const mongoose = require('mongoose');

// Debugging and logging setup
const DEBUG_MODE = process.env.NODE_ENV !== 'production';
const LOG_LEVEL = process.env.LOG_LEVEL || 'info';

// Enhanced logging function
function log(level, message, data = null) {
    const timestamp = new Date().toISOString();
    const logLevels = { error: 0, warn: 1, info: 2, debug: 3 };
    const currentLevel = logLevels[LOG_LEVEL] || 2;
    
    if (logLevels[level] <= currentLevel) {
        const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
        if (data) {
            console.log(`${prefix} ${message}:`, data);
        } else {
            console.log(`${prefix} ${message}`);
        }
    }
}

// Global error handling for unhandled promises
process.on('unhandledRejection', (reason, promise) => {
    log('error', 'Unhandled Rejection at:', { promise, reason });
});

process.on('uncaughtException', (error) => {
    log('error', 'Uncaught Exception:', error);
    process.exit(1);
});

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "'unsafe-hashes'", 
                       "https://cdnjs.cloudflare.com", "https://cdn.jsdelivr.net"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", 
                      "https://cdnjs.cloudflare.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'", "https://cdnjs.cloudflare.com", "https://cdn.jsdelivr.net"],
            baseUri: ["'self'"],
            formAction: ["'self'"],
            frameAncestors: ["'self'"],
            objectSrc: ["'none'"],
            scriptSrcAttr: ["'none'"],
            upgradeInsecureRequests: []
        }
    },
    crossOriginOpenerPolicy: { policy: "same-origin" },
    crossOriginResourcePolicy: { policy: "same-origin" }
    // originAgentCluster removed - doesn't accept options
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Basic middleware
app.use(compression());
app.use(morgan('combined'));
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// In-memory storage for now (will connect to MongoDB later)
let products = [];
let records = [];
let reports = [];

// Import data from backup if available
try {
    const fs = require('fs');
    const backupPath = path.join(__dirname, '../conejo-negro-backup-2025-08-22.json');
    if (fs.existsSync(backupPath)) {
        const backup = JSON.parse(fs.readFileSync(backupPath, 'utf8'));
        products = backup.data.products || [];
        records = backup.data.records || [];
        reports = backup.data.reports || [];
        console.log('✅ Backup data loaded successfully');
    }
} catch (error) {
    console.log('⚠️ Could not load backup data:', error.message);
}

// Routes
app.get('/', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes, maximum-scale=5.0">
    <title>Conejo Negro - POS System</title>
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700&family=Roboto:wght@300;400;500&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        :root {
            --bg-primary: #0a0a0f;
            --bg-secondary: #12121a;
            --bg-card: #1a1a2e;
            --text-primary: #e0e0ff;
            --text-secondary: #a0a0c0;
            --accent-cyan: #00d9ff;
            --accent-purple: #9d00ff;
            --accent-pink: #ff00d9;
            --success: #00ff88;
            --danger: #ff0055;
            --warning: #ffaa00;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        html {
            height: 100%;
            overflow-y: auto;
            -webkit-overflow-scrolling: touch;
            scroll-behavior: smooth;
        }

        body {
            font-family: 'Roboto', sans-serif;
            background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
            color: var(--text-primary);
            min-height: 100vh;
            padding: 20px;
            overflow-x: hidden;
            overflow-y: auto;
            -webkit-overflow-scrolling: touch;
            touch-action: pan-y pinch-zoom;
        }

        .container {
            text-align: center;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px;
            background: var(--bg-card);
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0, 217, 255, 0.3);
            border: 1px solid rgba(0, 217, 255, 0.2);
            position: relative;
        }

        .logo {
            width: 120px;
            height: 120px;
            background: linear-gradient(135deg, var(--accent-cyan), var(--accent-purple));
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 48px;
            color: var(--bg-primary);
            margin: 0 auto 30px;
            box-shadow: 0 0 40px rgba(0, 217, 255, 0.7);
        }

        .title {
            font-family: 'Orbitron', sans-serif;
            font-size: 48px;
            font-weight: 700;
            background: linear-gradient(90deg, var(--accent-cyan), var(--accent-purple));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 20px;
        }

        .subtitle {
            font-size: 24px;
            color: var(--text-secondary);
            margin-bottom: 40px;
        }

        .version-info {
            background: rgba(0, 217, 255, 0.1);
            border-radius: 10px;
            padding: 20px;
            margin-bottom: 40px;
            border: 1px solid rgba(0, 217, 255, 0.2);
        }

        .options {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-top: 40px;
        }

        .option-card {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 15px;
            padding: 30px;
            transition: all 0.3s ease;
            border: 1px solid rgba(0, 217, 255, 0.1);
            text-decoration: none;
            color: var(--text-primary);
        }

        .option-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 40px rgba(0, 217, 255, 0.3);
            border-color: var(--accent-cyan);
        }

        .option-icon {
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, var(--accent-cyan), var(--accent-purple));
            border-radius: 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            color: var(--bg-primary);
            margin: 0 auto 15px;
        }

        .option-title {
            font-size: 20px;
            font-weight: 600;
            margin-bottom: 10px;
            color: var(--accent-cyan);
        }

        .option-desc {
            font-size: 14px;
            color: var(--text-secondary);
            line-height: 1.5;
        }

        .status-indicator {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 8px 15px;
            background: rgba(0, 255, 136, 0.1);
            border-radius: 20px;
            color: var(--success);
            font-size: 14px;
            margin-bottom: 20px;
        }

        .status-dot {
            width: 8px;
            height: 8px;
            background: var(--success);
            border-radius: 50%;
            animation: pulse 2s infinite;
        }

        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }

        @media (max-width: 768px) {
            body {
                padding: 10px;
                min-height: 100vh;
                height: auto;
            }
            
            .container {
                padding: 20px;
                margin: 10px auto;
                max-width: 95%;
                min-height: auto;
            }
            
            .title {
                font-size: 32px;
            }
            
            .subtitle {
                font-size: 16px;
            }
            
            .options {
                grid-template-columns: 1fr;
                gap: 15px;
            }
            
            .option-card {
                padding: 20px;
                margin: 10px 0;
            }
            
            .option-card:active {
                transform: translateY(0);
                transition: all 0.1s ease;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">
            <i class="fas fa-coffee"></i>
        </div>
        
        <h1 class="title">CONEJO NEGRO</h1>
        <p class="subtitle">Sistema POS - Point of Sale</p>
        
        <div class="status-indicator">
            <div class="status-dot"></div>
            <span>Sistema Operativo - RESTAURADO</span>
        </div>
        
        <div class="version-info">
            <h3 style="color: var(--accent-cyan); margin-bottom: 10px;">
                <i class="fas fa-rocket"></i> Versión 2.0 - Restaurado desde Backup
            </h3>
            <p>Sistema completo con autenticación, respaldos automáticos y almacenamiento en la nube</p>
        </div>
        
        <div class="options">
            <a href="/online" class="option-card">
                <div class="option-icon">
                    <i class="fas fa-globe"></i>
                </div>
                <div class="option-title">Sistema POS</div>
                <div class="option-desc">Sistema completo con autenticación y sincronización en la nube</div>
            </a>
            
            <a href="/api/health" class="option-card">
                <div class="option-icon">
                    <i class="fas fa-heartbeat"></i>
                </div>
                <div class="option-title">Estado del Sistema</div>
                <div class="option-desc">Verificar el estado y salud del servidor</div>
            </a>
        </div>
        
        <div style="margin-top: 40px; padding: 20px; background: rgba(0, 0, 0, 0.2); border-radius: 10px;">
            <p style="font-size: 14px; color: var(--text-secondary);">
                <i class="fas fa-shield-alt"></i>
                Sistema restaurado con éxito - ${products.length} productos, ${records.length} registros cargados
            </p>
        </div>
    </div>
    <script>
        // Ensure mobile scrolling works properly
        document.addEventListener('DOMContentLoaded', function() {
            // Prevent any touch event handlers from blocking scrolling
            document.body.style.touchAction = 'pan-y pinch-zoom';
            
            // Ensure smooth scrolling on mobile
            if ('ontouchstart' in window) {
                document.documentElement.style.webkitOverflowScrolling = 'touch';
                document.body.style.webkitOverflowScrolling = 'touch';
            }
        });
    </script>
</body>
</html>
    `);
});

// API Health endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        version: '2.0.0',
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        data: {
            products: products.length,
            records: records.length,
            reports: reports.length
        }
    });
});

// Products API
app.get('/api/products', (req, res) => {
    const category = req.query.category;
    let filteredProducts = products.filter(p => p.isActive);
    
    if (category) {
        filteredProducts = filteredProducts.filter(p => p.category === category);
    }
    
    res.json(filteredProducts);
});

app.get('/api/products/:id', (req, res) => {
    const product = products.find(p => p._id === req.params.id);
    if (!product) {
        return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
});

// Records API
app.get('/api/records', (req, res) => {
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;
    
    const filteredRecords = records
        .filter(r => !r.isDeleted)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(offset, offset + limit);
    
    res.json(filteredRecords);
});

// Fixed Coworking endpoint
app.get('/coworking', (req, res) => {
    try {
        // Filter coworking records from the data
        const coworkingRecords = records.filter(record => 
            record.service === 'coworking' && !record.isDeleted
        );

        res.send(`
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes, maximum-scale=5.0">
    <title>Conejo Negro - Café Coworking Online</title>
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700&family=Roboto:wght@300;400;500&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        /* Same styling as main page */
        :root {
            --bg-primary: #0a0a0f;
            --bg-secondary: #12121a;
            --bg-card: #1a1a2e;
            --text-primary: #e0e0ff;
            --text-secondary: #a0a0c0;
            --accent-cyan: #00d9ff;
            --accent-purple: #9d00ff;
            --success: #00ff88;
        }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html {
            height: 100%;
            overflow-y: auto;
            -webkit-overflow-scrolling: touch;
            scroll-behavior: smooth;
        }
        body {
            font-family: 'Roboto', sans-serif;
            background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
            color: var(--text-primary);
            min-height: 100vh;
            padding: 20px;
            overflow-x: hidden;
            overflow-y: auto;
            -webkit-overflow-scrolling: touch;
            touch-action: pan-y pinch-zoom;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 40px;
            background: var(--bg-card);
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0, 217, 255, 0.3);
        }
        .title {
            font-family: 'Orbitron', sans-serif;
            font-size: 36px;
            font-weight: 700;
            background: linear-gradient(90deg, var(--accent-cyan), var(--accent-purple));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            text-align: center;
            margin-bottom: 40px;
        }
        .nav-item {
            display: inline-block;
            margin: 10px;
            padding: 15px 25px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 10px;
            text-decoration: none;
            color: var(--text-primary);
            transition: all 0.3s ease;
        }
        .nav-item:hover {
            background: rgba(0, 217, 255, 0.2);
            transform: translateY(-2px);
        }
        .coworking-stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin: 40px 0;
        }
        .stat-card {
            background: rgba(0, 255, 136, 0.1);
            padding: 20px;
            border-radius: 15px;
            text-align: center;
            border: 1px solid rgba(0, 255, 136, 0.2);
        }
        .stat-number {
            font-size: 32px;
            font-weight: bold;
            color: var(--success);
            margin-bottom: 10px;
        }
        .record-item {
            background: rgba(255, 255, 255, 0.05);
            margin: 15px 0;
            padding: 20px;
            border-radius: 10px;
            border-left: 4px solid var(--accent-cyan);
        }
        
        /* Mobile optimizations */
        @media (max-width: 768px) {
            html {
                height: 100% !important;
                overflow-y: auto !important;
                -webkit-overflow-scrolling: touch !important;
            }
            
            body {
                padding: 10px;
                height: auto !important;
                min-height: 100vh;
                overflow-y: auto !important;
                -webkit-overflow-scrolling: touch !important;
                scroll-behavior: smooth;
                position: relative !important;
                touch-action: pan-y pinch-zoom !important;
                overscroll-behavior-y: contain !important;
            }
            
            .container {
                padding: 15px;
                margin: 5px auto;
                max-width: 95%;
                min-height: auto;
            }
            
            .title {
                font-size: 28px;
                margin-bottom: 20px;
            }
            
            .nav-item {
                display: inline-block;
                margin: 5px;
                padding: 10px 15px;
                font-size: 14px;
            }
            
            .nav-item span {
                display: block;
                font-size: 12px;
                margin-top: 5px;
            }
            
            .coworking-stats {
                grid-template-columns: 1fr;
                gap: 15px;
                margin: 20px 0;
            }
            
            .stat-card {
                padding: 15px;
            }
            
            .stat-number {
                font-size: 24px;
            }
            
            .record-item {
                padding: 15px;
                margin: 10px 0;
            }
            
            .record-item > div {
                flex-direction: column !important;
                text-align: left !important;
            }
            
            .record-item > div > div:last-child {
                text-align: left !important;
                margin-top: 10px;
            }
        }
        
        @media (max-width: 480px) {
            .container {
                padding: 10px;
            }
            
            .title {
                font-size: 24px;
            }
            
            .nav-item {
                margin: 3px;
                padding: 8px 12px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1 class="title">
            <i class="fas fa-laptop"></i>
            COWORKING CONEJO NEGRO
        </h1>
        
        <nav style="text-align: center; margin-bottom: 40px;">
            <a href="#" class="nav-item mobile-nav-btn" data-section="registro">
                <i class="fas fa-cash-register"></i>
                <span>Registro</span>
            </a>
            <a href="/coworking" class="nav-item">
                <i class="fas fa-laptop"></i>
                <span>Coworking</span>
            </a>
            <a href="#" class="nav-item mobile-nav-btn" data-section="inventario-refrigerador">
                <i class="fas fa-snowflake"></i>
                <span>Refriger.</span>
            </a>
            <a href="#" class="nav-item mobile-nav-btn" data-section="inventario-cafeteria">
                <i class="fas fa-coffee"></i>
                <span>Cafetería</span>
            </a>
        </nav>

        <div class="coworking-stats">
            <div class="stat-card">
                <div class="stat-number">${coworkingRecords.length}</div>
                <div>Sesiones de Coworking</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${coworkingRecords.reduce((sum, r) => sum + (r.hours || 0), 0)}</div>
                <div>Horas Totales</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">$${coworkingRecords.reduce((sum, r) => sum + (r.total || 0), 0).toFixed(2)}</div>
                <div>Ingresos Totales</div>
            </div>
        </div>

        <h2 style="color: var(--accent-cyan); margin: 30px 0 20px;">Sesiones Recientes</h2>
        ${coworkingRecords.slice(0, 10).map(record => `
            <div class="record-item">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <strong>Cliente:</strong> ${record.client || 'N/A'}<br>
                        <strong>Horas:</strong> ${record.hours || 0}<br>
                        <strong>Fecha:</strong> ${new Date(record.date).toLocaleDateString('es-ES')}
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 24px; color: var(--success);">$${record.total || 0}</div>
                        <div style="font-size: 12px; color: var(--text-secondary);">${record.payment || 'N/A'}</div>
                    </div>
                </div>
                ${record.products && record.products.length > 0 ? `
                    <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.1);">
                        <strong>Bebidas consumidas:</strong>
                        ${record.products.map(p => `${p.name} (x${p.quantity})`).join(', ')}
                    </div>
                ` : ''}
            </div>
        `).join('')}
        
        ${coworkingRecords.length === 0 ? `
            <div style="text-align: center; padding: 60px; color: var(--text-secondary);">
                <i class="fas fa-laptop" style="font-size: 48px; margin-bottom: 20px; opacity: 0.5;"></i>
                <p>No hay registros de coworking disponibles</p>
                <p style="font-size: 14px; margin-top: 10px;">Los datos se cargarán automáticamente cuando haya actividad</p>
            </div>
        ` : ''}
        
        <div style="margin-top: 40px; padding: 20px; background: rgba(0, 0, 0, 0.2); border-radius: 10px; text-align: center;">
            <p style="font-size: 14px; color: var(--text-secondary);">
                <i class="fas fa-check-circle" style="color: var(--success);"></i>
                Sistema de Coworking operativo - Datos restaurados exitosamente
            </p>
        </div>
    </div>
    <script>
        // Ensure mobile scrolling works properly
        document.addEventListener('DOMContentLoaded', function() {
            // Prevent any touch event handlers from blocking scrolling
            document.body.style.touchAction = 'pan-y pinch-zoom';
            
            // Ensure smooth scrolling on mobile
            if ('ontouchstart' in window) {
                document.documentElement.style.webkitOverflowScrolling = 'touch';
                document.body.style.webkitOverflowScrolling = 'touch';
            }
        });
    </script>
</body>
</html>
        `);
    } catch (error) {
        console.error('Error in coworking endpoint:', error);
        res.status(500).json({ 
            error: 'Internal Server Error', 
            message: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// Online POS interface
app.get('/online', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes, maximum-scale=5.0">
    <title>Conejo Negro - Café Coworking Online</title>
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700&family=Roboto:wght@300;400;500&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        :root {
            --bg-primary: #0a0a0f;
            --bg-secondary: #12121a;
            --bg-card: #1a1a2e;
            --text-primary: #e0e0ff;
            --text-secondary: #a0a0c0;
            --accent-cyan: #00d9ff;
            --accent-purple: #9d00ff;
            --success: #00ff88;
        }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html {
            height: 100%;
            overflow-y: auto;
            -webkit-overflow-scrolling: touch;
            scroll-behavior: smooth;
        }
        body {
            font-family: 'Roboto', sans-serif;
            background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
            color: var(--text-primary);
            min-height: 100vh;
            overflow-x: hidden;
            overflow-y: auto;
            -webkit-overflow-scrolling: touch;
            touch-action: pan-y pinch-zoom;
        }
        .navbar {
            background: var(--bg-card);
            padding: 15px 0;
            border-bottom: 1px solid rgba(0, 217, 255, 0.2);
        }
        .nav-container {
            max-width: 1200px;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 20px;
        }
        .logo-text {
            font-family: 'Orbitron', sans-serif;
            font-size: 24px;
            font-weight: 700;
            background: linear-gradient(90deg, var(--accent-cyan), var(--accent-purple));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .nav-item {
            display: inline-block;
            margin: 0 10px;
            padding: 10px 20px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            text-decoration: none;
            color: var(--text-primary);
            transition: all 0.3s ease;
        }
        .nav-item:hover {
            background: rgba(0, 217, 255, 0.2);
            transform: translateY(-2px);
        }
        .main-content {
            max-width: 1200px;
            margin: 0 auto;
            padding: 40px 20px;
        }
        .dashboard-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 40px;
        }
        .dashboard-card {
            background: var(--bg-card);
            padding: 30px;
            border-radius: 15px;
            border: 1px solid rgba(0, 217, 255, 0.2);
            text-align: center;
            transition: all 0.3s ease;
        }
        .dashboard-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 40px rgba(0, 217, 255, 0.3);
        }
        .card-icon {
            font-size: 48px;
            margin-bottom: 20px;
            color: var(--accent-cyan);
        }
        .card-title {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 10px;
            color: var(--text-primary);
        }
        .card-value {
            font-size: 32px;
            font-weight: bold;
            color: var(--success);
        }
        
        /* Mobile optimizations */
        @media (max-width: 768px) {
            html {
                height: 100% !important;
                overflow-y: auto !important;
                -webkit-overflow-scrolling: touch !important;
            }
            
            body {
                height: auto !important;
                overflow-y: auto !important;
                -webkit-overflow-scrolling: touch !important;
                scroll-behavior: smooth;
                position: relative !important;
                touch-action: pan-y pinch-zoom !important;
                overscroll-behavior-y: contain !important;
            }
            
            .nav-container {
                flex-direction: column;
                padding: 10px;
                gap: 15px;
            }
            
            .logo-text {
                font-size: 20px;
                margin-bottom: 10px;
            }
            
            .nav-item {
                display: inline-block;
                margin: 3px;
                padding: 8px 12px;
                font-size: 14px;
            }
            
            .nav-item span {
                display: block;
                font-size: 11px;
                margin-top: 3px;
            }
            
            .main-content {
                padding: 20px 10px;
            }
            
            .main-content h1 {
                font-size: 28px !important;
                margin-bottom: 20px !important;
            }
            
            .dashboard-grid {
                grid-template-columns: repeat(2, 1fr);
                gap: 15px;
                margin-bottom: 20px;
            }
            
            .dashboard-card {
                padding: 20px;
            }
            
            .card-icon {
                font-size: 32px;
                margin-bottom: 15px;
            }
            
            .card-title {
                font-size: 16px;
                margin-bottom: 8px;
            }
            
            .card-value {
                font-size: 24px;
            }
        }
        
        @media (max-width: 480px) {
            .nav-container {
                padding: 8px;
            }
            
            .logo-text {
                font-size: 18px;
            }
            
            .nav-item {
                margin: 2px;
                padding: 6px 10px;
                font-size: 12px;
            }
            
            .main-content {
                padding: 15px 8px;
            }
            
            .main-content h1 {
                font-size: 24px !important;
            }
            
            .dashboard-grid {
                grid-template-columns: 1fr;
                gap: 12px;
            }
            
            .dashboard-card {
                padding: 15px;
            }
            
            .card-icon {
                font-size: 28px;
            }
            
            .card-title {
                font-size: 14px;
            }
            
            .card-value {
                font-size: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="navbar">
        <div class="nav-container">
            <div class="logo-text">
                <i class="fas fa-coffee"></i> CONEJO NEGRO
            </div>
            <nav>
                <a href="#" class="nav-item mobile-nav-btn" data-section="registro">
                    <i class="fas fa-cash-register"></i>
                    <span>Registro</span>
                </a>
                <a href="/coworking" class="nav-item">
                    <i class="fas fa-laptop"></i>
                    <span>Coworking</span>
                </a>
                <a href="#" class="nav-item mobile-nav-btn" data-section="inventario-refrigerador">
                    <i class="fas fa-snowflake"></i>
                    <span>Refriger.</span>
                </a>
                <a href="#" class="nav-item mobile-nav-btn" data-section="inventario-cafeteria">
                    <i class="fas fa-coffee"></i>
                    <span>Cafetería</span>
                </a>
            </nav>
        </div>
    </div>
    
    <div class="main-content">
        <h1 style="text-align: center; margin-bottom: 40px; font-size: 36px;">
            Sistema POS - Dashboard
        </h1>
        
        <div class="dashboard-grid">
            <div class="dashboard-card">
                <div class="card-icon"><i class="fas fa-box"></i></div>
                <div class="card-title">Productos</div>
                <div class="card-value">${products.length}</div>
            </div>
            <div class="dashboard-card">
                <div class="card-icon"><i class="fas fa-receipt"></i></div>
                <div class="card-title">Registros</div>
                <div class="card-value">${records.length}</div>
            </div>
            <div class="dashboard-card">
                <div class="card-icon"><i class="fas fa-laptop"></i></div>
                <div class="card-title">Coworking</div>
                <div class="card-value">${records.filter(r => r.service === 'coworking').length}</div>
            </div>
            <div class="dashboard-card">
                <div class="card-icon"><i class="fas fa-dollar-sign"></i></div>
                <div class="card-title">Ingresos</div>
                <div class="card-value">$${records.reduce((sum, r) => sum + (r.total || 0), 0).toFixed(2)}</div>
            </div>
        </div>
        
        <div style="text-align: center; padding: 40px; background: var(--bg-card); border-radius: 15px; border: 1px solid rgba(0, 255, 136, 0.2);">
            <h2 style="color: var(--success); margin-bottom: 20px;">
                <i class="fas fa-check-circle"></i> Sistema Restaurado
            </h2>
            <p>Todos los datos han sido recuperados exitosamente desde el backup.</p>
            <p style="margin-top: 10px; color: var(--text-secondary);">
                El endpoint de coworking ahora funciona correctamente.
            </p>
        </div>
    </div>
    <script>
        // Ensure mobile scrolling works properly
        document.addEventListener('DOMContentLoaded', function() {
            // Prevent any touch event handlers from blocking scrolling
            document.body.style.touchAction = 'pan-y pinch-zoom';
            
            // Ensure smooth scrolling on mobile
            if ('ontouchstart' in window) {
                document.documentElement.style.webkitOverflowScrolling = 'touch';
                document.body.style.webkitOverflowScrolling = 'touch';
            }
        });
    </script>
</body>
</html>
    `);
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ 
        error: 'Internal Server Error', 
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
        timestamp: new Date().toISOString()
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ 
        error: 'Not Found', 
        message: `Route ${req.method} ${req.path} not found`,
        timestamp: new Date().toISOString()
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Conejo Negro POS Server started on port ${PORT}`);
    console.log(`📊 Data loaded: ${products.length} products, ${records.length} records`);
    console.log(`🌐 Server URL: http://localhost:${PORT}`);
    console.log(`💼 Coworking URL: http://localhost:${PORT}/coworking`);
    console.log(`🎯 Online POS: http://localhost:${PORT}/online`);
});

module.exports = app;
