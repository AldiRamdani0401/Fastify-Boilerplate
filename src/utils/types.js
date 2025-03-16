import ThrowError from "../errors/throw.error.js";

export const Mandatory = (value, fieldName = "Field") => {
    if (value === undefined || value === null || value === "") {
      ThrowError(400, `${fieldName} is required`);
    }
    return value;
  };
  