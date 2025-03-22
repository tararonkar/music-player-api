import { Request, Response } from 'express'
import { User } from '../entity/user.entity'
import { myDataSource } from '../DataSource/app-data-source'
import bcrypt from 'bcryptjs'

// Get user details
export const getUserDetails = async (req: Request, res: Response) => {

    try{
        const { id } = req.body.user;
        if(!id){
            res.status(400).json({message: "User not found in request!"});
        } else {
            const userRepository = myDataSource.getRepository(User);
            const existingUser = await userRepository.findOneBy({id: id});
            
            if(!existingUser) {
                res.status(400).json({message: "User not found in database!"});
            } else {
                res.json(existingUser);
            }
        }   

    } catch(error: any){
        res.status(500).json({ message: error.message });
    }   
}


export const updateUserPassword = async (req: Request, res:Response) => {
    try{
        const { user, newPassword } = req.body;
        if(!user.id){
            res.status(400).json({message: "User not found in request!"});
        } else {
            const userRepository = myDataSource.getRepository(User);
            const existingUser = await userRepository.findOneBy({id: user.id});
            
            if(!existingUser) {
                res.status(400).json({message: "User not found in database!"});
            } else {
                const newHashedPassword = await bcrypt.hash(newPassword, 10)

                await userRepository.update({ id: user.id }, { password: newHashedPassword });

                res.status(200).json({message: "Password updated successfully!"});
            }            
        }   
    } catch(error: any){
        res.status(500).json({ message: error.message });
    }   
}