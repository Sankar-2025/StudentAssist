
import { readFileSync } from 'node:fs';

const data = JSON.parse(
  readFileSync('full-sqlite-export.json', 'utf8')
);

const tables = [
  'Company',
  'Internship',
  'InternshipSource',
  'InternshipImportCandidate',
  'InternshipSyncRun',
  'InterviewQuestion',
  'Skill',
  'ChatConversation',
  'ChatMessage',
  'UserProfile',
  'UserSkill',
  'SavedInternship',
  'NotificationPreference',
  'UserRoadmapProgress',
];

for (const table of tables) {
  const rows = data[table] ?? [];
  console.log(`${table}: ${rows.length} rows`);

  if (table === 'ChatConversation' || table === 'UserProfile') {
    for (const row of rows) {
      console.log(`  id=${row.id}, userId=${row.userId}`);
    }
  }
}
