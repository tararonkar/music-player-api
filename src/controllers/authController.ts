import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import { myDataSource } from '../DataSource/app-data-source'
import { User } from '../entity/user.entity'
import { generateRefreshToken, generateToken, verifyToken } from '../utils/jwt'

interface DecodedToken {
    id: string
  }

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
        const refreshToken = generateRefreshToken(newUser.id, newUser.role);

        newUser.refreshToken = refreshToken;
        await userRepository.save(newUser);

        res.json({ accessToken: token, refreshToken });
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
            const refreshToken = generateRefreshToken(user.id, user.role);
            user.refreshToken = refreshToken;
            await userRepository.save(user);

            res.json({accessToken: token, refreshToken});
        }
    }
}

export const refresh = async(req: Request, res: Response) => {
    try{
        const { user, refreshToken } = req.body;

        if(!refreshToken){
            res.status(401).json({message: "Refresh token required!"});
        } else {
            const decoded = verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET );
            const userId = (decoded as DecodedToken).id;

            const userRepository = myDataSource.getRepository(User);
            const existingUser = await userRepository.findOne({where: {id: userId}});
            const userRefreshToken = existingUser?.refreshToken ?? null;
            if( !existingUser || !userRefreshToken){
                res.status(401).json({ message: "Invalid refresh token" });
            } else {
                const accessToken = generateToken(userId, user.role);
                const newRefreshToken = generateRefreshToken(userId, user.role);
                existingUser.refreshToken = newRefreshToken;
                await userRepository.save(existingUser);

                res.status(200).json({ accessToken, refreshToken: newRefreshToken});
            }
        }                
    } catch (error: any) {
        res.status(401).json({ message: "Invalid refresh token error" });
    }
}