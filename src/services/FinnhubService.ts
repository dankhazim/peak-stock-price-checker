import finnhub, { DefaultApi } from "finnhub-ts";
import { Quote } from "../entities";
import IStockService from "./IStockService";
import StockRepository from "../repositories/StockRepository";
import { convertToDTO } from "../converters/QuoteConverter";
import { scheduleJob, scheduledJobs } from "node-schedule";
import QuoteResponse from "../types/QuoteResponse";
import HelperService from "./HelperService";
import { StockNotFoundException } from "../errors/StockNotFoundException";
import { StoreStockException } from "../errors/StoreStockException";

class FinnhubService implements IStockService {
  private readonly client: finnhub.DefaultApi;

  constructor() {
    this.client = new DefaultApi({
      apiKey: process.env.FINNHUB_API_KEY,
      isJsonMime: (input) => {
        try {
          JSON.parse(input);
          return true;
        } catch (error) {}
        return false;
      },
    });

    //@ts-ignore
    this.client.axios.interceptors.response.use(
      (response) => response,
      (error) => {
        switch (error.code) {
          case "ERR_BAD_REQUEST":
            // API limit for example (30 calls/second)
            console.log(error.response.data.error);
            break;

          default:
            console.log("error: ", error);
        }
      }
    );
  }

  async storeStockPrice(symbol: string): Promise<Partial<Quote>> {
    try {
      const data = await this.fetchStockPrice(symbol);
      return await StockRepository.save(convertToDTO(data, symbol));
    } catch (error) {
      if (error instanceof StockNotFoundException) {
        throw error;
      }

      throw new StoreStockException(symbol);
    }
  }

  async getStockPrice(symbol: string): Promise<QuoteResponse> {
    const quote = await StockRepository.findBySymbol(symbol);
    const result: QuoteResponse = { symbol };

    if (!quote) {
      console.log(
        `Stored data not found for symbol: ${symbol}, fetching from API`
      );

      const data = await this.fetchStockPrice(symbol);

      result.price = data.c!; // We can safely use ! here because we checked it before
      result.lastUpdatedTime = new Date().toISOString();
      result.movingAverage = HelperService.calculateMovingAverage([
        result.price,
      ]);
    } else {
      console.log(`Stored data found for symbol: ${symbol}`);
      result.price = quote.price;
      result.lastUpdatedTime = quote.date.toISOString();

      const quotes = await StockRepository.findLastXBySymbol(symbol, 10);

      result.movingAverage = HelperService.calculateMovingAverage(
        quotes.map((q) => q.price)
      );
    }

    return result;
  }

  scheduleSymbolMonitoring(symbol: string): void {
    if (scheduledJobs[symbol]) {
      console.log(`Job already scheduled for symbol: ${symbol}`);
      return;
    }

    console.log(`Schedule monitoring for symbol: ${symbol}`);
    scheduleJob(symbol, "* * * * *", async () => {
      try {
        const quote = await this.storeStockPrice(symbol);
        console.log(
          `${new Date().toISOString()} - Symbol: ${symbol} - Price: ${
            quote.price
          }`
        );
      } catch (error) {
        if (error instanceof StockNotFoundException) {
          console.error(`Stock not found: ${symbol} - Remove from monitoring`);
          scheduledJobs[symbol].cancel();
          return;
        }

        console.error(error);
      }
    });
  }

  getStatus() {
    const result: string[] = [];

    for (const job in scheduledJobs) {
      result.push(job);
    }

    return result;
  }

  private async fetchStockPrice(symbol: string): Promise<finnhub.Quote> {
    const response = await this.client.quote(symbol);

    if (response.status !== 200) {
      throw new StockNotFoundException(symbol);
    }

    if (!response.data) {
      throw new StockNotFoundException(symbol);
    }

    const data = response.data as finnhub.Quote;

    if (!data.c) {
      throw new StockNotFoundException(symbol);
    }

    return data;
  }
}

export default new FinnhubService();
