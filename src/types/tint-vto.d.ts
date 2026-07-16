/// <reference types="react" />

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "tint-vto": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          "merchant-id"?: string;
          sku?: string;
          "isolated-sku"?: boolean | string;
        },
        HTMLElement
      >;
    }
  }
}

export {};
