import { Router } from "express";

export function createAuthRouter(authService) {
  const router = Router();

  router.post("/login", async (req, res, next) => {
    try {
      const user = await authService.login(req.body.username, req.body.password);
      res.json({ user });
    } catch (error) {
      next(error);
    }
  });

  return router;
}
