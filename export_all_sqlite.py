
import sqlite3
import json
from pathlib import Path

db_path = Path("apps/api/prisma/dev.db")
output_path = Path("full-sqlite-export.json")

if not db_path.exists():
    raise SystemExit(f"Database not found: {db_path.resolve()}")

conn = sqlite3.connect(str(db_path))
conn.row_factory = sqlite3.Row

tables = [
    row[0] for row in conn.execute("""
        SELECT name FROM sqlite_master
        WHERE type = 'table'
          AND name NOT LIKE 'sqlite_%'
          AND name NOT LIKE '_prisma%'
        ORDER BY name
    """)
]

data = {}

for table in tables:
    quoted = '"' + table.replace('"', '""') + '"'
    rows = conn.execute(f"SELECT * FROM {quoted}").fetchall()
    data[table] = [dict(row) for row in rows]

conn.close()

output_path.write_text(
    json.dumps(data, indent=2, default=str),
    encoding="utf-8"
)

print("Full export completed.")
print("Tables exported:", len(data))
print("Total rows exported:", sum(len(rows) for rows in data.values()))
print("File:", output_path.resolve())
