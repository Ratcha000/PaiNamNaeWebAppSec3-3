const promClient = require('prom-client');

const httpRequestDuration = new promClient.Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route', 'status_code'],
    buckets: [0.1, 0.5, 1, 2, 5]
});

const httpRequestCount = new promClient.Counter({
    name: 'http_request_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route', 'status_code']
});

const metricsMiddleware = (req, res, next) => {
    const startTime = process.hrtime();

    res.on('finish', () => {
        const diff = process.hrtime(startTime);
        const duration = diff[0] + diff[1] / 1e9;

        const route = req.route ? req.route.path : req.path;
        const method = req.method;
        const statusCode = res.statusCode;

        httpRequestDuration.labels(method, route, statusCode).observe(duration);
        httpRequestCount.labels(method, route, statusCode).inc();
    });

    next();
};

module.exports = { metricsMiddleware };