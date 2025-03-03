import { v4 as uuid } from "uuid";
import crypto from "crypto";
import config from "../app/config";


const TokenHandler = {
  generate: async () => {
    const tokenBase = uuid().replace(/-/g, "").slice(0, 32); // UUID tanpa '-'
    const hmac = crypto.createHmac("sha256", config.TOKEN_SECRET).update(tokenBase).digest("hex"); // 64 karakter
    let finalToken = `${tokenBase}${hmac}`.slice(0, 100); // Pastikan pas 100 karakter
    return finalToken;
  },

  verify: async (token) => {
    if (token.length !== 100) return false;
    const tokenBase = token.slice(0, 32);
    const expectedHmac = crypto.createHmac("sha256", config.TOKEN_SECRET).update(tokenBase).digest("hex").slice(0, 68);
    return expectedHmac === token.slice(32);
  }
};

export default TokenHandler;