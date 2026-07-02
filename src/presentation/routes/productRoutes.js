import { Router } from "express";

export function createProductRouter(productService) {
  const router = Router();

  router.get("/", async (req, res, next) => {
    try {
      const products = await productService.list(req.query.search || "");
      res.json({ products });
    } catch (error) {
      next(error);
    }
  });

  router.post("/", async (req, res, next) => {
    try {
      const product = await productService.create(req.body);
      res.status(201).json({ product });
    } catch (error) {
      next(error);
    }
  });

  router.put("/:id", async (req, res, next) => {
    try {
      const product = await productService.update(req.params.id, req.body);
      res.json({ product });
    } catch (error) {
      next(error);
    }
  });

  router.delete("/:id", async (req, res, next) => {
    try {
      await productService.delete(req.params.id);
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  });

  return router;
}
