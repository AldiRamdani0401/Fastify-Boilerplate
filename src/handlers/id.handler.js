import { v4 as uuid } from "uuid";

const IdHandler = {
  generate: async (role) => {
    const idBase = uuid().replace(/-/g, "").padEnd(85, "0"); // Adjusted length to fit 85 characters
    const rolePrefix = role === "proctor" ? "PRC" : "EXM";
    const timestamp = Date.now().toString(36).padStart(10, "0"); // Adjusted length to fit 10 characters
    const uniqueId = `${rolePrefix}-${idBase}-${timestamp}`;
    return uniqueId;
  },
  verify: async (id) => {
    const [rolePrefix, idBase, timestamp] = id.split("-");
    if (!rolePrefix || !idBase || !timestamp) {
      return false;
    }
    const validRolePrefix = rolePrefix === "PRC" || rolePrefix === "EXM";
    const validIdBase = idBase.length === 85; // Adjusted length to fit 85 characters
    const validTimestamp = !isNaN(parseInt(timestamp, 36)) && timestamp.length === 10; // Ensure timestamp is 10 characters long
    return validRolePrefix && validIdBase && validTimestamp;
  },
};

export default IdHandler;
