import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from "typeorm";
import { User } from "./user.entity";
import { Track } from "./track.entity";

@Entity()
export class SongHistory {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => User, (user) => user.songHistory)
  user!: User;

  @ManyToOne(() => Track)
  track!: Track;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  playedAt!: Date;

}