import type { StorybookConfig } from '@storybook/react-vite';

// O Storybook herda os plugins (React + Tailwind v4) do vite.config.ts do app.
const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-a11y', '@storybook/addon-docs'],
  framework: '@storybook/react-vite',
};
export default config;
