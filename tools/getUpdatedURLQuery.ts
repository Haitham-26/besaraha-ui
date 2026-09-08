type QueryValue = string | number | boolean | null | undefined;

export function getUpdatedURLQuery(
  searchParams: URLSearchParams,
  pathname: string,
  queries: { key: string; value: QueryValue }[],
) {
  const params = new URLSearchParams(searchParams);

  for (const { key, value } of queries) {
    if (value === null || value === undefined) {
      params.delete(key);
    } else {
      params.set(key, String(value));
    }
  }

  const queryString = params.toString();

  return queryString ? `${pathname}?${queryString}` : pathname;
}
