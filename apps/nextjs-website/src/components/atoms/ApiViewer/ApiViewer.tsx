"use client";
import { FC } from "react";
import { Box, useTheme } from "@mui/material";
import "rapidoc";

// Extend JSX to recognize the custom element <rapi-doc>
declare global {
  namespace React.JSX {
    interface IntrinsicElements {
      "rapi-doc": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        "spec-url"?: string;
        theme?: string;
        "render-style"?: string;
        "show-header"?: string;
        "allow-advanced-search"?: string;
        "allow-authentication"?: string;
        "allow-server-selection"?: string;
        "allow-try"?: string;
        "auto-scroll"?: string;
        "bg-color"?: string;
        "nav-bg-color"?: string;
        "primary-color"?: string;
        "regular-color"?: string;
        "text-color"?: string;
        "font-size"?: string;
        "nav-text-color"?: string;
        "show-info"?: string;
        "show-components"?: string;
        layout?: string;
        "sort-tags"?: string;
        "goto-path"?: string;
        "fill-request-fields-with-example"?: string;
        "persist-auth"?: string;
      };
    }
  }
}

type ApiViewerProps = {
  specURL: string;
  hideTryIt?: boolean;
};

const ApiViewer: FC<ApiViewerProps> = ({ specURL }) => {
  const { palette } = useTheme();

  // function that return current API component type
  return (
    <Box
      sx={{
        mt: 0,
        display: "flex",
        height: "100%",
        width: "100%",
        overflow: "hidden",
      }}
    >
      <rapi-doc
        allow-advanced-search="false"
        allow-authentication="false"
        allow-server-selection="false"
        allow-try="false"
        auto-scroll="false"
        bg-color={palette.background.paper}
        font-size="large"
        mono-font="Titillium Web"
        nav-bg-color={palette.grey[50]}
        nav-text-color={palette.text.primary}
        primary-color={palette.primary.main}
        regular-font="Titillium Web"
        render-style="focused"
        scroll-y-offset="0"
        show-components="true"
        show-header="false"
        show-method-in-nav-bar="as-plain-text"
        spec-url={specURL}
        text-color={palette.text.primary}
        theme="light"
      ></rapi-doc>
    </Box>
  );
};

export default ApiViewer;
