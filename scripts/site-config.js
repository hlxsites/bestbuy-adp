/**
 * Create site config object from
 * /site-config.json
 */
// eslint-disable-next-line import/prefer-default-export
export async function fetchSiteConfig(worksheetId) {
  if (window.adp) return window.adp[worksheetId]?.data;

  const resp = await fetch(`${window.hlx.codeBasePath}/site-config.json`);
  if (resp.ok) {
    const config = await resp.json();
    window.adp = config;
    return window.adp[worksheetId]?.data;
  }
  throw new Error(`${resp.status}: ${resp.statusText}`);
}
