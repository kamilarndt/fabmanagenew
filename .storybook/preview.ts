import type { Preview } from "@storybook/react";
import "../src/styles/css-variables.css";

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) => (
      <ThemeProvider>
        <ConfigProvider>
          <Story />
        </ConfigProvider>
      </ThemeProvider>
    ),
  ],
};

export default preview;
