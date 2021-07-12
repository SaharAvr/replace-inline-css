declare namespace replaceInlineCss {
    /**
     * options for replace-inline-css
     */
    interface Options {
        /**
         * path to the input html file
         */
         inputHtmlPath: string;
        /**
         * desired path to the output html file
         */
         outputHtmlPath: string;
        /**
         * spacing before each newline of the output class
         */
         spacing?: Spacing;
    }
    /**
     * spacing types
     */
    interface Spacing {
        NONE: string
        TWO_SPACES: string,
        FOUR_SPACES: string,
    }
}

declare function replaceInlineCss(options: replaceInlineCss.Options): void;

export = replaceInlineCss;
