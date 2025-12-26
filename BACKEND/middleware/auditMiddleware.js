const { logAction } = require('../utils/auditLogger');

const auditRequest = (req, res, next) => {
  const start = Date.now();
  const originalSend = res.send;
  
  // Log the request
  const ip = req.ip || req.connection.remoteAddress;
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} from ${ip}`);
  
  // Override res.send to log the response
  res.send = function (body) {
    const responseTime = Date.now() - start;
    const statusCode = res.statusCode;
    
    // Log the response
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} ${statusCode} (${responseTime}ms)`);
    
    // Log failed login attempts
    if (req.path.includes('/auth/login') && statusCode !== 200) {
      logAction(
        req.body?.email || 'unknown',
        'login_attempt',
        'failed',
        ip,
        { path: req.path, statusCode, error: body }
      );
    }
    
    // Call the original send
    return originalSend.call(this, body);
  };
  
  next();
};

module.exports = auditRequest;
