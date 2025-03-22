import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable } from "typeorm";
import { User } from "./user.entity";
import { Track } from "./track.entity";

@Entity({name: 'playlists'})
export class Playlist {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @Column("varchar", { length: 500 })
  artwork!: string

  @ManyToOne(() => User, (user) => user.playlists)
  user!: User;

  @ManyToMany(() => Track)
  @JoinTable()
  tracks!: Track[];

}