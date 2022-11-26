import multer from "multer";
import path from "path";
import util from "util";
import { fileURLToPath } from "node:url";

const MAX_SIZE = 2;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const maxSize = MAX_SIZE * 1024 * 1024;

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __dirname + "/src/assets/uploads/");
  },
  filename: (req, file, cb) => {
    // console.log(file.originalname);
    cb(null, file.originalname);
  },
});

let uploadFile = multer({
  storage: storage,
  limits: { fileSize: maxSize },
}).single("file");

let uploadFileMiddleware = util.promisify(uploadFile);

export { uploadFileMiddleware as upload, MAX_SIZE };
