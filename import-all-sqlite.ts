
import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const prisma = new PrismaClient();

type Row = Record<string, unknown>;
type ExportData = Record<string, Row[]>;

async function main() {
  const file = resolve(process.cwd(), 'full-sqlite-export.json');
  const data = JSON.parse(readFileSync(file, 'utf8')) as ExportData;

  const tables = Object.keys(data);
  let inserted = 0;
  let skipped = 0;
  let failed = 0;

  // Import parent tables first where possible.
  // Repeated passes allow previously blocked child rows to be retried.
  const pending = new Map<string, Row[]>(
    tables.map((table) => [table, [...data[table]]])
  );

  for (let pass = 0; pass < tables.length + 1; pass++) {
    let progress = false;

    for (const table of tables) {
      const rows = pending.get(table) ?? [];
      if (!rows.length) continue;

      const columns = await prisma.$queryRawUnsafe<
        Array<{ column_name: string }>
      >(
        `SELECT column_name
         FROM information_schema.columns
         WHERE table_schema = current_schema()
           AND table_name = $1`,
        table
      );

      if (!columns.length) {
        console.log(`SKIP TABLE: ${table} (not found in PostgreSQL)`);
        skipped += rows.length;
        pending.set(table, []);
        progress = true;
        continue;
      }

      const validColumns = new Set(columns.map((c) => c.column_name));
      const remaining: Row[] = [];

      for (const row of rows) {
        const entries = Object.entries(row).filter(
          ([key]) => validColumns.has(key)
        );

        if (!entries.length) {
          skipped++;
          continue;
        }

        const names = entries
          .map(([key]) => `"${key.replace(/"/g, '""')}"`)
          .join(', ');

        const placeholders = entries
          .map((_, i) => `$${i + 1}`)
          .join(', ');

        const sql =
          `INSERT INTO "${table.replace(/"/g, '""')}" ` +
          `(${names}) VALUES (${placeholders}) ON CONFLICT DO NOTHING`;

        try {
          const result = await prisma.$executeRawUnsafe(
            sql,
            ...entries.map(([, value]) => value)
          );

          if (result > 0) inserted++;
          else skipped++;

          progress = true;
        } catch {
          // Keep failed rows for another pass, since a parent may
          // be inserted later. Never delete or update existing rows.
          remaining.push(row);
        }
      }

      pending.set(table, remaining);
    }

    if (!progress) break;
  }

  for (const [table, rows] of pending) {
    if (rows.length) {
      failed += rows.length;
      console.log(`UNIMPORTED: ${table}: ${rows.length} rows`);
    }
  }

  console.log('\nBulk import finished.');
  console.log('Rows inserted:', inserted);
  console.log('Rows skipped/conflicted:', skipped);
  console.log('Rows still requiring attention:', failed);
  console.log('Existing PostgreSQL records were not updated or deleted.');
}

main()
  .catch((error) => {
    console.error('Import stopped:', error.message ?? error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
