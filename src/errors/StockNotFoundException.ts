import { StatusCodes } from "http-status-codes";
import { BaseError } from "./BaseError";

export class StockNotFoundException extends BaseError {
  constructor(symbol: string) {
    super(`Stock with symbol ${symbol} not found`, StatusCodes.NOT_FOUND);
  }
}
