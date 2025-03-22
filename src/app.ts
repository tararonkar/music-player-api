import express from "express"
import cors from 'cors'
import { myDataSource } from "./DataSource/app-data-source"
import dotenv from 'dotenv'
import authRoutes from './routes/authRoutes'
import userRoutes from './routes/userRoutes'
import trackRoutes from './routes/trackRoutes';
import playlistRoutes from './routes/playlistRoutes';
import favoriteRoutes from './routes/favoriteRoutes';
import musicRoutes from './routes/musicRoutes';


const config = dotenv.config()
if(config.parsed){
    // establish database connection
    myDataSource
    .initialize()
    .then(() => {
        console.log("Data Source has been initialized!")
        app.listen(process.env.APP_PORT, () => {
            console.log(`App listening to port: ${process.env.APP_PORT}`)
        })
    })
    .catch((err) => {
        console.error("Error during Data Source initialization:", err)
    })
}



const app = express()
app.use(cors({
    "origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": true,
    "optionsSuccessStatus": 200
}))
app.use(express.json())

app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/track", trackRoutes);
app.use("/playlist", playlistRoutes);
app.use("/favorite", favoriteRoutes);
app.use("/file", musicRoutes);


