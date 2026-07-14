const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const postsToSeed = [
  {
    title: '10 dicas para pescar dourado',
    slug: '10-dicas-para-pescar-dourado',
    category: 'ARTIGO',
    content: '<p>Conteúdo em breve...</p>',
    coverImage: '/assets/inicio/asset_19.png',
    status: 'PUBLISHED'
  },
  {
    title: 'Pescaria Acontecendo',
    slug: 'pescaria-acontecendo',
    category: 'EVENTO',
    content: '<p>Acompanhe nossa pescaria em tempo real.</p>',
    coverImage: '/assets/inicio/asset_23.jpeg',
    status: 'PUBLISHED'
  },
  {
    title: 'Confraternização',
    slug: 'confraternizacao',
    category: 'EVENTO',
    content: '<p>Momentos inesquecíveis.</p>',
    coverImage: '/assets/inicio/asset_25.jpeg',
    status: 'PUBLISHED'
  },
  {
    title: 'Eventos Corporativos',
    slug: 'eventos-corporativos',
    category: 'EVENTO',
    content: '<p>Realize o evento da sua empresa aqui.</p>',
    coverImage: '/assets/inicio/asset_40.jpeg',
    status: 'PUBLISHED'
  },
  {
    title: 'Turismo de Experiência',
    slug: 'turismo-de-experiencia',
    category: 'ARTIGO',
    content: '<p>Explore o Pantanal como nunca antes.</p>',
    coverImage: '/assets/inicio/asset_41.jpeg',
    status: 'PUBLISHED'
  }
];

async function main() {
  for (const post of postsToSeed) {
    await prisma.post.upsert({
      where: { slug: post.slug },
      update: {},
      create: post,
    });
  }
  console.log('Posts seeded successfully!');
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
