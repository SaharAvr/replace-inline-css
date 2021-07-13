import fs from 'fs-extra';
import hash from 'object-hash';
import {JSDOM} from 'jsdom';

import {
    CssClasses, BaseOptions, ReplaceInlineCssBaseAgs,
    ReplaceInlineCssIoAgs, Spacing,
} from '.';

const defaultOptions: BaseOptions = {
    spacing: Spacing.FOUR_SPACES,
};

const replaceStylesWithClasses = (elementsWithInlineCss: HTMLElement[], options: BaseOptions = {spacing: defaultOptions.spacing}): CssClasses => (
    
    elementsWithInlineCss.reduce((res: CssClasses, el: HTMLElement) => {

        const {cssText}: {cssText: string} = el.style;
        const formattedCssText: string = cssText
            .trim()
            .split(';')
            .filter(line => line)
            .map(line => `${options.spacing}${line.trim()}`)
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

const createCombinedCssText = (cssClasses: CssClasses, options: BaseOptions = {spacing: defaultOptions.spacing}): string => (

    Object.keys(cssClasses).reduce((res: string, className: string) => {
        return `${res}\n${options.spacing}.${className} {\n${cssClasses[className].split('\n').map((line: string): string =>
            `${options.spacing}${line}`).join('\n')}\n${options.spacing}}\n`
    }, '')

);

const appendStyle = (document: Document, cssText: string, options: BaseOptions = {spacing: defaultOptions.spacing}): void => {
    
    const style: HTMLStyleElement = document.createElement('style');
    style.innerHTML = `\n\n${options.spacing}${cssText.trim()}\n\n`;
    document.head.appendChild(style);

};


const replaceInlineCssBase = (html: string, options: BaseOptions = {spacing: Spacing.FOUR_SPACES}): string => {

    const htmlCopy = html;
    const {window: {document}}: {window: {document: Document}} = new JSDOM(htmlCopy);
    const finalSpacing = (options.spacing || defaultOptions.spacing);

    const elementsWithInlineCss: HTMLElement[] = [...document.querySelectorAll<HTMLElement>('[style]')].filter((el: HTMLElement): string => el.style.cssText);
    const cssClasses: CssClasses = replaceStylesWithClasses(elementsWithInlineCss, {spacing: finalSpacing});
    const combinedCssText: string = createCombinedCssText(cssClasses, {spacing: finalSpacing});
    
    appendStyle(document, combinedCssText, {spacing: finalSpacing});

    return document.documentElement.outerHTML;

};

const replaceInlineCssIO = (inputHtmlPath: string, outputHtmlPath: string, options: BaseOptions = {spacing: Spacing.FOUR_SPACES}): void => {

    const inputHtmlPathExists = fs.pathExistsSync(inputHtmlPath);
    
    if (!inputHtmlPathExists) {
        return;
    }

    if (!outputHtmlPath) {
        return;
    }

    const inputHtml: string = fs.readFileSync(inputHtmlPath, 'utf-8');
    const outputHtml: string = replaceInlineCssBase(inputHtml, {spacing: (options.spacing || defaultOptions.spacing)});

    fs.writeFileSync(outputHtmlPath, outputHtml, 'utf-8');

};

const replaceInlineCss = (...args: (ReplaceInlineCssIoAgs | ReplaceInlineCssBaseAgs)): (void | string) => {

    if (args as ReplaceInlineCssBaseAgs) {
        return replaceInlineCssBase(...args as ReplaceInlineCssBaseAgs)
    }

    if (args as ReplaceInlineCssIoAgs) {
        return replaceInlineCssIO(...args as ReplaceInlineCssIoAgs)
    }

};

export default replaceInlineCss;
