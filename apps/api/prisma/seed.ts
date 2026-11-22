/* eslint-disable no-console */
/**
 * Seed — idempotent (safe to re-run).
 * Core content (roles, catalog, platform services) runs everywhere; demo accounts
 * (reserved domain demo.unihub.local) are created only outside production.
 */
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { randomBytes } from 'node:crypto';
import { PERMISSIONS, ROLE_DEFINITIONS } from '../src/modules/rbac/permissions';
import { ACADEMIC_LEVELS, CATEGORIES, RESOURCE_CATEGORIES, UNIVERSITIES } from './data/catalog';
import { DETAILS } from './data/service-details';
import { ORDER_FAQ, TEMPLATES } from './data/service-templates';

const prisma = new PrismaClient();

async function seedRbac() {
  for (const [key, description] of Object.entries(PERMISSIONS)) {
    await prisma.permission.upsert({
      where: { key },
      update: { description, group: key.split('.')[0] },
      create: { key, description, group: key.split('.')[0] },
    });
  }
  const perms = await prisma.permission.findMany();
  const permId = new Map(perms.map((p) => [p.key, p.id]));

  for (const [key, def] of Object.entries(ROLE_DEFINITIONS)) {
    const role = await prisma.role.upsert({
      where: { key },
      update: { name: def.name, description: def.description, isSystem: true },
      create: { key, name: def.name, description: def.description, isSystem: true },
    });
    // System roles are reset to their canonical permissions on every seed.
    await prisma.rolePermission.deleteMany({ where: { roleId: role.id } });
    await prisma.rolePermission.createMany({
      data: def.permissions.map((p) => ({ roleId: role.id, permissionId: permId.get(p)! })),
    });
  }
  console.log(`✔ ${perms.length} permissions, ${Object.keys(ROLE_DEFINITIONS).length} roles`);
}

async function seedReference() {
  for (const l of ACADEMIC_LEVELS) {
    await prisma.academicLevel.upsert({
      where: { key: l.key },
      update: { nameEn: l.en, nameAr: l.ar, sortOrder: l.sortOrder },
      create: { key: l.key, nameEn: l.en, nameAr: l.ar, sortOrder: l.sortOrder },
    });
  }
  // Levels removed from the data file (e.g. Master's, PhD) are deleted; profiles referencing them are set to null.
  await prisma.academicLevel.deleteMany({ where: { key: { notIn: ACADEMIC_LEVELS.map((l) => l.key) } } });
  for (const u of UNIVERSITIES) {
    await prisma.university.upsert({
      where: { nameEn_country: { nameEn: u.en, country: 'JO' } },
      update: { nameAr: u.ar, city: u.city },
      create: { nameEn: u.en, nameAr: u.ar, city: u.city, country: 'JO' },
    });
  }
  console.log(`✔ ${ACADEMIC_LEVELS.length} academic levels, ${UNIVERSITIES.length} universities`);
}

async function seedCatalog() {
  let subs = 0;
  for (const [i, c] of CATEGORIES.entries()) {
    const cat = await prisma.category.upsert({
      where: { slug: c.slug },
      update: { nameEn: c.en, nameAr: c.ar, descriptionEn: c.descEn, descriptionAr: c.descAr, icon: c.icon, color: c.color, sortOrder: i },
      create: { slug: c.slug, nameEn: c.en, nameAr: c.ar, descriptionEn: c.descEn, descriptionAr: c.descAr, icon: c.icon, color: c.color, sortOrder: i },
    });
    for (const [j, sc] of c.subs.entries()) {
      await prisma.subcategory.upsert({
        where: { categoryId_slug: { categoryId: cat.id, slug: sc.slug } },
        update: { nameEn: sc.en, nameAr: sc.ar, sortOrder: j },
        create: { categoryId: cat.id, slug: sc.slug, nameEn: sc.en, nameAr: sc.ar, sortOrder: j },
      });
      subs++;
    }
  }
  for (const [i, rc] of RESOURCE_CATEGORIES.entries()) {
    await prisma.resourceCategory.upsert({
      where: { slug: rc.slug },
      update: { nameEn: rc.en, nameAr: rc.ar, icon: rc.icon, sortOrder: i },
      create: { slug: rc.slug, nameEn: rc.en, nameAr: rc.ar, icon: rc.icon, sortOrder: i },
    });
  }
  console.log(`✔ ${CATEGORIES.length} categories, ${subs} subcategories, ${RESOURCE_CATEGORIES.length} resource categories`);
}

async function seedSettings() {
  const defaults: Record<string, unknown> = {
    'commission.rate': 0.15,
    'orders.autoCompleteDays': 7,
    'requests.requireModeration': false,
    'platform.currency': 'JOD',
    'platform.supportEmail': 'support@unihub.local',
    // WhatsApp number (international format, digits only, e.g. 9627XXXXXXXX). Empty = not configured yet.
    'contact.whatsapp': process.env.SEED_WHATSAPP_NUMBER ?? '',
  };
  for (const [key, value] of Object.entries(defaults)) {
    await prisma.systemSetting.upsert({ where: { key }, update: {}, create: { key, value: value as never } });
  }
  console.log(`✔ ${Object.keys(defaults).length} system settings (existing values preserved)`);
}

async function seedDemoAccounts() {
  const password = process.env.SEED_DEMO_PASSWORD ?? 'UniHub2026!';
  const passwordHash = await bcrypt.hash(password, 12);
  const roles = new Map((await prisma.role.findMany()).map((r) => [r.key, r.id]));
  const bachelor = await prisma.academicLevel.findUnique({ where: { key: 'BACHELOR' } });
  const uj = await prisma.university.findFirst({ where: { nameEn: 'The University of Jordan' } });

  const accounts = [
    { email: 'admin@demo.unihub.local', fullName: 'Demo Super Admin', role: 'SUPER_ADMIN' },
    { email: 'moderator@demo.unihub.local', fullName: 'Demo Moderator', role: 'MODERATOR' },
    { email: 'finance@demo.unihub.local', fullName: 'Demo Finance', role: 'FINANCE' },
    { email: 'student@demo.unihub.local', fullName: 'Lina Haddad (Demo)', role: 'STUDENT' },
    { email: 'student2@demo.unihub.local', fullName: 'Omar Khalil (Demo)', role: 'STUDENT' },
    { email: 'provider@demo.unihub.local', fullName: 'Sara Mansour (Demo)', role: 'PROVIDER' },
    { email: 'provider2@demo.unihub.local', fullName: 'Yazan Saleh (Demo)', role: 'PROVIDER' },
  ];

  for (const a of accounts) {
    const user = await prisma.user.upsert({
      where: { email: a.email },
      update: {},
      create: {
        email: a.email,
        fullName: a.fullName,
        passwordHash,
        emailVerified: true,
        roles: { create: { roleId: roles.get(a.role)! } },
        profile: {
          create: a.role === 'STUDENT'
            ? { universityId: uj?.id, academicLevelId: bachelor?.id, major: 'Computer Science', graduationYear: 2027, preferredLocale: 'en' }
            : { preferredLocale: 'en' },
        },
      },
    });
    if (a.role === 'PROVIDER') {
      await prisma.providerProfile.upsert({
        where: { userId: user.id },
        update: {},
        create: {
          userId: user.id,
          slug: a.email.startsWith('provider2') ? 'yazan-saleh-demo' : 'sara-mansour-demo',
          title: a.email.startsWith('provider2') ? 'Data Scientist & Statistics Tutor' : 'Full-Stack Developer & AI Engineer',
          bio: 'Demo provider account used for local development and testing.',
          yearsExperience: a.email.startsWith('provider2') ? 4 : 6,
          languages: ['Arabic', 'English'],
          verificationStatus: 'VERIFIED',
          verifiedAt: new Date(),
        },
      });
    }
  }
  console.log(`✔ ${accounts.length} demo accounts (password: ${process.env.SEED_DEMO_PASSWORD ? '$SEED_DEMO_PASSWORD' : password})`);
}

/**
 * Core service catalog owned by the official "Naajah Academic Team" provider account.
 * This is real platform content (not demo data). Text content is re-synced from the data files on
 * every run; prices and packages are set only on creation so later admin price edits are preserved.
 * Services removed from the data files are retired (deleted) together with their empty subcategory.
 */
async function seedPlatformCatalog() {
  const providerRole = await prisma.role.findUniqueOrThrow({ where: { key: 'PROVIDER' } });
  // The team account cannot log in: its password hash is random and never shared.
  const team = await prisma.user.upsert({
    where: { email: 'academic-team@unihub.platform' },
    update: {},
    create: {
      email: 'academic-team@unihub.platform',
      fullName: 'Naajah Academic Team',
      passwordHash: await bcrypt.hash(randomBytes(32).toString('hex'), 12),
      emailVerified: true,
      roles: { create: { roleId: providerRole.id } },
      profile: { create: { preferredLocale: 'en' } },
    },
  });
  const teamText = {
    displayNameAr: 'فريق نجاح الأكاديمي',
    titleAr: 'فريق نجاح الرسمي من المطورين وعلماء البيانات والباحثين والمدرسين',
    bioAr: 'فريق نجاح الأكاديمي مجموعة مختارة من مهندسي البرمجيات وعلماء البيانات والباحثين ومدرسي الجامعات. نقدّم خدمات نجاح الأساسية مع التركيز على الجودة والشرح الواضح والنزاهة الأكاديمية.',
  };
  const provider = await prisma.providerProfile.upsert({
    where: { userId: team.id },
    update: teamText,
    create: {
      userId: team.id,
      slug: 'unihub-academic-team',
      ...teamText,
      title: 'Official Naajah team of developers, data scientists, researchers and tutors',
      bio: 'The Naajah Academic Team is a vetted group of software engineers, data scientists, researchers and university tutors. We deliver core Naajah services with a focus on quality, clear explanations and academic integrity.',
      yearsExperience: 10,
      languages: ['Arabic', 'English'],
      verificationStatus: 'VERIFIED',
      verifiedAt: new Date(),
    },
  });

  const featured = new Set([
    'programming-python', 'artificial-intelligence-machine-learning', 'data-science-power-bi',
    'database-erd', 'research-methodology', 'graduation-projects-planning',
  ]);
  let created = 0;
  let synced = 0;
  const keep = new Set<string>();
  for (const cat of CATEGORIES) {
    const tpl = TEMPLATES[cat.slug];
    const details = DETAILS[cat.slug];
    if (!tpl || !details) throw new Error(`Missing service template/details for category ${cat.slug}`);
    const category = await prisma.category.findUniqueOrThrow({ where: { slug: cat.slug } });
    // Every service explains how to order via WhatsApp (no online payments).
    const faq = tpl.faq.some((f) => f.qEn === ORDER_FAQ.qEn) ? tpl.faq : [...tpl.faq, ORDER_FAQ];

    for (const sub of cat.subs) {
      const d = details[sub.slug];
      if (!d) throw new Error(`Missing service details for ${cat.slug}/${sub.slug}`);
      const slug = `${cat.slug}-${sub.slug}`;
      keep.add(slug);
      const subcategory = await prisma.subcategory.findUniqueOrThrow({
        where: { categoryId_slug: { categoryId: category.id, slug: sub.slug } },
      });
      const [summaryEn, summaryAr, technologies] = d;
      const fill = (s: string, name: string) => s.replace(/\{name\}/g, name);
      const content = {
        titleEn: sub.en,
        titleAr: sub.ar,
        summaryEn,
        summaryAr,
        overviewEn: `${summaryEn} ${fill(tpl.overviewEn, sub.en)}`,
        overviewAr: `${summaryAr} ${fill(tpl.overviewAr, sub.ar)}`,
        includedEn: tpl.includedEn,
        includedAr: tpl.includedAr,
        featuresEn: tpl.featuresEn,
        featuresAr: tpl.featuresAr,
        requirementsEn: tpl.requirementsEn,
        requirementsAr: tpl.requirementsAr,
        deliverablesEn: tpl.deliverablesEn,
        deliverablesAr: tpl.deliverablesAr,
        technologies,
        faq: faq as never,
      };

      const existing = await prisma.service.findUnique({ where: { slug } });
      if (existing) {
        await prisma.service.update({ where: { id: existing.id }, data: content });
        synced++;
        continue;
      }
      await prisma.service.create({
        data: {
          slug,
          providerId: provider.id,
          categoryId: category.id,
          subcategoryId: subcategory.id,
          ...content,
          startingPrice: tpl.prices[0],
          deliveryDays: tpl.days[0],
          status: 'PUBLISHED',
          publishedAt: new Date(),
          isFeatured: featured.has(slug),
          packages: {
            create: (['BASIC', 'STANDARD', 'PREMIUM'] as const).map((tier, i) => ({
              tier,
              nameEn: tpl.packages[i].nameEn,
              nameAr: tpl.packages[i].nameAr,
              descriptionEn: tpl.packages[i].descEn,
              descriptionAr: tpl.packages[i].descAr,
              price: tpl.prices[i],
              deliveryDays: tpl.days[i],
              revisions: tpl.revisions[i],
              featuresEn: tpl.packages[i].featuresEn,
              featuresAr: tpl.packages[i].featuresAr,
            })),
          },
        },
      });
      created++;
    }
  }

  // Retire platform services (and their now-empty subcategories) that were removed from the data files.
  const retired = await prisma.service.findMany({
    where: { providerId: provider.id, slug: { notIn: [...keep] } },
    select: { id: true, slug: true, subcategoryId: true },
  });
  for (const r of retired) {
    await prisma.service.delete({ where: { id: r.id } });
    if (r.subcategoryId && (await prisma.service.count({ where: { subcategoryId: r.subcategoryId } })) === 0) {
      await prisma.subcategory.delete({ where: { id: r.subcategoryId } });
    }
  }
  const total = await prisma.service.count({ where: { providerId: provider.id } });
  console.log(
    `✔ Platform catalog: ${created} created, ${synced} synced, ${retired.length} retired` +
      `${retired.length ? ` (${retired.map((r) => r.slug).join(', ')})` : ''} — ${total} total, owned by Naajah Academic Team)`,
  );
}

/** Categories removed from the data files are deleted (or deactivated if other providers still use them). */
async function retireRemovedCategories() {
  const stale = await prisma.category.findMany({
    where: { slug: { notIn: CATEGORIES.map((c) => c.slug) } },
    include: { _count: { select: { services: true, requests: true } } },
  });
  for (const c of stale) {
    if (c._count.services === 0 && c._count.requests === 0) await prisma.category.delete({ where: { id: c.id } });
    else await prisma.category.update({ where: { id: c.id }, data: { isActive: false } });
  }
  if (stale.length) console.log(`✔ Retired categories: ${stale.map((c) => c.slug).join(', ')}`);
}

/**
 * Real owner admin account (works in production too), from SEED_ADMIN_EMAIL + SEED_ADMIN_PASSWORD.
 * Created once; on later runs the password is left alone (so it can be changed later) and the
 * account just keeps its Super Admin role. Set SEED_ADMIN_RESET_PASSWORD=true to force the env password.
 */
async function seedOwnerAdmin() {
  const email = process.env.SEED_ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD;
  if (!email || !password) return;
  if (password.length < 10) {
    console.warn('⚠ SEED_ADMIN_PASSWORD must be at least 10 characters: owner admin not created.');
    return;
  }
  const role = await prisma.role.findUniqueOrThrow({ where: { key: 'SUPER_ADMIN' } });
  const passwordHash = await bcrypt.hash(password, 12);
  const existing = await prisma.user.findUnique({ where: { email } });
  const user = existing
    ? process.env.SEED_ADMIN_RESET_PASSWORD === 'true'
      ? await prisma.user.update({ where: { id: existing.id }, data: { passwordHash, status: 'ACTIVE' } })
      : existing
    : await prisma.user.create({
        data: { email, fullName: 'Naajah Admin', passwordHash, emailVerified: true, profile: { create: { preferredLocale: 'ar' } } },
      });
  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: user.id, roleId: role.id } },
    update: {},
    create: { userId: user.id, roleId: role.id },
  });
  console.log(`✔ Owner admin account ready (${existing ? 'existing' : 'created'})`);
}

async function main() {
  // Core platform content — safe to run in every environment.
  await seedRbac();
  await seedReference();
  await seedCatalog();
  await seedSettings();
  await seedPlatformCatalog();
  await retireRemovedCategories();
  await seedOwnerAdmin();

  // Demo accounts — development only.
  if (process.env.NODE_ENV === 'production') {
    console.log('ℹ Production: skipping demo accounts.');
    return;
  }
  await seedDemoAccounts();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
