const client = require('prom-client');

// Buat register default
const register = new client.Registry();

// Konfigurasi default metrics
client.collectDefaultMetrics({ register });

// Metric kustom
const httpRequestDurationMicroseconds = new client.Histogram({
    name: 'http_request_duration_ms',
    help: 'Durasi request HTTP dalam mikrodetik',
    labelNames: ['method', 'route', 'code'],
    buckets: [0.1, 5, 15, 50, 100, 200, 300, 400, 500]
});

register.registerMetric(httpRequestDurationMicroseconds);

const activeRequests = new client.Gauge({
    name: 'active_requests',
    help: 'Jumlah request yang sedang diproses'
});

register.registerMetric(activeRequests);

function monitoringMiddleware(app) {
    // Middleware untuk melacak durasi request
    app.use((req, res, next) => {
        activeRequests.inc();
        const start = Date.now();

        res.on('finish', () => {
            activeRequests.dec();
            const duration = Date.now() - start;
            
            httpRequestDurationMicroseconds
                .labels(req.method, req.route?.path || req.path, res.statusCode)
                .observe(duration);
        });

        next();
    });

    // Endpoint metrics Prometheus
    app.get('/metrics', async (req, res) => {
        res.set('Content-Type', register.contentType);
        res.end(await register.metrics());
    });
}

module.exports = monitoringMiddleware;