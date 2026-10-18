
import sqlite3
import json
from pathlib import Path

db_path = Path("apps/api/prisma/dev.db")
output_path = Path("roadmaps-export.json")

if not db_path.exists():
    print("ERROR: Database file not found:", db_path.resolve())
    raise SystemExit(1)

conn = sqlite3.connect(str(db_path))
conn.row_factory = sqlite3.Row

roadmaps = [
    dict(row)
    for row in conn.execute("SELECT * FROM LearningRoadmap")
]

steps = [
    dict(row)
    for row in conn.execute("SELECT * FROM RoadmapStep")
]

conn.close()

data = {
    "roadmaps": roadmaps,
    "steps": steps
}

output_path.write_text(
    json.dumps(data, indent=2, default=str),
    encoding="utf-8"
)

print("Export completed successfully!")
print("Roadmaps:", len(roadmaps))
print("Roadmap steps:", len(steps))
print("Export file:", output_path.resolve())
