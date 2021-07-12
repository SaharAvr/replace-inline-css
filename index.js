const fs = require('fs-extra');
const hash = require('object-hash');
const {JSDOM} = require('jsdom');

const spacingType = {
    NONE: '',
    TWO_SPACES: '  ',
    FOUR_SPACES: '    ',
};

const defaultOptions = {
    SPACING: spacingType.FOUR_SPACES
};

const replaceStylesWithClasses = ({elementsWithInlineCss, spacing = defaultOptions.SPACING}) => (
    
    elementsWithInlineCss.reduce((res, el) => {

        const {cssText} = el.style;
        const formattedCssText = cssText
            .trim()
            .split(';')
            .filter(line => line)
            .map(line => `${spacing}${line.trim()}`)
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

const createCombinedCssText = ({cssClasses, spacing = defaultOptions.SPACING}) => (

    Object.keys(cssClasses).reduce((res, className) => {
        return `${res}\n${spacing}.${className} {\n${cssClasses[className].split('\n').map(line =>
            `${spacing}${line}`).join('\n')}\n${spacing}}\n`
    }, '')

);

const appendStyle = ({document, cssText, spacing = defaultOptions.SPACING}) => {
    
    const style = document.createElement('style');
    style.innerHTML = `\n\n${spacing}${cssText.trim()}\n\n`;
    document.head.appendChild(style);

};


const replaceInlineCss = ({inputHtmlPath, outputHtmlPath, spacing = defaultOptions.SPACING}) => {

    const html = fs.readFileSync(inputHtmlPath, 'utf-8');
    const {window: {document}} = new JSDOM(html);
    const finalSpacing = (spacing || defaultOptions.SPACING);

    const elementsWithInlineCss = [...document.querySelectorAll('[style]')].filter(({style}) => style.cssText);
    const cssClasses = replaceStylesWithClasses({elementsWithInlineCss, spacing: finalSpacing});
    const combinedCssText = createCombinedCssText({cssClasses, spacing: finalSpacing});
    
    appendStyle({document, cssText: combinedCssText, spacing: finalSpacing});
    fs.writeFileSync(outputHtmlPath, document.documentElement.outerHTML, 'utf-8');

};

module.exports = replaceInlineCss;
