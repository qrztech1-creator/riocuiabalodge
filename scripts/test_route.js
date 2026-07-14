const http = require('http');

http.get('http://localhost:3000/pescaria-acontecendo', res => {
    let d = '';
    res.on('data', c => d += c);
    res.on('end', () => {
        console.log('Status:', res.statusCode);
        console.log('Length:', d.length);
        console.log('Has "Aqui você vai encontrar":', d.includes('Aqui você vai encontrar'));
    });
});
