const AuditLog = require('../models/AuditLog');

// Model untuk Audit Log
const createAuditLogModel = () => {
    const AuditLogSchema = new mongoose.Schema({
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        action: {
            type: String,
            required: true
        },
        details: {
            type: mongoose.Schema.Types.Mixed
        },
        ipAddress: {
            type: String,
            required: true
        },
        timestamp: {
            type: Date,
            default: Date.now
        }
    }, { timestamps: true });

    return mongoose.model('AuditLog', AuditLogSchema);
};

// Middleware untuk logging audit
const auditLogMiddleware = (sensitiveActions = []) => {
    return async (req, res, next) => {
        const originalJson = res.json;
        
        res.json = function(body) {
            // Deteksi aksi sensitif
            const routePath = req.route?.path || req.path;
            const method = req.method;
            const actionKey = `${method}_${routePath}`;

            if (sensitiveActions.includes(actionKey)) {
                try {
                    const AuditLog = createAuditLogModel();
                    
                    await AuditLog.create({
                        user: req.user ? req.user._id : null,
                        action: actionKey,
                        details: {
                            method,
                            path: routePath,
                            body: req.body
                        },
                        ipAddress: req.ip
                    });
                } catch (auditError) {
                    console.error('Audit log error:', auditError);
                }
            }

            // Kembalikan metode json asli
            originalJson.call(this, body);
        };

        next();
    };
};

module.exports = auditLogMiddleware;