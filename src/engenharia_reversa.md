# Engenharia Reversa: Extração e Integração (Zyro para Next.js)

Para que o site funcionasse em um único projeto (juntando as páginas soltas que haviam sido baixadas) mantendo a aparência 100% fiel ao original, sem perder o painel CMS moderno, utilizei as seguintes etapas de engenharia reversa:

## 1. Mapeamento da Estrutura (Construtor Original)
A primeira coisa que fiz foi analisar o código-fonte das pastas `clone_`. Descobri que o site original foi feito no **Zyro (Hostinger)**. Construtores como esse são conhecidos por:
- Gerar muito código HTML sujo.
- Utilizar scripts agressivos no final da página (que forçam a navegação estilo *Single Page Application* interna deles).
- Quebrar links de imagens caso sejam movidas, já que usam caminhos relativos embutidos diretamente no JavaScript e no CSS (ex: atributos confusos como `srcset="assets/asset_19.png"`).

## 2. A Estratégia de "Abraço" (Next.js Híbrido)
Se fôssemos recriar todas as páginas do zero no React, levaria semanas para deixar exatamente com o mesmo visual, pois as regras de CSS da Zyro (`.block-layout`, `--7708d8d2`, etc) são ofuscadas e cheias de variáveis customizadas. A engenharia reversa adotada foi a de **Hospedagem Estática Híbrida**.

Isso significa que as páginas antigas continuam sendo HTML puro intocado, mas são servidas pelo núcleo poderoso do **Next.js**, permitindo que rotas dinâmicas como a `/admin` existam lado a lado com as páginas do site!

## 3. Script de Automatição (`rebuild.js`)
Para fundir tudo, criei um "compilador próprio", o script `rebuild.js`. Ele faz a mágica acontecer em 4 fases:

### Fase A: Coleta de Assets
O script percorre cada uma das pastas do clone (ex: `clone_home`, `clone_pousada`) e puxa todas as imagens, ícones e arquivos do diretório interno `assets/`. Ele então move todos eles para uma pasta global pública e padronizada (`web/public/assets/[nome_da_pagina]`).

### Fase B: Limpeza e Neutralização do HTML
- **Expurgo de Scripts:** O script encontra a tag `<script>` gigantesca do construtor no final do arquivo e **a deleta sumariamente**. Isso mata qualquer chance do Zyro tentar assumir o controle dos botões e links quando o usuário clica na tela.
- **Normalização de Links:** Transformamos URLs relativas (ex: `href="contato.html"`) em links amigáveis reais (ex: `href="/contato"`).
- **Conserto das Imagens:** Através de *Expressões Regulares (Regex)* complexas, o script varre o HTML e o CSS procurando caminhos quebrados (`"assets/..."`) e reescreve forçando o caminho público absoluto do Next.js.

### Fase C: Injeções Dinâmicas (O "Parasita Benigno")
Com o HTML limpo e as imagens no lugar, usamos engenharia reversa no cabeçalho (*header*):
- Analisamos a Grade (Grid CSS) do layout original.
- Injetamos um estilo customizado (`<style>`) forçando o Grid a ter 4 colunas em vez de 3.
- Inserimos nosso botão **ADMIN** diretamente no HTML.
- Inserimos o script do **Menu Fixo**.
- Inserimos o **Injector do CMS**: Um pequeno script JS nativo que faz uma requisição invisível para nossa API `/api/posts`, esconde as divs das notícias velhas engessadas e injeta dinamicamente os cartões das postagens novas lidas direto do Banco de Dados.

### Fase D: Proxy do Next.js
Por fim, no Next.js (em `next.config.js`), criei uma regra de *Rewrites*. Sempre que um usuário tenta acessar `riocuiabalodge.com.br/contato`, o Next.js intercepta e devolve sorrateiramente o HTML estático que o nosso script `rebuild.js` processou, enganando o navegador.

> [!NOTE]
> **Por que isso é poderoso?**  
> Porque no futuro, se você editar uma página visualmente no construtor antigo e quiser subir para cá, basta jogar os arquivos `.html` novos nas pastas do clone e rodar o `node rebuild.js`. Ele faz todo o processo de limpeza e injeção do CMS sozinho!
