const fs = require('fs');
const cheerio = require('cheerio');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const urls = [
  'https://riocuiabalodge.com.br/10-dicas-para-pescar-dourado',
  'https://riocuiabalodge.com.br/pescaria-acontecendo',
  'https://riocuiabalodge.com.br/confraternizacao',
  'https://riocuiabalodge.com.br/eventos-corporativos',
  'https://riocuiabalodge.com.br/turismo-de-experiencia'
];

async function processUrl(url) {
  console.log(`Fetching ${url}...`);
  const res = await fetch(url);
  const html = await res.text();
  const $ = cheerio.load(html);

  // Zyro puts page data in astro-island props
  let pageDataStr = null;
  $('astro-island').each((i, el) => {
    const props = $(el).attr('props');
    if (props && props.includes('pageData')) {
      pageDataStr = props;
    }
  });

  if (!pageDataStr) {
    console.log(`No page data found for ${url}`);
    return;
  }

  // The props string is a complex serialized format from Astro/Vue. 
  // It's basically a JSON array where [0, value] represents the value, or [1, array] etc.
  // We can just regex out the content from GridTextBox and images from GridImage.
  // Since we want them in visual order, maybe regex isn't perfect for sorting,
  // but it's the most robust way to extract text.
  
  const contents = [];
  
  // Extract text contents
  const textRegex = /"type":\[0,"GridTextBox"\].*?"content":\[0,"(.*?)"\]/g;
  let match;
  while ((match = textRegex.exec(pageDataStr)) !== null) {
    let content = match[1];
    // Unescape JSON string
    try {
      content = JSON.parse(`"${content}"`);
    } catch(e) {}
    contents.push(content);
  }

  // Extract images
  const imgRegex = /"type":\[0,"GridImage"\].*?"path":\[0,"(.*?)"\]/g;
  while ((match = imgRegex.exec(pageDataStr)) !== null) {
    const imgPath = match[1];
    contents.push(`<img src="/assets/${imgPath}" alt="" style="max-width: 100%; border-radius: 8px; margin: 20px 0;" />`);
  }

  // Combine content. We'll skip the header/footer text by filtering out small generic texts if needed.
  // Actually, header and footer are in the layout, so they might be included.
  // Let's filter out "CONTATO", "ENDEREÇO", "riocuiabalodge@gmail.com", "WhatsApp"
  const filteredContents = contents.filter(c => {
    const text = c.toLowerCase();
    if (text.includes('contato') && text.includes('gmail.com')) return false;
    if (text.includes('endereço') && text.includes('cuiabá')) return false;
    if (text.includes('whatsapp') && text.includes('telefone')) return false;
    return true;
  });

  const finalHtml = filteredContents.join('\\n<br/>\\n');
  
  // Update DB
  const slug = url.split('/').pop();
  
  await prisma.post.upsert({
    where: { slug },
    update: { content: finalHtml },
    create: { 
      slug, 
      title: slug.replace(/-/g, ' ').toUpperCase(),
      category: 'ARTIGO',
      content: finalHtml,
      coverImage: '/assets/inicio/asset_19.png'
    }
  });
  console.log(`Updated ${slug}`);
}

async function main() {
  for (const url of urls) {
    await processUrl(url);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
