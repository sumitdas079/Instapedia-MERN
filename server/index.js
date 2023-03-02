import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import multer from 'multer';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url'; // to set paths when configuring directories

import connectDB from './config/db.js';
import { register } from './controllers/authorization.js'
import authRoutes from './routes/authRoutes.js'
import usersRoutes from './routes/usersRoutes.js'
import postRoutes from './routes/postRoutes.js'
import { verifyToken } from './middleware/auth.js';
import { createPost } from './controllers/posts.js';

const __filename = fileURLToPath(import.meta.url); //to get file url
const __dirname = path.dirname(__filename);

dotenv.config();
connectDB();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

// to save uploads in a file destination on the local machine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

//routes with files
app.post("/auth/register", upload.single("picture"), register); //to upload picture while registering
app.post("/post", verifyToken, upload.single("picture"), createPost); //to upload pics while posting

//routes
app.use('/auth', authRoutes);
app.use('/users', usersRoutes);
app.use('/posts', postRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`server running on port:${PORT}`);
})
