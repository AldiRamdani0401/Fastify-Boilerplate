const ThrowError = (code = 400, message = null) => {
    const error = new Error(message || "");
    error.statusCode = code;
    throw error;
}

export default ThrowError;