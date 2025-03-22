import { Request, Response } from 'express';
import fs from 'fs';

export const getFile = (req: Request, res: Response) => {
    try{
        
        const filename = req.params.filename;
        console.log(`Request - ${filename}`); 
        const filePath = `/root/music/${filename}`;
        if(fs.existsSync(filePath)){
            res.status(200).sendFile(filePath);
        } else {
            res.status(400).json({ message: "file not found!"});
        }           
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
} 