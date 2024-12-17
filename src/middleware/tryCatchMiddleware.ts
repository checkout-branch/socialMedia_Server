import { Request, Response, NextFunction } from 'express';

const tryCatchMiddleware = (handler: (req: Request, res: Response, next: NextFunction) => Promise<void> | void) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handler(req, res, next); // Ensure the handler is awaited if it returns a promise
    } catch (error: any) {
      console.error(error);
      res.status(500).json({
        status: "failure",
        message: "error",
        err_message: error.message,
      });
    }
  };
};

export default tryCatchMiddleware;
