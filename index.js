const fs = require('fs-extra');
const hash = require('object-hash');
const {JSDOM} = require('jsdom');

const defaultOptions = {
    spacing: ' '.repeat(4),
};

const replaceStylesWithClasses = (elementsWithInlineCss, options = defaultOptions) => (
    
    elementsWithInlineCss.reduce((res, el) => {

        const {cssText} = el.style;
        const formattedCssText = cssText
            .trim()
            .split(';')
            .filter(line => line)
            .map(line => `${options.spacing}${line.trim()}`)
            .sort()
            .join(';\n') + ';';

        const className = `hash-${hash(formattedCssText)}`;
        const classNameExists = (className in res);

        if (!classNameExists) {
            res[className] = formattedCssText;
        }

        el.removeAttribute('style');
        el.classList.add(className);

        return res;

    }, {})

);

const createCombinedCssText = (cssClasses, options = defaultOptions) => (

    Object.keys(cssClasses).reduce((res, className) => {
        return `${res}\n${options.spacing}.${className} {\n${cssClasses[className].split('\n').map(line =>
            `${options.spacing}${line}`).join('\n')}\n${options.spacing}}\n`
    }, '')

);

const appendStyle = (document, cssText, options = defaultOptions) => {
    
    const style = document.createElement('style');
    style.innerHTML = `\n\n${options.spacing}${cssText.trim()}\n\n`;
    document.head.appendChild(style);

};


const replaceInlineCssBase = (html, options = defaultOptions) => {

    const htmlCopy = html;
    const {window: {document}} = new JSDOM(htmlCopy);
    const mergedOptions = {...(options || {}), ...defaultOptions};

    const elementsWithInlineCss = [...document.querySelectorAll('[style]')].filter(el => el.style.cssText);
    const cssClasses = replaceStylesWithClasses(elementsWithInlineCss, mergedOptions);
    const combinedCssText = createCombinedCssText(cssClasses, mergedOptions);
    
    appendStyle(document, combinedCssText, options);

    return document.documentElement.outerHTML;

};

const replaceInlineCssIO = (inputHtmlPath, outputHtmlPath, options = defaultOptions) => {

    const inputHtmlPathExists = fs.pathExistsSync(inputHtmlPath);
    
    if (!inputHtmlPathExists) {
        return;
    }

    if (!outputHtmlPath) {
        return;
    }

    const mergedOptions = {...(options || {}), ...defaultOptions};
    const inputHtml = fs.readFileSync(inputHtmlPath, 'utf-8');
    const outputHtml = replaceInlineCssBase(inputHtml, mergedOptions);

    fs.writeFileSync(outputHtmlPath, outputHtml, 'utf-8');

};

const replaceInlineCss = (...args) => {

    if (typeof args[0] === 'string' && typeof args[1] === 'string') {
        return replaceInlineCssIO(...args)
    }

    if (typeof args[0]) {
        return replaceInlineCssBase(...args)
    }

};

module.exports = replaceInlineCss;
