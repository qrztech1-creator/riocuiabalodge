const fs = require('fs');

const html = fs.readFileSync('public/pages/post.html', 'utf8');

const startMarker = '</div><div class="page__blocks"><!--[-->';
const endMarker = '<section id="zdS1_7"';

const startIndex = html.indexOf(startMarker);
const endIndex = html.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
    console.log("Could not find markers!");
    process.exit(1);
}

const headStyles = `
<style>
.post-content-container {
    max-width: 800px;
    margin: 0 auto;
    font-family: 'DM Sans', sans-serif;
    font-size: 18px;
    line-height: 1.8;
    color: #1a1a1a;
    padding: 0;
}
.post-content-container p {
    margin-bottom: 1.5em;
}
.post-content-container img {
    max-width: 100%;
    height: auto;
    border-radius: 12px;
    margin: 32px auto;
    display: block;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
.post-content-container iframe, .post-content-container video {
    max-width: 100%;
    border-radius: 12px;
    margin: 32px auto;
    display: block;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
.post-content-container h1, 
.post-content-container h2, 
.post-content-container h3, 
.post-content-container h4 {
    font-family: 'Oswald', sans-serif;
    font-weight: 700;
    color: #111;
    margin-top: 2em;
    margin-bottom: 0.75em;
    line-height: 1.3;
}
.post-content-container h1 { font-size: 36px; }
.post-content-container h2 { font-size: 30px; }
.post-content-container h3 { font-size: 24px; }
.post-content-container a {
    color: #bf8a17;
    text-decoration: underline;
    font-weight: 500;
}
.post-content-container a:hover {
    color: #a37411;
}
.post-content-container strong {
    font-weight: 700;
    color: #000;
}
.post-content-container ul, .post-content-container ol {
    margin-bottom: 1.5em;
    padding-left: 1.5em;
}
.post-content-container li {
    margin-bottom: 0.5em;
}
.post-content-container .ql-align-center { text-align: center; }
.post-content-container .ql-align-right { text-align: right; }
.post-content-container .ql-align-justify { text-align: justify; }
.post-content-container blockquote {
    border-left: 4px solid #bf8a17;
    padding-left: 20px;
    margin-left: 0;
    margin-right: 0;
    font-style: italic;
    color: #555;
    background-color: #fcfaf5;
    padding: 20px;
    border-radius: 0 8px 8px 0;
}
</style>
</head>`;

const newMiddle = `</div><div class="page__blocks"><!--[-->
<section style="position: relative; width: 100%; min-height: 450px; display: flex; flex-direction: column; align-items: center; justify-content: center; overflow: hidden; padding: 60px 20px; text-align: center; background-color: #1a1a1a;">
  <img class="block-background__image" src="{{COVER_IMAGE}}" style="object-fit: cover; width: 100%; height: 100%; position: absolute; top: 0; left: 0; z-index: 0;">
  <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.65); z-index: 1;"></div>
  
  <div style="position: relative; z-index: 2; max-width: 900px; margin: 0 auto; width: 100%;">
    <h1 style="font-family: 'Oswald', sans-serif; font-size: 56px; font-weight: 700; color: #ffffff; line-height: 1.2; margin-bottom: 24px; text-transform: uppercase;">{{TITLE}}</h1>
    <div style="font-family: 'DM Sans', sans-serif; font-size: 16px; font-weight: 500; color: #e5e7eb; text-transform: uppercase; letter-spacing: 0.1em; display: flex; align-items: center; justify-content: center; gap: 16px;">
      <span>{{DATE}}</span>
      <span style="color: #bf8a17;">•</span>
      <span>{{READ_TIME}} MIN LEITURA</span>
    </div>
  </div>
</section>

<section style="background-color: #ffffff; padding: 80px 20px;">
  <div class="post-content-container">
    {{CONTENT}}
  </div>
</section>
`;

let finalHtml = html.substring(0, startIndex) + newMiddle + html.substring(endIndex);

// Inject the style block before </head>
if (finalHtml.includes('</head>')) {
    finalHtml = finalHtml.replace('</head>', headStyles);
}

fs.writeFileSync('public/pages/post.html', finalHtml, 'utf8');
console.log("Success");
