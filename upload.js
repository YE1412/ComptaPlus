import multer from "multer";
import path from "path";
import util from "util";
import { fileURLToPath } from "node:url";
import * as dotenv from "dotenv";

const MAX_SIZE = 2;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "envs/.env") });
const maxSize = MAX_SIZE * 1024 * 1024;

let dest = "/src/assets/uploads/";
dest =
  process.env.CTX === "production" ? "/dist/prod/client/assets/uploads/" : dest;
dest = process.env.CTX === "development" ? "/src/assets/uploads/" : dest;

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __dirname + dest);
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
