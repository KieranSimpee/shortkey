import * as React from "react";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "tint-vto": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        "merchant-id"?: string;
      };
    }
  }
}

export {};
