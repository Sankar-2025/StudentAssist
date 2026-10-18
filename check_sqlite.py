
import sqlite3
from pathlib import Path

db = Path("apps/api/prisma/dev.db")

if not db.exists():
    print("Database not found:", db.resolve())
    raise SystemExit(1)

conn = sqlite3.connect(str(db))

tables = conn.execute("""
    SELECT name
    FROM sqlite_master
    WHERE type = 'table'
      AND name NOT LIKE 'sqlite_%'
      AND name NOT LIKE '_prisma%'
    ORDER BY name
""").fetchall()

print("LOCAL SQLITE TABLE COUNTS")
print("-" * 35)

for (table,) in tables:
    count = conn.execute(
        f'SELECT COUNT(*) FROM "{table}"'
    ).fetchone()[0]
    print(f"{table}: {count}")

conn.close()