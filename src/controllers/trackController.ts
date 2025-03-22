import { Request, Response } from "express";
import { Track } from "../entity/track.entity";
import { myDataSource } from "../DataSource/app-data-source";


export const getAllTracks = async (req: Request, res: Response) => {
    try {
        const trackRepository = myDataSource.getRepository(Track);

        const tracks = await trackRepository.query("SELECT * FROM tracks;");

        if(!tracks){
            res.status(500).json({message: "No tracks found!"});
        } else {
            res.json(tracks);
        }

    } catch (error: any) {
        res.status(500).json({message: error.message});
    }
}

export const getTrack = async (req: Request, res: Response) => {
    try {

        const { id } = req.params; 
        const trackRepository = myDataSource.getRepository(Track);

        const track = await trackRepository.findOneBy({id:id});

        if(!track){
            res.status(500).json({message: "No track found!"});
        } else {
            res.json(track);
        }

    } catch (error: any) {
        res.status(500).json({message: error.message});
    }
}


export const createTrack = async (req: Request, res: Response) => {
    try{
        const { title, artist, album, genre, url, artwork } = req.body;

        const trackRepository = myDataSource.getRepository(Track);
        const newTrack = await trackRepository.create({
            title, 
            artist, 
            album, 
            genre, 
            url, 
            artwork
        });
        const savedTrack = await trackRepository.save(newTrack);
        if(!savedTrack){
            res.status(400).json({message: "Track not created!"})
        } else {
            res.status(201).json({ message: "track created successfully", track: savedTrack });
        }
    } catch (error: any) {
        res.status(500).json({message: error.message})
    }
}

export const updateTrack = async (req: Request, res: Response) => {
    try{
        const { id, title, artist, album, genre, url, artwork } = req.body;

        const trackRepository = myDataSource.getRepository(Track);
        const updatedTrack = await trackRepository.update({id: id},{
            title, 
            artist, 
            album, 
            genre, 
            url, 
            artwork
        });
        if(!updatedTrack){
            res.status(400).json({message: "Track not updated!"})
        } else {
            res.status(200).json({ message: "track updated successfully"});
        }
    } catch (error: any) {
        res.status(500).json({message: error.message})
    }
}

export const deleteTrack = async (req: Request, res: Response) => {
    try{
        const { id } = req.body;

        const trackRepository = myDataSource.getRepository(Track);
        const existingTrack = await trackRepository.findOneBy({ id: id});
        if(!existingTrack){
            res.status(400).json({message: "Track not deleted!"})
        } else {
            await trackRepository.delete({id: id});
            res.status(200).json({ message: "track deleted successfully"});
        }
    } catch (error: any) {
        res.status(500).json({message: error.message})
    }
}

