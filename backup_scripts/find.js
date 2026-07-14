const fs = require('fs');
const lines = fs.readFileSync('public/pages/inicio_pretty.html', 'utf8').split('\n');

const queries = [
  'Reserve agora sua hospedagem',
  'Tudo isso, com uma equipe',
  'Onde estamos',
  'bird watching',
  'blog',
  'Garanta seu lugar na melhor pousada',
  '<video',
  'Quando é a melhor época do ano',
  'perguntas',
  'Instagram'
];

for (let i = 0; i < lines.length; i++) {
  const l = lines[i];
  for (const q of queries) {
    if (l.toLowerCase().includes(q.toLowerCase())) {
      console.log(`${i+1} [${q}]: ${l.trim().substring(0, 100)}`);
    }
  }
}
