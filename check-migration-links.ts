
import { readFileSync } from 'node:fs';

const data = JSON.parse(
  readFileSync('full-sqlite-export.json', 'utf8')
);

type Row = Record<string, any>;

function ids(rows: Row[]) {
  return new Set(rows.map((row) => row.id));
}

function check(
  label: string,
  rows: Row[],
  field: string,
  validIds: Set<string>
) {
  const missing = rows.filter(
    (row) => row[field] && !validIds.has(row[field])
  );

  console.log(
    `${label}: ${rows.length} rows; ` +
    `${missing.length} missing ${field} references`
  );

  for (const row of missing.slice(0, 5)) {
    console.log(`  Row ${row.id}: ${field}=${row[field]}`);
  }
}

const users = ids(data.User ?? []);
const profiles = ids(data.UserProfile ?? []);
const skills = ids(data.Skill ?? []);
const companies = ids(data.Company ?? []);
const internships = ids(data.Internship ?? []);
const sources = ids(data.InternshipSource ?? []);
const conversations = ids(data.ChatConversation ?? []);
const applications = ids(data.Application ?? []);
const roadmaps = ids(data.LearningRoadmap ?? []);
const steps = ids(data.RoadmapStep ?? []);
const assessments = ids(data.SkillAssessment ?? []);

console.log('\n--- Foreign-key reference checks ---');

check('UserProfile → User', data.UserProfile ?? [], 'userId', users);
check('UserSkill → UserProfile', data.UserSkill ?? [], 'profileId', profiles);
check('UserSkill → Skill', data.UserSkill ?? [], 'skillId', skills);
check('Internship → Company', data.Internship ?? [], 'companyId', companies);
check('SavedInternship → User', data.SavedInternship ?? [], 'userId', users);
check('SavedInternship → Internship', data.SavedInternship ?? [], 'internshipId', internships);
check('ChatConversation → User', data.ChatConversation ?? [], 'userId', users);
check('ChatMessage → Conversation', data.ChatMessage ?? [], 'conversationId', conversations);
check('InternshipImportCandidate → Source', data.InternshipImportCandidate ?? [], 'sourceId', sources);
check('InternshipSyncRun → Source', data.InternshipSyncRun ?? [], 'sourceId', sources);
check('UserRoadmapProgress → User', data.UserRoadmapProgress ?? [], 'userId', users);
check('UserRoadmapProgress → Step', data.UserRoadmapProgress ?? [], 'stepId', steps);
check('SkillAssessment → Step', data.SkillAssessment ?? [], 'stepId', steps);
check('AssessmentAttempt → Assessment', data.AssessmentAttempt ?? [], 'assessmentId', assessments);
check('ApplicationStatusHistory → Application', data.ApplicationStatusHistory ?? [], 'applicationId', applications);

console.log('\n--- Ownership and row counts ---');
console.log('Local users:', users.size);
console.log('Profiles:', profiles.size);
console.log('Skills:', skills.size);
console.log('Companies:', companies.size);
console.log('Internships:', internships.size);
console.log('Conversations:', conversations.size);
console.log('Messages:', (data.ChatMessage ?? []).length);
console.log('Saved internships:', (data.SavedInternship ?? []).length);
console.log('Roadmaps in local export:', roadmaps.size);

console.log('\nCheck complete. This script only reads the JSON export.');