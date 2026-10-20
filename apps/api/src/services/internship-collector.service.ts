import { prisma } from '../prisma';

const SIX_HOURS = 6 * 60 * 60 * 1000;
const REQUEST_TIMEOUT_MS = 15_000;
const MAX_PAGE_BYTES = 2_000_000;
const KEYWORDS = /intern(ship)?|student\s+(project|trainee)|summer\s+(intern|program|programme)|industrial\s+training/i;

function safeHttpsUrl(raw: string): URL {
  const url = new URL(raw);
  if (url.protocol !== 'https:') throw new Error('Only HTTPS source URLs are allowed.');
  const host = url.hostname.toLowerCase();
  if (host === 'localhost' || host.endsWith('.localhost') || host.endsWith('.local') || /^127\./.test(host) || host === '::1' || /^10\./.test(host) || /^192\.168\./.test(host) || /^169\.254\./.test(host) || /^172\.(1[6-9]|2\d|3[01])\./.test(host)) {
    throw new Error('Private or local source hosts are not allowed.');
  }
  if (url.username || url.password) throw new Error('Credentials in source URLs are not allowed.');
  return url;
}

function decodeEntities(value: string): string {
  return value.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ').replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)));
}
function stripHtml(value: string): string {
  return decodeEntities(value.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()).slice(0, 5000);
}
function tagValue(block: string, tag: string): string {
  const re = new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}\\s*>`, 'i');
  const m = block.match(re);
  if (!m) return '';
  return stripHtml(m[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1'));
}
function resolveLink(href: string, base: URL): string | null {
  try {
    const u = new URL(decodeEntities(href.trim()), base);
    if (!['https:', 'http:'].includes(u.protocol)) return null;
    u.hash = '';
    return u.toString();
  } catch { return null; }
}

export type CollectedOpportunity = { title: string; canonicalUrl: string; applyUrl: string; excerpt: string; publishedAt: Date | null };

async function fetchSourcePage(rawUrl: string): Promise<{ text: string; contentType: string }> {
  const url = safeHttpsUrl(rawUrl);
  const response = await fetch(url, {
    redirect: 'manual',
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    headers: { 'user-agent': 'StudentAssist-InternshipCollector/1.0 (+official-source-monitor)', accept: 'text/html,application/rss+xml,application/atom+xml,application/xml,application/json;q=0.9,*/*;q=0.5' },
  });
  if (response.status >= 300 && response.status < 400) throw new Error(`Source redirected (HTTP ${response.status}); update the configured official URL.`);
  if (!response.ok) throw new Error(`Source returned HTTP ${response.status}.`);
  const contentType = response.headers.get('content-type') || '';
  const declaredLength = Number(response.headers.get('content-length') || 0);
  if (declaredLength > MAX_PAGE_BYTES) throw new Error('Source page exceeds the 2 MB safety limit.');
  const text = await response.text();
  if (Buffer.byteLength(text, 'utf8') > MAX_PAGE_BYTES) throw new Error('Source page exceeds the 2 MB safety limit.');
  return { text, contentType };
}

export async function collectFromSource(source: {
  id: string;
  sourceUrl: string;
  sourceName: string;
  sourceType: string;
}) {
  const pageUrl = safeHttpsUrl(source.sourceUrl);
  const items: CollectedOpportunity[] = [];

  // Microsoft careers search URLs can include a position ID in "pid".
  if (pageUrl.hostname === "apply.careers.microsoft.com") {
    const positionId = pageUrl.searchParams.get("pid");

    if (positionId && /^\d+$/.test(positionId)) {
      items.push({
        title: "Microsoft internship — verify role",
        canonicalUrl: `https://apply.careers.microsoft.com/careers/job/${positionId}`,
        applyUrl: `https://apply.careers.microsoft.com/careers/job/${positionId}`,
        excerpt:
          "Discovered from the configured Microsoft careers search URL. Verify the role and internship eligibility before approval.",
        publishedAt: null,
      });
    }

    return items;
  }

  // Existing feed and HTML parsing for other configured sources.
  const { text: body, contentType } = await fetchSourcePage(pageUrl.toString());
  const isFeed =
    /xml|rss|atom/i.test(contentType) ||
    /<rss\b|<feed\b|<rdf:RDF/i.test(body);

  if (isFeed) {
    const blocks =
      body.match(/<(?:item|entry)\b[^>]*>[\s\S]*?<\/(?:item|entry)\s*>/gi) || [];

    for (const block of blocks) {
      const title = tagValue(block, "title");
      const rawLink =
        block.match(/<link\b[^>]*href=["']([^"']+)["'][^>]*\/?>/i)?.[1] ||
        tagValue(block, "link") ||
        tagValue(block, "guid");

      const link = resolveLink(rawLink, pageUrl);
      if (!title || !link || !KEYWORDS.test(`${title} ${link}`)) continue;

      const rawDate =
        tagValue(block, "pubDate") ||
        tagValue(block, "published") ||
        tagValue(block, "updated");
      const date = rawDate ? new Date(rawDate) : null;

      items.push({
        title: title.slice(0, 250),
        canonicalUrl: link,
        applyUrl: link,
        excerpt: tagValue(block, "description") || tagValue(block, "summary"),
        publishedAt:
          date && !Number.isNaN(date.getTime()) ? date : null,
      });
    }
  } else {
    const anchors =
      /<a\b([^>]*?)href\s*=\s*(["'])(.*?)\2([^>]*)>([\s\S]*?)<\/a\s*>/gi;
    let match: RegExpExecArray | null;

    while ((match = anchors.exec(body)) !== null) {
      const title = stripHtml(match[5]);
      const link = resolveLink(match[3], pageUrl);

      if (
        !title ||
        title.length < 4 ||
        !link ||
        !KEYWORDS.test(`${title} ${link}`)
      ) {
        continue;
      }

      try {
        if (new URL(link).protocol !== "https:") continue;
      } catch {
        continue;
      }

      items.push({
        title: title.slice(0, 250),
        canonicalUrl: link,
        applyUrl: link,
        excerpt: "",
        publishedAt: null,
      });
    }
  }

  const deduped = new Map<string, CollectedOpportunity>();
  for (const item of items) {
    deduped.set(item.canonicalUrl, item);
  }

  return [...deduped.values()].slice(0, 250);
}


export async function syncConfiguredSources() {
  const sources = await prisma.internshipSource.findMany({ where: { active: true }, orderBy: { createdAt: 'asc' } });
  const summary = { sourcesChecked: 0, sourcesFailed: 0, candidatesFound: 0, newCandidates: 0 };
  for (const source of sources) {
    const run = await prisma.internshipSyncRun.create({ data: { sourceId: source.id, status: 'RUNNING' } });
    try {
      const found = await collectFromSource(source);
      let created = 0;
      for (const item of found) {
        const existing = await prisma.internshipImportCandidate.findUnique({ where: { canonicalUrl: item.canonicalUrl } });
        if (!existing) created++;
        await prisma.internshipImportCandidate.upsert({
          where: { canonicalUrl: item.canonicalUrl },
          create: {
            sourceId: source.id, title: item.title, canonicalUrl: item.canonicalUrl,
            applyUrl: item.applyUrl, sourcePageUrl: source.sourceUrl, sourceName: source.sourceName,
            excerpt: item.excerpt, publishedAt: item.publishedAt, firstSeenAt: new Date(), lastSeenAt: new Date(), reviewStatus: 'PENDING',
          },
          update: { title: item.title, excerpt: item.excerpt, lastSeenAt: new Date(), sourcePageUrl: source.sourceUrl, sourceName: source.sourceName },
        });
        const refreshedCandidate = await prisma.internshipImportCandidate.findUnique({ where: { canonicalUrl: item.canonicalUrl } });
        if (refreshedCandidate?.reviewStatus === 'APPROVED' && refreshedCandidate.importedInternshipId) {
          await prisma.internship.update({ where: { id: refreshedCandidate.importedInternshipId }, data: { lastCheckedDate: new Date() } }).catch(() => undefined);
        }
      }
      await prisma.internshipSource.update({ where: { id: source.id }, data: { lastSuccessfulSyncAt: new Date(), lastError: null } });
      await prisma.internshipSyncRun.update({ where: { id: run.id }, data: { status: 'SUCCESS', itemsFound: found.length, candidatesCreated: created, finishedAt: new Date() } });
      summary.sourcesChecked++; summary.candidatesFound += found.length; summary.newCandidates += created;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown source error';
      // Failures are recorded but never close/delete previously collected opportunities.
      await prisma.internshipSource.update({ where: { id: source.id }, data: { lastError: message.slice(0, 1000) } }).catch(() => undefined);
      await prisma.internshipSyncRun.update({ where: { id: run.id }, data: { status: 'FAILED', error: message.slice(0, 1000), finishedAt: new Date() } }).catch(() => undefined);
      summary.sourcesFailed++;
    }
  }
  return summary;
}

export function scheduleInternshipCollector() {
  const interval = setInterval(() => {
    syncConfiguredSources().then((summary) => console.log('[internship-collector] scheduled sync complete', summary)).catch((error) => console.error('[internship-collector] scheduled sync failed', error));
  }, SIX_HOURS);
  interval.unref?.();
  // Run once shortly after startup; avoid blocking API startup.
  const initial = setTimeout(() => {
    syncConfiguredSources().then((summary) => console.log('[internship-collector] startup sync complete', summary)).catch((error) => console.error('[internship-collector] startup sync failed', error));
  }, 10_000);
  initial.unref?.();
  return () => { clearInterval(interval); clearTimeout(initial); };
}

