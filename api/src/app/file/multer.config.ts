// multer.config.ts
import { diskStorage } from 'multer';
//import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';

export const multerOptions = {
  storage: diskStorage({
    destination: 'uploadedFiles', // Destination folder
    filename: (req, file, callback) => {
        let filename = req.body.filename;
        const fileExtName = path.extname(file.originalname);
        if (!filename) {
            // If no filename provided, use a default naming strategy
            filename = `${Date.now()}-${file.originalname}`;
          }
        //const randomName = uuidv4(); // Generate a unique name
        callback(null, `${filename}${fileExtName}`);
    },
  }),
};
