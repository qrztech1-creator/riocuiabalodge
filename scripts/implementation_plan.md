# Goal

Baixar todas as imagens hospedadas nos servidores da Zyro (`assets.zyrosite.com`) e salvá-las localmente na pasta `public/assets/` do projeto, alterando todas as referências no código para usar os caminhos locais. O objetivo é tornar o site 100% independente do servidor oficial para imagens, mantendo os vídeos no servidor de origem conforme solicitado.

## User Review Required

Nenhuma alteração estrutural no layout ocorrerá, será apenas uma migração de links. Todas as imagens passarão a carregar da sua própria hospedagem (Vercel) em vez do servidor da Zyro. Isso aumentará um pouco o tamanho final do seu projeto, mas garantirá a independência total. Por favor, confirme se podemos prosseguir com o plano.

## Proposed Changes

### 1. Script de Migração
Criarei um script temporário em Node.js (`migrate_assets.js`) que fará o seguinte:
- Escaneará todos os arquivos `.html` dentro de `public/pages/`.
- Extrairá todos os links que começam com `https://assets.zyrosite.com/`.
- Filtrará e removerá links de vídeos (como `.mp4`, `.webm`, `.mov`).
- Fará o download automático de cada imagem (em todas as suas variações de resolução) para a pasta `public/assets/`.
- Substituirá os links antigos no HTML pelos novos caminhos locais de forma inteligente (respeitando o layout e os metadados JSON do site).

### 2. Execução
Rodarei o script para efetivar a mudança em massa de uma só vez, garantindo que não falte nenhuma imagem.

### 3. Limpeza
Deletarei o script após a execução.

## Verification Plan

Após rodar o script, iniciarei o servidor localmente e verificarei os logs de erro. Também checaremos se nenhuma página ficou "quebrada" por causa de links mal formatados.
