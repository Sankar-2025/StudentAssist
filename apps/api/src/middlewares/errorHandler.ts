import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Prevent double response
  if (res.headersSent) {
    return next(err);
  }

  // Handle Zod Validation Errors cleanly
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: err.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    });
  }

  // Handle JSON parse error
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      success: false,
      error: 'Malformed JSON payload received',
    });
  }

  // Centralized logging (avoid logging sensitive fields or leaking secrets)
  console.error('[API Error]:', {
    method: req.method,
    path: req.originalUrl,
    message: err.message || 'Internal Server Error',
    code: err.code,
  });

  const statusCode = err.status || err.statusCode || 500;
  const isProduction = process.env.NODE_ENV === 'production';

  return res.status(statusCode).json({
    success: false,
    error: isProduction && statusCode === 500
      ? 'An unexpected internal server error occurred. Please try again later.'
      : err.message || 'Internal Server Error',
    code: err.code || 'INTERNAL_ERROR',
  });
}
