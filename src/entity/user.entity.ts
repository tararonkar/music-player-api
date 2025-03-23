import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Playlist } from "./playlist.entity";
import { Favorite } from "./favorite.entity";
import { SongHistory } from "./songHistory.entity";

@Entity({ name: 'users'})
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true })
  username!: string;

  @Column()
  password!: string;

  @Column({ default: 'user' })
  role!: string; // 'user' or 'admin'

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;

  @OneToMany(() => Playlist, (playlist) => playlist.user)
  playlists!: Playlist[];

  @OneToMany(() => Favorite, (favorite) => favorite.user)
  favorites!: Favorite[];

  @OneToMany(() => SongHistory, (history) => history.user)
  songHistory!: SongHistory[];

  @Column({ nullable: true, default: null })
  refreshToken!: string;


}