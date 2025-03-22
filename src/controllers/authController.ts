import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import { myDataSource } from '../DataSource/app-data-source'
import { User } from '../entity/user.entity'
import { generateToken } from '../utils/jwt'


export const signup = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    const userRepository = myDataSource.getRepository(User);

    const existingUser = await userRepository.findOne({where: {username}});
    if(existingUser){
        res.status(400).json({message: "User already exists!"})
    } else{  
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newUser = userRepository.create({
            username: username,
            password: hashedPassword,
            role: 'user'
        });
        
        await userRepository.save(newUser);

        const token = generateToken(newUser.id, newUser.role);

        res.json({ token });
    }

}

export const signin = async (req:Request, res: Response) => {
    const { username, password } = req.body;

    const userRepository = myDataSource.getRepository(User);
    const user = await userRepository.findOne({where: {username}});
    if(!user){
        res.status(400).json({message: "User not found!"});
    }
    else{

        const isValidPassword = await bcrypt.compare(password, user!.password);
        if(!isValidPassword){
            res.status(400).json({message: "Invalid credentials!"});
        }
        else{
            const token = generateToken(user!.id, user!.role);

            res.json({token});
        }
    }
}

export const refresh = async(req: Request, res: Response) => {
    try{
        const { user } = req.body;

        const refreshedToken = generateToken(user.id, user.role);
        res.status(200).json({ token: refreshedToken });        
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}