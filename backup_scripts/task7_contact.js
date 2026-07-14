const fs = require('fs');
const cheerio = require('cheerio');
const file = 'public/pages/contato.html';
let html = fs.readFileSync(file, 'utf8');

const $ = cheerio.load(html);

$('form').each((i, el) => {
    $(el).attr('action', 'https://api.web3forms.com/submit');
    $(el).attr('method', 'POST');
    
    // Add Web3Forms required inputs at the start of the form
    $(el).prepend(`
        <input type="hidden" name="access_key" value="SUA_CHAVE_DE_ACESSO_AQUI">
        <input type="checkbox" name="botcheck" class="hidden" style="display: none;">
        <input type="hidden" name="redirect" value="https://riocuiabalodge.com.br/contato">
        <input type="hidden" name="subject" value="Novo Contato pelo Site - Rio Cuiabá Lodge">
    `);
    
    // Web3Forms requires that inputs have 'name' attributes.
    // Zyro's inputs might not have them. Let's check.
    $(el).find('input, textarea').each((j, inputEl) => {
        if (!$(inputEl).attr('name')) {
            const id = $(inputEl).attr('id') || $(inputEl).attr('placeholder') || 'campo_' + j;
            $(inputEl).attr('name', id.replace(/[^a-zA-Z0-9]/g, '_'));
        }
    });

    // We also need to change the submit button if it has Javascript preventing default.
    // Since it's Zyro, we'll let Web3Forms handle the standard POST.
});

// Remove zyro's event listeners if they are inline, although they are probably in the JS bundle.
// A native form POST to Web3Forms will work as long as the button type is submit.
$('button[type="submit"]').removeAttr('disabled'); // Just in case

fs.writeFileSync(file, $.html());
console.log('Updated contact form in contato.html');
