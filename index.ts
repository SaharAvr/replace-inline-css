import fs from 'fs-extra';
import hash from 'object-hash';
import {JSDOM} from 'jsdom';

import {CssClasses, Options, OptionsIO, Spacing} from '.';

const defaultOptions: Options = {
    spacing: Spacing.FOUR_SPACES,
};

const replaceStylesWithClasses = ({elementsWithInlineCss, spacing = defaultOptions.spacing}:
    {elementsWithInlineCss: HTMLElement[], spacing: Spacing}): CssClasses => (
    
    elementsWithInlineCss.reduce((res: CssClasses, el: HTMLElement) => {

        const {cssText}: {cssText: string} = el.style;
        const formattedCssText: string = cssText
            .trim()
            .split(';')
            .filter(line => line)
            .map(line => `${spacing}${line.trim()}`)
            .sort()
            .join(';\n') + ';';

        const className: string = `hash-${hash(formattedCssText)}`;
        const classNameExists: boolean = (className in res);

        if (!classNameExists) {
            res[className] = formattedCssText;
        }

        el.removeAttribute('style');
        el.classList.add(className);

        return res;

    }, {})

);

const createCombinedCssText = ({cssClasses, spacing = defaultOptions.spacing}:
    {cssClasses: CssClasses, spacing: Spacing}): string => (

    Object.keys(cssClasses).reduce((res: string, className: string) => {
        return `${res}\n${spacing}.${className} {\n${cssClasses[className].split('\n').map((line: string): string =>
            `${spacing}${line}`).join('\n')}\n${spacing}}\n`
    }, '')

);

const appendStyle = ({document, cssText, spacing = defaultOptions.spacing}:
    {document: Document, cssText: string, spacing: Spacing}): void => {
    
    const style: HTMLStyleElement = document.createElement('style');
    style.innerHTML = `\n\n${spacing}${cssText.trim()}\n\n`;
    document.head.appendChild(style);

};


const replaceInlineCssBase = (html: string, options: Options = {spacing: Spacing.FOUR_SPACES}): string => {

    const htmlCopy = html;
    const {window: {document}}: {window: {document: Document}} = new JSDOM(htmlCopy);
    const finalSpacing = (options.spacing || defaultOptions.spacing);

    const elementsWithInlineCss: HTMLElement[] = [...document.querySelectorAll<HTMLElement>('[style]')].filter((el: HTMLElement): string => el.style.cssText);
    const cssClasses: CssClasses = replaceStylesWithClasses({elementsWithInlineCss, spacing: finalSpacing});
    const combinedCssText: string = createCombinedCssText({cssClasses, spacing: finalSpacing});
    
    appendStyle({document, cssText: combinedCssText, spacing: finalSpacing});

    return document.documentElement.outerHTML;

};

const replaceInlineCssIO = (optionsIO: OptionsIO = {inputHtmlPath: '', outputHtmlPath: '', spacing: Spacing.FOUR_SPACES}): void => {

    const inputHtmlPathExists = fs.pathExistsSync(optionsIO.inputHtmlPath);
    
    if (!inputHtmlPathExists) {
        return;
    }

    const inputHtml: string = fs.readFileSync(optionsIO.inputHtmlPath, 'utf-8');
    const outputHtml: string = replaceInlineCssBase(inputHtml, {spacing: (optionsIO.spacing || defaultOptions.spacing)});

    fs.writeFileSync(optionsIO.outputHtmlPath, outputHtml, 'utf-8');

};

const replaceInlineCss = (...args: ([options: OptionsIO] | [html: string, options: Options])): (void | string) => {

    if (args.length === 1) {
        return replaceInlineCssIO(...args as [OptionsIO]);
    }

    return replaceInlineCssBase(...args as [string, Options]);

};

export default replaceInlineCss;
