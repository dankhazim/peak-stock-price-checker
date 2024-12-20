import { NextFunction, Request, Response, Router } from "express";
import FinnhubService from "../services/FinnhubService";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Quote:
 *       type: object
 *       properties:
 *         price:
 *           type: number
 *         symbol:
 *           type: string
 *         date:
 *           type: string
 * /stock/status:
 *   get:
 *     summary: Get service status
 *     description: Returns the list of symbols being monitored
 *     responses:
 *       200:
 *         description: Service status
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 * /stock/{symbol}:
 *   get:
 *     summary: Get stock price
 *     description: Returns the stock price for the given symbol and calculates the moving average
 *     parameters:
 *       - in: path
 *         name: symbol
 *         required: true
 *         schema:
 *           type: string
 *         description: The stock symbol
 *     responses:
 *       200:
 *         description: The stock price
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Quote'
 *   put:
 *     summary: Schedule symbol monitoring
 *     description: Schedule monitoring for the given stock symbol
 *     parameters:
 *       - in: path
 *         name: symbol
 *         required: true
 *         schema:
 *           type: string
 *         description: The stock symbol
 *     responses:
 *       204:
 *         description: Symbol monitoring scheduled
 */
router.get("/status", (req: Request, res: Response) => {
  res.send(FinnhubService.getStatus());
});

router.get(
  "/:symbol",
  async (req: Request, res: Response, next: NextFunction) => {
    const { symbol } = req.params;
    try {
      const result = await FinnhubService.getStockPrice(symbol);
      res.send(result);
    } catch (error) {
      next(error);
    }
  }
);

router.put("/:symbol", (req: Request, res: Response, next: NextFunction) => {
  const { symbol } = req.params;
  try {
    FinnhubService.scheduleSymbolMonitoring(symbol);
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});

export default router;
