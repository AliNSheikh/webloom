import { Category, Product, StoreSettings } from '../types';

export function generateSitemapXml(
  products: Product[],
  categories: Category[],
  settings: StoreSettings
): string {
  const baseUrl = (typeof window !== 'undefined' && window.location.origin) || `https://${settings.site_domain || 'hama-flowers.sy'}`;
  const today = new Date().toISOString().split('T')[0];

  const activeCategories = categories.filter((c) => !c.is_archived);
  const activeProducts = products.filter((p) => !p.is_archived && p.is_available);

  const urls = [
    `  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`,
    `  <url>
    <loc>${baseUrl}/#catalog</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`,
    `  <url>
    <loc>${baseUrl}/#location</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`,
    `  <url>
    <loc>${baseUrl}/#custom-bouquet</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>`,
  ];

  activeCategories.forEach((cat) => {
    urls.push(`  <url>
    <loc>${baseUrl}/#category/${encodeURIComponent(cat.slug)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`);
  });

  activeProducts.forEach((prod) => {
    const prodDate = prod.created_at ? prod.created_at.split('T')[0] : today;
    urls.push(`  <url>
    <loc>${baseUrl}/#product/${encodeURIComponent(prod.slug)}</loc>
    <lastmod>${prodDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`);
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;
}

export function downloadSitemapXml(content: string, filename = 'sitemap.xml'): void {
  const blob = new Blob([content], { type: 'application/xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
