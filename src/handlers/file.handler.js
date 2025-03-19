import multer from "multer";
import path from "path";
import fs from "fs";
import { promisify } from "util";

import ThrowError from "../errors/throw.error.js";

import { fileURLToPath } from "url";
import config from "../app/config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Setup storage
const storage = multer.diskStorage({
  destination: (req, _, cb) => {
    const urlParts = req.url.split("/");
    const fileType = urlParts[urlParts.length - 2];
    const fileOwner = urlParts[urlParts.length - 1];

    req.customStorageInfo = { fileType, fileOwner };

    const saveDir = path.resolve(`./src/storages/${fileType}`);
    if (!fs.existsSync(saveDir)) {
      fs.mkdirSync(saveDir, { recursive: true });
    }

    cb(null, saveDir);
  },
  filename: (req, file, cb) => {
    const { fileOwner, fileType } = req.customStorageInfo || {};
    const ownerPrefix = fileOwner || "unknown";
    const sanitizedOriginalName = file.originalname
      .replace(/\s+/g, "_")
      .replace(/[^a-zA-Z0-9._-]/g, "");
    const filename = `${ownerPrefix}_${sanitizedOriginalName}`;

    req.savedFileName = filename;
    req.imageURL = `${config.BASE_URL}/files/${fileType}/${filename}`;

    cb(null, filename);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 3 * 1024 * 1024, // 3MB
  },
});

const FileHandler = {
  uploadSingleFile: promisify(upload.single("file")),
  load: async (fileType, fileName) => {
    const filePath = path.join(
      __dirname,
      `../storages/${fileType}/${fileName}`
    );

    if (!fs.existsSync(filePath)) {
      ThrowError(404, "File not found");
    }

    const stream = fs.createReadStream(filePath);
    const { size } = fs.statSync(filePath);

    return { stream, size };
  },
  store: async (file, owner, fileType) => {
    const saveDir = path.resolve(`./src/storages/${fileType}`);
    if (!fs.existsSync(saveDir)) {
      await fs.promises.mkdir(saveDir, { recursive: true });
    }

    const sanitizedOriginalName = `${owner}_${file.filename}`
      .replace(/\s+/g, "_")
      .replace(/[^a-zA-Z0-9._-]/g, "")
      .replace(/-/g, "_");

    const filePath = path.join(saveDir, sanitizedOriginalName);

    const fileData = file.data || file.buffer || Buffer.from([]);
    await fs.promises.writeFile(filePath, fileData);

    return `${config.BASE_URL}/files/${fileType}/${sanitizedOriginalName}`;
  },
  change: async (fileType, owner, oldFileName, newFile) => {
    if (!fileType || !owner || !oldFileName || !newFile) {
      ThrowError(400, "Missing fileType, owner, oldFileName, or file content");
    }

    // Ambil nama file baru dari file upload
    const originalName = newFile.originalname || newFile.filename;
    if (!originalName) {
      ThrowError(400, "New file name is missing");
    }

    // Direktori penyimpanan file berdasarkan tipe dan owner
    const dirPath = path.resolve(`./src/storages/${fileType}`);
    const oldPath = path.join(dirPath, oldFileName);

    // Pastikan direktori ada
    if (!fs.existsSync(dirPath)) {
      await fs.promises.mkdir(dirPath, { recursive: true });
    }

    // Cek apakah file lama ada
    if (!fs.existsSync(oldPath)) {
      ThrowError(404, "Old file not found");
    }

    // Hapus file lama
    await fs.promises.unlink(oldPath);

    // Format nama baru: owner_sanitizedfilename.ext
    const ext = path.extname(originalName);
    const baseName = path.basename(originalName, ext);
    const sanitizedBaseName = baseName
      .replace(/\s+/g, "_")
      .replace(/[^a-zA-Z0-9_-]/g, "");
    const finalFileName = `${owner}_${sanitizedBaseName}${ext}`;
    const newPath = path.join(dirPath, finalFileName);

    // Simpan file baru
    const buffer = newFile.buffer || newFile;
    await fs.promises.writeFile(newPath, buffer);

    return finalFileName;
  },
  delete: async (fileType, fileName) => {
    if (!fileType || !fileName) {
      ThrowError(400, "Missing fileType or fileName");
    }

    const filePath = path.resolve(`./src/storages/${fileType}/${fileName}`);

    if (!fs.existsSync(filePath)) {
      ThrowError(404, "File Not Found");
    }

    await fs.promises.unlink(filePath);
  },
};

export default FileHandler;
