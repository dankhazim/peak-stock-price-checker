import { StatusCodes } from "http-status-codes";
import { BaseError } from "./BaseError";

export class StoreStockException extends BaseError {
  constructor(symbol: string) {
    super(
      "Failed to store stock with symbol: " + symbol,
      StatusCodes.BAD_REQUEST
    );
  }
}
