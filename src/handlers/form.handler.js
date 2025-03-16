const FormHandler = async (request) => {
  const parts = request.parts();

  const form = {};
  const files = [];

  for await (const part of parts) {
    if (part.type === "field") {
      form[part.fieldname] = part.value;
    } else if (part.type === "file") {
      const chunks = [];
      for await (const chunk of part.file) {
        chunks.push(chunk);
      }
      files.push({
        fieldname: part.fieldname,
        filename: part.filename,
        encoding: part.encoding,
        mimetype: part.mimetype,
        buffer: Buffer.concat(chunks),
      });
    }
  }

  // Handle files from request.raw.file
  if (request.raw.file) {
    const rawFileChunks = [];
    for await (const chunk of request.raw.file) {
      rawFileChunks.push(chunk);
    }
    files.push({
      fieldname: "rawFile",
      filename: request.raw.file.filename,
      encoding: request.raw.file.encoding,
      mimetype: request.raw.file.mimetype,
      buffer: Buffer.concat(rawFileChunks),
    });
  }

  form.files = files;

  return form;
};

export default FormHandler;
