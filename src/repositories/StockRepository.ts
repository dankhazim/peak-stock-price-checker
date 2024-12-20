import { Repository } from "typeorm";
import { AppDataSource } from "../dataSource";
import { Quote } from "../entities";
import { IStockRepository } from "./IStockRepository";

class StockRepository implements IStockRepository {
  private readonly repository: Repository<Quote>;

  constructor() {
    this.repository = AppDataSource.getRepository(Quote);
  }

  async save(quote: Partial<Quote>): Promise<Partial<Quote>> {
    return await this.repository.save(quote);
  }

  async findBySymbol(symbol: string): Promise<Quote | null> {
    return await this.repository.findOne({
      where: { symbol },
      order: { date: "DESC" },
    });
  }

  async findLastXBySymbol(symbol: string, x: number): Promise<Quote[]> {
    return await this.repository.find({
      where: { symbol },
      order: { date: "DESC" },
      take: x,
    });
  }
}

export default new StockRepository();
