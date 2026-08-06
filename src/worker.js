// Cloudflare Worker entry point.
//
// The site is a plain static build served straight from the repo root by
// Workers Assets. The only dynamic behaviour is the domain migration: the old
// darrenkre.com alias 301s to the canonical darrenkrealestate.com. Everything
// else falls through to the static assets, unchanged.

var OLD_HOST = /^(www\.)?darrenkre\.com$/i;
var CANONICAL_HOST = 'darrenkrealestate.com';

// Carried over from the old Apache .htaccess so the site keeps sending them
// now that Cloudflare serves everything. Deliberately conservative — no CSP,
// which would need auditing against the Google Fonts and Matterport embeds.
var SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'SAMEORIGIN',
  'Referrer-Policy': 'strict-origin-when-cross-origin'
};

export default {
  async fetch(request, env) {
    var url = new URL(request.url);

    // Old alias domain -> canonical domain, preserving path and query string.
    // Guarded on hostname so it can never fire for darrenkrealestate.com
    // itself (no redirect loops) or for the workers.dev preview URL.
    if (OLD_HOST.test(url.hostname)) {
      url.hostname = CANONICAL_HOST;
      url.protocol = 'https:';
      url.port = '';
      // Built by hand rather than with Response.redirect() so we can bound how
      // long the 301 is cached. Browsers cache permanent redirects
      // indefinitely by default (Safari especially), which makes the target
      // impossible to change without asking every visitor to clear their
      // cache. An hour keeps it cheap but revocable.
      return new Response(null, {
        status: 301,
        headers: {
          'Location': url.toString(),
          'Cache-Control': 'max-age=3600'
        }
      });
    }

    // Normal traffic: serve the static asset, with the light security headers
    // that used to live in .htaccess back when Plesk/Apache served the site.
    var res = await env.ASSETS.fetch(request);
    res = new Response(res.body, res); // headers on the original are immutable
    for (var name in SECURITY_HEADERS) {
      res.headers.set(name, SECURITY_HEADERS[name]);
    }
    return res;
  }
};
