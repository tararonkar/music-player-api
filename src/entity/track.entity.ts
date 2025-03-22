import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: 'tracks'})
export class Track {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  title!: string;

  @Column()
  artist!: string;

  @Column({ nullable: true })
  album!: string;

  @Column({ nullable: true })
  genre!: string;

  @Column("varchar", { length: 500 })
  url!: string; // Path or URL to the track file

  @Column("varchar", {length: 500})
  artwork!: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  uploadedAt!: Date;


}