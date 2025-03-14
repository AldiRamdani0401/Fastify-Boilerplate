import config from "../app/config.js";
import ThrowError from "../errors/throw.error.js";

const AuthSecurity = async (apiKey) => {
  if (apiKey !== config.API_KEY_SECRET) {
    return ThrowError(403);
  }
  return true;
};

export default AuthSecurity;
