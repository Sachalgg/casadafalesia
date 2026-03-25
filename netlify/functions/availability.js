// Netlify Function: fetch Airbnb iCal and return blocked date ranges as JSON
// GET /.netlify/functions/availability

const ICAL_URL = 'https://www.airbnb.com/calendar/ical/1328302541497154473.ics';

exports.handler = async () => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  };

  try {
    const res = await fetch(ICAL_URL, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; casa-da-falesia/1.0)' },
    });

    if (!res.ok) {
      return { statusCode: 200, headers, body: JSON.stringify({ blocked: [] }) };
    }

    const text = await res.text();
    const blocked = parseIcal(text);

    return { statusCode: 200, headers, body: JSON.stringify({ blocked }) };
  } catch (err) {
    console.error('availability error:', err);
    return { statusCode: 200, headers, body: JSON.stringify({ blocked: [] }) };
  }
};

/**
 * Parse iCal text and return an array of date strings "YYYY-MM-DD"
 * covering every day within each VEVENT's DTSTART..DTEND range.
 */
function parseIcal(text) {
  const blocked = new Set();
  const events = text.split('BEGIN:VEVENT');

  for (let i = 1; i < events.length; i++) {
    const block = events[i];
    const startMatch = block.match(/DTSTART(?:;VALUE=DATE)?:(\d{8})/);
    const endMatch   = block.match(/DTEND(?:;VALUE=DATE)?:(\d{8})/);
    if (!startMatch || !endMatch) continue;

    const start = parseDate(startMatch[1]);
    const end   = parseDate(endMatch[1]);
    if (!start || !end) continue;

    // iCal DTEND is exclusive — block up to but not including end
    for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
      blocked.add(toDateStr(d));
    }
  }

  return Array.from(blocked).sort();
}

// "20260315" → Date object
function parseDate(s) {
  if (s.length !== 8) return null;
  const y = parseInt(s.slice(0, 4), 10);
  const m = parseInt(s.slice(4, 6), 10) - 1;
  const d = parseInt(s.slice(6, 8), 10);
  return new Date(Date.UTC(y, m, d));
}

// Date → "YYYY-MM-DD"
function toDateStr(d) {
  return d.toISOString().slice(0, 10);
}
