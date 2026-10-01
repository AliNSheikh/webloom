import { createClient } from '@supabase/supabase-js';
import {
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_HERO_SLIDES,
  INITIAL_FLOWER_VARIETIES,
  INITIAL_SITE_CONTENT,
  INITIAL_SETTINGS,
} from '../src/data/initialData';

const supabaseUrl = 'https://juiiibnuzbctwfmghevy.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp1aWlpYm51emJjdHdmbWdoZXZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA0MjQxMjgsImV4cCI6MjEwNjAwMDEyOH0.ezr1RPTfpJM-Ht9BCay_AWBOrk-b7GwDgLHmuHvLVW0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log('--- Starting complete Supabase data seeding ---');

  // 1. Categories
  console.log(`Seeding ${INITIAL_CATEGORIES.length} categories...`);
  const { error: catErr } = await supabase.from('categories').upsert(INITIAL_CATEGORIES, { onConflict: 'id' });
  if (catErr) {
    console.error('Error seeding categories:', catErr.message);
  } else {
    console.log('✓ Categories seeded successfully');
  }

  // 2. Products
  console.log(`Seeding ${INITIAL_PRODUCTS.length} products...`);
  const { error: prodErr } = await supabase.from('products').upsert(INITIAL_PRODUCTS, { onConflict: 'id' });
  if (prodErr) {
    console.error('Error seeding products:', prodErr.message);
  } else {
    console.log('✓ Products seeded successfully');
  }

  // 3. Hero Slides
  console.log(`Seeding ${INITIAL_HERO_SLIDES.length} hero slides...`);
  const { error: slideErr } = await supabase.from('hero_slides').upsert(INITIAL_HERO_SLIDES, { onConflict: 'id' });
  if (slideErr) {
    console.error('Error seeding hero slides:', slideErr.message);
  } else {
    console.log('✓ Hero slides seeded successfully');
  }

  // 4. Custom Flower Varieties
  console.log(`Seeding ${INITIAL_FLOWER_VARIETIES.length} flower varieties...`);
  const { error: varErr } = await supabase.from('custom_flower_varieties').upsert(INITIAL_FLOWER_VARIETIES, { onConflict: 'id' });
  if (varErr) {
    console.error('Error seeding flower varieties:', varErr.message);
  } else {
    console.log('✓ Flower varieties seeded successfully');
  }

  // 5. Site Content
  console.log('Seeding site content...');
  const siteContentPayload = {
    ...INITIAL_SITE_CONTENT,
    id: 'default',
  };
  const { error: contentErr } = await supabase.from('site_content').upsert(siteContentPayload, { onConflict: 'id' });
  if (contentErr) {
    console.error('Error seeding site content:', contentErr.message);
  } else {
    console.log('✓ Site content seeded successfully');
  }

  // 6. Store Settings (with Webloom@2026 password and permanent supabase config)
  console.log('Seeding store settings...');
  const settingsPayload = {
    ...INITIAL_SETTINGS,
    id: 'default',
    admin_password: 'Webloom@2026',
    supabase_url: supabaseUrl,
    supabase_anon_key: supabaseKey,
    site_logo: '/logo.png',
  };
  const { error: settingsErr } = await supabase.from('store_settings').upsert(settingsPayload, { onConflict: 'id' });
  if (settingsErr) {
    console.error('Error seeding store settings:', settingsErr.message);
  } else {
    console.log('✓ Store settings seeded successfully');
  }

  console.log('--- Seeding completed! ---');
}

seed().catch((err) => {
  console.error('Fatal seeding error:', err);
  process.exit(1);
});
