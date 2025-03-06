import bcrypt from "bcryptjs";
import config from "../app/config.js";

const HashHandler = {
    generate: async (value) => {
        const result = await bcrypt.hash(value, config.PASS_PATTERN);
        return result;
    },
    compare: async (value, compareValue) => {
        const result = await bcrypt.compare(value, compareValue);
        return result;
    }
}

export default HashHandler;