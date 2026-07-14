const sqlite3 = require('sqlite3').verbose();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const db = new sqlite3.Database('prisma/dev.db', (err) => {
  if (err) {
    console.error('Error opening db:', err.message);
  }
});

db.serialize(() => {
  db.all('SELECT * FROM Post', async (err, rows) => {
    if (err) {
      console.error(err.message);
      return;
    }
    
    for (const row of rows) {
      // Prisma expects a Date object for createdAt/updatedAt if we insert them, 
      // but they might be stored as timestamps or strings in SQLite.
      // Easiest is to let Postgres generate them, or pass new Date(row.createdAt).
      const data = {
        id: row.id,
        title: row.title,
        slug: row.slug,
        category: row.category,
        content: row.content,
        coverImage: row.coverImage,
        thumbnailImage: row.thumbnailImage,
        readTime: row.readTime,
        status: row.status,
      };
      
      try {
        await prisma.post.upsert({
          where: { id: row.id },
          update: data,
          create: data,
        });
        console.log('Migrated post:', row.slug);
      } catch (e) {
        console.error('Failed to migrate post:', row.slug, e);
      }
    }
    
    console.log('Migration complete');
    await prisma.$disconnect();
  });
});
