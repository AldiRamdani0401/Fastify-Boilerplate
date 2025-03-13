import { v4 as uuid } from "uuid";
import crypto from "crypto";
import config from "../app/config.js";

const TokenHandler = {
  generate: async () => {
    const tokenBase = uuid()
      .replace(/-/g, "")
      .slice(config.TOKEN_INIT, config.TOKEN_BASE);

    const hmac = crypto
      .createHmac(config.TOKEN_CRYPTO, config.TOKEN_SECRET)
      .update(tokenBase)
      .digest(config.TOKEN_PATTERN);

    const finalToken = `st$${tokenBase}${hmac}$`.slice(
      config.TOKEN_INIT,
      config.TOKEN_SIZE
    );

    return finalToken;
  },

  verify: async (token) => {
    if (!token.startsWith("st$") || !token.endsWith("$")) return false;
    if (token.length !== config.TOKEN_SIZE) return false;

    const tokenBaseLength = config.TOKEN_BASE - config.TOKEN_INIT;

    const baseStart = config.TOKEN_INIT + 3;
    const baseEnd = baseStart + tokenBaseLength;
    const tokenBase = token.slice(baseStart, baseEnd);

    const expectedHmac = crypto
      .createHmac(config.TOKEN_CRYPTO, config.TOKEN_SECRET)
      .update(tokenBase)
      .digest(config.TOKEN_PATTERN);

    const expectedToken = `st$${tokenBase}${expectedHmac}$`.slice(
      config.TOKEN_INIT,
      config.TOKEN_SIZE
    );

    return expectedToken === token;
  },
};

export default TokenHandler;
