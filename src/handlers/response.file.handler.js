import mime from "mime-types";

const ResponseFileHandler = (
  reply,
  stream,
  fileName,
  dispositionType = "inline",
  size = null
) => {
  const mimeType = mime.lookup(fileName) || "application/octet-stream";

  reply.raw.writeHead(200, {
    "Content-Type": mimeType,
    "Content-Disposition": `${dispositionType}; filename="${fileName}"`,
    "Accept-Ranges": "bytes",
    ...(size && { "Content-Length": size })
  });

  stream.pipe(reply.raw);
};


export default ResponseFileHandler;
