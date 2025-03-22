import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { User } from "../entity/user.entity";
import { myDataSource } from "../DataSource/app-data-source";

interface DecodedToken {
  id: string
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
      const token = req.header('Authorization')?.replace('Bearer ', '')
      if (!token) {
        throw new Error('Authentication failed. Token missing.')
      } else {
        const decoded = verifyToken(token) as DecodedToken
        const user = await myDataSource.getRepository(User).findOneBy({
            id: decoded.id
        })
    
        if (!user) {
          throw new Error('Authentication failed. User not found.')
        } else {
          req.body.user = user
          req.body.token = token
          next();
        }     
      }
  } catch (error) {
    res.status(401).send({ error: 'Authentication failed.' })
  }
}

export const authenticateAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
      const token = req.header('Authorization')?.replace('Bearer ', '')
      if (!token) {
        throw new Error('Authentication failed. Token missing.')
      } else {
        const decoded = verifyToken(token) as DecodedToken
        const user = await myDataSource.getRepository(User).findOneBy({
            id: decoded.id
        })
    
        if (!user) {
          res.status(401).send({ error: 'Authentication failed. User Not Found' })
        } else {
          if(user.role !== "admin"){
            res.status(401).send({ error: 'Authentication failed. User is not admin' })
          }
          else {
            req.body.user = user
            req.body.token = token
            next();
          }          
        }     
      }
  } catch (error) {
    res.status(401).send({ error: 'Authentication failed.' })
  }
}