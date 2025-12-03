import multer from 'multer'
export const upload = multer({
  storage: multer.memoryStorage(),
});

export const singleUpload = upload.single("file")