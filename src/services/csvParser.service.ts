import { parse } from 'csv-parse/sync';

export interface CsvParseResult {
  headers: string[];
  sampleRows: Record<string, string>[];
}

export function parseCsvBuffer(buffer: Buffer): CsvParseResult {
  if (!buffer || buffer.length === 0) {
    throw new Error('CSV is empty');
  }

  const text = buffer.toString('utf8');

  // Read the first non-empty line to get headers
  let headerLines: string[][];
  try {
    headerLines = parse(text, { to_line: 1, skip_empty_lines: true }) as string[][];
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`CSV parsing error: ${message}`);
  }

  if (!headerLines || headerLines.length === 0 || headerLines[0].length === 0) {
    throw new Error('CSV is missing a header row');
  }

  const headers = headerLines[0].map((h) => String(h));

  // Parse remaining rows into objects keyed by headers
  let records: Record<string, any>[];
  try {
    records = parse(text, {
      columns: headers,
      from_line: 2,
      skip_empty_lines: true,
      trim: true,
    }) as Record<string, any>[];
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`CSV parsing error: ${message}`);
  }

  if (!records || records.length === 0) {
    throw new Error('CSV contains no data rows');
  }

  const sampleRows = records.slice(0, 5).map((r) => {
    const out: Record<string, string> = {};
    for (const h of headers) {
      const v = r[h];
      out[h] = v === undefined || v === null ? '' : String(v);
    }
    return out;
  });

  return { headers, sampleRows };
}

export default { parseCsvBuffer };
