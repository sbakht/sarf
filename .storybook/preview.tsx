import type { Preview } from "@storybook/nextjs-vite";
import { SettingsProvider } from "../components/SettingsProvider";
import "../app/globals.css";
import "./preview.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: "padded",
    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo",
    },
  },
  // Mirrors app/layout.tsx: SettingsProvider + globals.css (imported above).
  // AppShell is page chrome — omit so component stories stay isolated.
  decorators: [
    (Story) => (
      <div className="storybook-root min-h-full antialiased text-ink bg-paper p-6">
        <SettingsProvider>
          <Story />
        </SettingsProvider>
      </div>
    ),
  ],
};

export default preview;
