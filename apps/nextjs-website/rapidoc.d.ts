// Extend JSX to recognize the custom element <rapi-doc>
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      readonly 'rapi-doc': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        readonly 'spec-url'?: string;
        readonly theme?: string;
        readonly 'render-style'?: string;
        readonly 'show-header'?: string;
        readonly 'primary-color'?: string;
      };
    }
  }
}

export {};
