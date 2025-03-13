import config from "../app/config";
import ThrowError from "../errors/throw.error";

const AuthSecurity = async (apiKey) => {
  if (apiKey !== config.API_KEY_SECRET) {
    return ThrowError(403);
  }
  return true;
};

export default AuthSecurity;
