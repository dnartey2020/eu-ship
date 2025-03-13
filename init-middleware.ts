// lib/init-middleware.ts
import type { NextApiRequest, NextApiResponse } from "next";

export function initMiddleware(middleware: any) {
  return (req: NextApiRequest, res: NextApiResponse) =>
    new Promise<void>((resolve, reject) => {
      middleware(req, res, (result: any) => {
        if (result instanceof Error) {
          return reject(result);
        }
        return resolve();
      });
    });
}
