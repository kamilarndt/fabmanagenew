import type { Preview } from "@storybook/react";
import { ConfigProvider } from "antd";
import "../src/index.css";

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: "centered",
    backgrounds: {
      default: "light",
      values: [
        {
          name: "light",
          value: "#ffffff",
        },
        {
          name: "dark",
          value: "#1f1f1f",
        },
      ],
    },
  },
  decorators: [
    (Story) => (
      <ConfigProvider
        theme={{
          token: {
            borderRadius: 6,
            fontFamily: "Inter, system-ui, sans-serif",
          },
        }}
      >
        <div style={{ padding: "1rem" }}>
          <Story />
        </div>
      </ConfigProvider>
    ),
  ],
};

export default preview;
