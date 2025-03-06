import { v4 as uuid } from "uuid";
import crypto from "crypto";
import config from "../app/config.js";


const TokenHandler = {
  generate: async () => {
    const tokenBase = uuid().replace(/-/g, "").slice(config.TOKEN_INIT, config.TOKEN_BASE);
    const hmac = crypto.createHmac(config.TOKEN_CRYPTO, config.TOKEN_SECRET).update(tokenBase).digest(config.TOKEN_PATTERN);
    let finalToken = `st$${tokenBase}${hmac}$`.slice(config.TOKEN_INIT, config.TOKEN_SIZE);
    return finalToken;
  },

  verify: async (token) => {
    if (token.length !== config.TOKEN_SIZE) return false;
    const tokenBase = token.slice(config.TOKEN_INIT + 2, config.TOKEN_BASE + 2);
    const expectedHmac = crypto.createHmac(config.TOKEN_CRYPTO, config.TOKEN_SECRET).update(tokenBase).digest(config.TOKEN_PATTERN);
    return `st$${tokenBase}${expectedHmac}$`.slice(config.TOKEN_INIT, config.TOKEN_SIZE) === token;
  }
};

export default TokenHandler;