import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "quotes" })
export class Quote {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  symbol: string;

  @Column("float")
  price: number;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  date: Date;
}
