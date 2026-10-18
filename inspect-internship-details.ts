
import { readFileSync } from 'node:fs';

const data = JSON.parse(
  readFileSync('full-sqlite-export.json', 'utf8')
);

console.log('\n--- FULL LOCAL INTERNSHIP DETAILS ---');

for (const internship of data.Internship ?? []) {
  console.log(JSON.stringify({
    id: internship.id,
    title: internship.title,
    category: internship.category,
    location: internship.location,
    country: internship.country,
    workMode: internship.workMode,
    duration: internship.duration,
    stipend: internship.stipend,
    isPaid: internship.isPaid,
    description: internship.description,
    requirements: internship.requirements,
    minGraduationYear: internship.minGraduationYear,
    maxGraduationYear: internship.maxGraduationYear,
    allowedDegrees: internship.allowedDegrees,
    officialApplyUrl: internship.officialApplyUrl,
    deadline: internship.deadline,
    verificationStatus: internship.verificationStatus,
    sourceUrl: internship.sourceUrl,
    sourceType: internship.sourceType,
    lastCheckedDate: internship.lastCheckedDate,
    isDemoData: internship.isDemoData,
    postedAt: internship.postedAt,
    createdAt: internship.createdAt,
    updatedAt: internship.updatedAt,
  }, null, 2));
}
