import { Request, Response } from 'express';
import { Track } from '../entity/track.entity';
import { User } from '../entity/user.entity';
import { myDataSource } from '../DataSource/app-data-source';
import { Favorite } from '../entity/favorite.entity';


// Add to favorite 
export const addToFavorite = async (req: Request, res: Response) => {
    try{
        const { user, trackId  } = req.body;

        const trackRepository = myDataSource.getRepository(Track);
        const favoriteRepository = myDataSource.getRepository(Favorite);
        const track = await trackRepository.findOne({ where: { id: trackId}});

        if (!user || !track) {
            res.status(404).json({ message: "User or track not found" });
        } else {
            const existingFavorite = await favoriteRepository.findOne({
                where: { user: user, track: track }
            });

            if(existingFavorite){
                res.status(400).json({ message: "Track is already in your favorites" });
            } else {
                const favorite = new Favorite();
                favorite.user = user;
                favorite.track = track;
                await favoriteRepository.save(favorite);
                res.status(201).json({ message: "track added to favorites" });
            }
        }        
    } catch (error: any) {
        res.status(500).json({ message:error.message });
    }
}

// Remove favorite 
export const removeFavorite = async (req: Request, res: Response) => {
    try{
        const { trackId } = req.params;
        const { user } = req.body;

        const trackRepository = myDataSource.getRepository(Track);
        const favoriteRepository = myDataSource.getRepository(Favorite);
        const track = await trackRepository.findOne({ where: { id: trackId}});

        if (!user || !track) {
            res.status(404).json({ message: "User or track not found" });
        } else {
            const existingFavorite = await favoriteRepository.findOne({
                where: { user: user, track: track }
            });

            if(!existingFavorite){
                res.status(400).json({ message: "Track is not in your favorites" });
            } else {
                
                await favoriteRepository.remove(existingFavorite);
                res.status(201).json({ message: "track removed from favorites" });
            }
        }        
    } catch (error: any) {
        res.status(500).json({ message:error.message });
    }
}

// get favorites
export const getFavorites = async (req: Request, res: Response) => {
    try{
        const { user } = req.body;
        const userRepository = myDataSource.getRepository(User);
        const existingUser = await userRepository.findOne({where: {id: user.id}, relations: ["favorites", "favorites.track"]});
        if (!existingUser) {
            res.status(404).json({ message: "User not found" });
        } else {
            res.json(user.favorites.map((favorite: Favorite) => favorite.track));
        }
    } catch (error: any) {
        res.status(500).json({message: error.message});
    }    
};