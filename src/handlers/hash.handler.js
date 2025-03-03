import bcrypt from "bcrypt";
import config from "../app/config";

const HashHandler = {
    generate: async (value) => {
        console.log(config.PASS_PATTERN)
        const result = await bcrypt.hash(value, config.PASS_PATTERN);
        return result;
    },
    compare: async (value, compareValue) => {
        const result = await bcrypt.compare(value, compareValue);
        return result;
    }
}

export default HashHandler;