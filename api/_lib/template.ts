
import { readFileSync } from 'fs';
import { marked } from 'marked';
import { sanitizeHtml } from './sanitizer';
import { ParsedRequest } from './types';
const twemoji = require('twemoji');
const twOptions = { folder: 'svg', ext: '.svg' };
const emojify = (text: string) => twemoji.parse(text, twOptions);

const rglr = readFileSync(`${__dirname}/../_fonts/Termina-Regular.woff2`).toString('base64');
const bold = readFileSync(`${__dirname}/../_fonts/Termina-Bold.woff2`).toString('base64');
const mono = readFileSync(`${__dirname}/../_fonts/Vera-Mono.woff2`).toString('base64');

const bg = readFileSync(`${__dirname}/../_bgs/bg-dark.png`).toString('base64');
const logo = readFileSync(`${__dirname}/../_bgs/logo-dark.png`).toString('base64');

function getCss(theme: string, fontSize: string) {
    let bg = bg;
    let logo = logo;
    let foreground = 'white';

    return `
    @font-face {
        font-family: 'Termina';
        font-style:  normal;
        font-weight: normal;
        src: url(data:font/woff2;charset=utf-8;base64,${rglr}) format('woff2');
    }

    @font-face {
        font-family: 'Termina';
        font-style:  normal;
        font-weight: bold;
        src: url(data:font/woff2;charset=utf-8;base64,${bold}) format('woff2');
    }

    @font-face {
        font-family: 'Vera';
        font-style: normal;
        font-weight: normal;
        src: url(data:font/woff2;charset=utf-8;base64,${mono})  format("woff2");
      }

    body {
        background-image: url(data:image/png;base64,${bg});
        background-repeat: no-repeat;  
        background-position: 0% 0%;
        background-size: 100% 100%; 
        height: 100vh;
        display: flex;
    }

    code {
        color: #D400FF;
        font-family: 'Vera';
        white-space: pre-wrap;
        letter-spacing: -5px;
    }

    code:before, code:after {
        content: '\`';
    }

    .logo {
        background-image: url(data:image/png;base64,${logo});
        width: 427px;
        height: 120px;
        background-repeat: no-repeat;  
        background-position: 0% 0%;
        background-size: 100% 100%; 
        position: absolute;
        bottom: 90px;
        right: 90px;
    }
    
    .heading {
        font-family: 'Termina', sans-serif;
        font-size: ${sanitizeHtml(fontSize)};
        font-style: normal;
        color: ${foreground};
        line-height: 1.2;
        padding-left:90px;
        max-width: 90%
    }`;
}

export function getHtml(parsedReq: ParsedRequest) {
    const { text, theme, md, fontSize/* , images, widths, heights */ } = parsedReq;


    return `<!DOCTYPE html>
<html>
    <meta charset="utf-8">
    <title>Generated Image</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        ${getCss(theme, fontSize)}
    </style>
    <body>
        <div>
            <div class="heading">${emojify(
                md ? marked(text) : sanitizeHtml(text)
            )}
            </div>
        </div>
        <div class="logo-wrapper">
           <div class="logo"></div>
        <div>
    </body>
</html>`;
}
