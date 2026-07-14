const fs = require('fs');
const file = 'public/pages/post.html';
let html = fs.readFileSync(file, 'utf8');

const script = `
<script>
document.addEventListener('DOMContentLoaded', () => {
    const wrapper = document.querySelector('.blog-content-wrapper');
    if (!wrapper) return;

    // Achar imagens dentro do conteúdo
    const images = Array.from(wrapper.querySelectorAll('img'));
    
    // Agrupar imagens consecutivas
    let groups = [];
    let currentGroup = [];
    
    images.forEach(img => {
        // Quill normalmente coloca imagens dentro de <p>.
        // Vamos verificar se a imagem atual é a próxima estruturalmente do grupo.
        const parent = img.closest('p') || img.parentElement;
        
        if (currentGroup.length === 0) {
            currentGroup.push({ img, parent });
        } else {
            const last = currentGroup[currentGroup.length - 1];
            // Se estão no mesmo parágrafo
            if (parent === last.parent) {
                currentGroup.push({ img, parent });
            } else {
                // Se estão em parágrafos adjacentes sem texto no meio
                let isAdjacent = false;
                let nextSibling = last.parent.nextElementSibling;
                while (nextSibling && nextSibling.nodeName === 'BR') {
                    nextSibling = nextSibling.nextElementSibling;
                }
                
                if (nextSibling === parent && parent.textContent.trim() === '') {
                    isAdjacent = true;
                }
                
                if (isAdjacent) {
                    currentGroup.push({ img, parent });
                } else {
                    groups.push(currentGroup);
                    currentGroup = [{ img, parent }];
                }
            }
        }
    });
    
    if (currentGroup.length > 0) groups.push(currentGroup);
    
    groups.forEach(group => {
        if (group.length > 1) {
            const grid = document.createElement('div');
            grid.className = 'blog-image-gallery';
            
            // Inserir a grid antes do primeiro parágrafo
            const firstParent = group[0].parent;
            firstParent.parentNode.insertBefore(grid, firstParent);
            
            group.forEach(item => {
                grid.appendChild(item.img);
                // Remover parágrafo antigo se ficar vazio
                if (item.parent.textContent.trim() === '' && item.parent.querySelectorAll('img').length === 0) {
                    item.parent.remove();
                }
            });
        }
    });
});
</script>
<style>
.blog-image-gallery {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 16px;
    margin: 2rem 0;
    align-items: center;
}
.blog-image-gallery img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 8px;
    margin: 0 !important;
    aspect-ratio: 4/3;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    transition: transform 0.3s ease;
}
.blog-image-gallery img:hover {
    transform: scale(1.02);
}
</style>
`;

if (!html.includes('blog-image-gallery')) {
    html = html.replace('</body>', script + '\n</body>');
    fs.writeFileSync(file, html);
    console.log('Gallery script injected into post.html');
} else {
    console.log('Gallery script already exists');
}
