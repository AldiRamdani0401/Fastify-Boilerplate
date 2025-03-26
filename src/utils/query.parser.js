const QueryParser = (request) => {
  const page = Number(
    request.query.page?.replace(/^['"]+|['"]+$/g, "").trim() ?? 1
  );
  const limit = Number(
    request.query.limit?.replace(/^['"]+|['"]+$/g, "").trim() ?? 10
  );
  const search = request.query.search
    ? String(request.query.search)
        .replace(/^['"]+|['"]+$/g, "")
        .trim()
    : undefined;
  const orderValue = Number(
    request.query.order?.replace(/^['"]+|['"]+$/g, "").trim()
  );
  const order =
    orderValue === 1 ? "asc" : orderValue === 2 ? "desc" : undefined;

  return { page, limit, ...(search && { search }), ...(order && { order }) };
};

export default QueryParser;
