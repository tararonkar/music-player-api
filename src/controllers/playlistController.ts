import { Request, response, Response } from 'express';
import { Playlist } from '../entity/playlist.entity';
import { Track } from '../entity/track.entity';
import { myDataSource } from '../DataSource/app-data-source';


// Add track to playlist
export const addTrackToPlaylist = async (req: Request, res: Response) => {

    try{
        const { playlistId, trackId } = req.body;

        const playlistRepository = myDataSource.getRepository(Playlist);
        const trackRepository = myDataSource.getRepository(Track);

        const playlist = await playlistRepository.findOne({ where: { id: playlistId }, relations: ["tracks"]});

        const track = await trackRepository.findOne({ where: { id: trackId } });

        if(!track || !playlist){
            res.status(404).json({ message: "PLaylist or Track not found" });
        } else {

            // check if track is already in the playlist
            if(playlist.tracks.some((t) => t.id === track.id)){
                res.status(400).json({ message: "Track is already in playlist" });
            } else {
                playlist.tracks.push(track);
                await playlistRepository.save(playlist);
                res.status(200).json({message: "Track added to playlist"});
            }
        }
    } catch (error: any) {
        res.status(500).json({message: "Failed to add track in playlist"});
    }
}

// Remove track from playlist
export const removeTrackFromPlaylist = async (req: Request, res: Response) => {
    try{
        const { playlistId, trackId } = req.params;

        const playlistRepository = myDataSource.getRepository(Playlist);
        const trackRepository = myDataSource.getRepository(Track);

        const playlist = await playlistRepository.findOne({ where: { id: playlistId }, relations: ["tracks"]});

        const track = await trackRepository.findOne({ where: { id: trackId } });

        if(!track || !playlist){
            res.status(404).json({ message: "PLaylist or Track not found" });
        } else {
            playlist.tracks = playlist.tracks.filter((t) => t.id !== track.id);
            await playlistRepository.save(playlist);

            res.status(200).json({ message: "Track removed from playlist" });
        }
    } catch (error: any) {
        res.status(500).json({ message: "Failes to remove track from playlist" });
    }
}

// Get All Playlist for user
export const getAllPlaylistForUser = async (req:Request, res: Response) => {
    try{
        const { user } = req.body;

        const playlistRepository = myDataSource.getRepository(Playlist);
        console.log("User: ", user);
        const playlists = await playlistRepository.find({where: { user: { id: user.id } }, relations: ["tracks"]});
        console.log("playlists: ", playlists);
        if(!playlists)
        {
            res.status(400).json({ message: "No playlists found!" });
        } else {
            res.status(200).json(playlists);
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message});
    }
}

// create playlist
export const createPlaylist = async (req: Request, res: Response) => {
    try{
        const { name, artwork, user } = req.body

        const playlistRepository = myDataSource.getRepository(Playlist);

        const playlists = await playlistRepository.find({ where: {  user: { id: user.id } , name: name }, relations: ["tracks"]});
        console.log(playlists);
        if(playlists.length > 0){
            res.status(400).json({ message: "playlist already exists" });
        } else {
            const newPlaylist = playlistRepository.create({
                name,
                user,
                artwork
            });

            await playlistRepository.save(newPlaylist);

            res.status(200).json({ message: "Playlist successfully created!" });
        }        
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}


// update playlist
export const updatePlaylist = async (req: Request, res: Response) => {
    try{
        const { id } = req.params;
        const { name, artwork } = req.body

        const playlistRepository = myDataSource.getRepository(Playlist);

        const playlist = await playlistRepository.findOne({ where: {  id: id }, relations: ["tracks"]});

        if(!playlist){
            res.status(400).json({ message: "playlist does not exist" });
        } else {
            await playlistRepository.update({id: id}, {
                name,
                artwork
            });
            res.status(200).json({ message: "Playlist successfully updated!" });
        }        
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

// delete playlist
export const deletePlaylist = async (req:Request, res: Response) => {
    try{
        const { id } = req.params;

        const playlistRepository = myDataSource.getRepository(Playlist);
        
        await playlistRepository.delete({id: id});

        res.status(200).json({ message: "Successfully deleted playlist" });

    } catch (error: any) {
        res.status(500).json({ message: "Failed to delete playlist" });
    }
}