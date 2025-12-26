const { validationResult } = require('express-validator');

// Factory that returns a middleware to run the given validations and handle errors
function validateRequest(validations) {
  return async (req, res, next) => {
    try {
      if (Array.isArray(validations)) {
        await Promise.all(validations.map((validation) => validation.run(req)));
      } else if (typeof validations === 'function') {
        // Allow passing a single validator function
        await validations.run(req);
      } else if (validations) {
        console.warn('validateRequest expected an array of validators or a validator; received:', typeof validations);
      }

      const errors = validationResult(req);
      if (errors.isEmpty()) return next();

      // Log validation errors for quick diagnosis (redact sensitive fields)
      const { password, ...rest } = req.body || {};
      const redactedBody = { ...rest, password: password ? '***redacted***' : undefined };
      console.warn('[ValidationError]', req.method, req.originalUrl, {
        errors: errors.array(),
        body: redactedBody,
      });

      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    } catch (err) {
      return next(err);
    }
  };
}

// Support both default and named import styles
module.exports = validateRequest;           // default export
module.exports.validateRequest = validateRequest; // named export
