import { Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { User } from "./user.entity";
import { Track } from "./track.entity";

@Entity({name: 'favorites'})
export class Favorite {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => User, (user) => user.favorites)
  user!: User;

  @ManyToOne(() => Track)
  track!: Track;

}