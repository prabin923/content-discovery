export function parsePage(raw: unknown): number {
  const numeric = Number(raw);
  if (Number.isNaN(numeric) || numeric < 1) {
    return 1;
  }
  return Math.trunc(numeric);
}

export function parseLimit(raw: unknown, max = 50, fallback = 20): number {
  const numeric = Number(raw);
  if (Number.isNaN(numeric)) {
    return fallback;
  }
  return Math.max(1, Math.min(max, Math.trunc(numeric)));
}

export function paginationMeta(total: number, page: number, limit: number) {
  return {
    page,
    limit,
    total,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
}
