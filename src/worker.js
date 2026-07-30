// Cloudflare Worker entry point.
//
// The site is a plain static build served straight from the repo root by
// Workers Assets. The only dynamic behaviour is the domain migration: the old
// darrenkre.com alias 301s to the canonical darrenkrealestate.com. Everything
// else falls through to the static assets, unchanged.

var OLD_HOST = /^(www\.)?darrenkre\.com$/i;
var CANONICAL_HOST = 'darrenkrealestate.com';

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
      return Response.redirect(url.toString(), 301);
    }

    return env.ASSETS.fetch(request);
  }
};
