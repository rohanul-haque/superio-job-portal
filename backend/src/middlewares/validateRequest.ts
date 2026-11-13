import type { NextFunction, Request, Response } from "express";
import type { AnyZodObject, ZodEffects } from "zod";

const validateRequest = (schema: AnyZodObject | ZodEffects<AnyZodObject>) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const parsed = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
        cookies: req.cookies,
      });

      if (parsed.body) {
        req.body = parsed.body;
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default validateRequest;
