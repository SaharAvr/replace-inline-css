declare module replaceInlineCss {
    /**
     * Base options for replace-inline-css
     */
    export interface BaseOptions {
        /**
         * Spacing before each newline of the output class
         */
        spacing?: Spacing;
    }
    /**
     * Args type for replaceInlineCssIO
     */
    export type ReplaceInlineCssIoAgs = [
        /**
         * Path to the input html file
         */
        inputHtmlPath: string,
        /**
         * Desired path to the output html file
         */
        outputHtmlPath: string,
        /**
         * Base options
         */
        options?: BaseOptions,
    ]
    /**
     * Args type for replaceInlineCssBase
     */
     export type ReplaceInlineCssBaseAgs = [
        /**
         * Html string to work on
         */
        html: string,
        /**
         * Base options
         */
        options?: BaseOptions,
    ]
    /**
     * Spacing types
     */
    export enum Spacing {
        /**
         * No spacing
         */
        NONE = '',
        /**
         * 2 spaces before each new line
         */
        TWO_SPACES = '  ',
        /**
         * 4 spaces before each new line
         */
        FOUR_SPACES = '    ',
    }
    /**
     * Css classes object, containing a key value pairs of class name and css text
     */
    export interface CssClasses {
        /**
         * A key value pair of class name (key) and css text (value)
         */
        [className: string]: string,
    }
}

/**
 * Replace inline css of html file (IO action).
 * @param options An options object containing the input html path, the desired output html path,
 * and an optional spacing type.
 */
declare function replaceInlineCss(...args: replaceInlineCss.ReplaceInlineCssIoAgs): void;

/**
 * Replace inline css of html string.
 * @param html An html string,
 * @param options An options object containing an optional spacing type.
 * @returns An html string of the output html, without inline css.
 */
declare function replaceInlineCss(...args: replaceInlineCss.ReplaceInlineCssBaseAgs): string;

export = replaceInlineCss;
