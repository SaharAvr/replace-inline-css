declare module replaceInlineCss {
    /**
     * Options for replace-inline-css
     */
    export interface Options {
        /**
         * Spacing before each newline of the output class
         */
        spacing?: Spacing;
    }
    /**
     * Options for replaceInlineCss
     */
    export interface OptionsIO extends Options {
        /**
         * Path to the input html file
         */
        inputHtmlPath: string;
        /**
         * Desired path to the output html file
         */
        outputHtmlPath: string;
    }
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
declare function replaceInlineCss(options: replaceInlineCss.OptionsIO): void;

/**
 * Replace inline css of html string.
 * @param html An html string,
 * @param options An options object containing an optional spacing type.
 * @returns An html string of the output html, without inline css.
 */
declare function replaceInlineCss(html: string, options: replaceInlineCss.Options): string;

export = replaceInlineCss;
