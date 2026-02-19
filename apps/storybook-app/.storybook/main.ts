import { createRequire } from "node:module";
import type { StorybookConfig } from '@storybook/nextjs';
import path, { dirname, join } from 'path';
import Dotenv from 'dotenv-webpack';

const require = createRequire(import.meta.url);

const config: StorybookConfig = {
    stories: ['../**/*.stories.@(js|jsx|ts|tsx)', '../**/*.mdx'],
    staticDirs: ['../public'],
    addons: [getAbsolutePath("@storybook/addon-links"), getAbsolutePath("@storybook/addon-docs")],
    framework: {
        name: getAbsolutePath("@storybook/nextjs"),
        options: {},
    },
    typescript: {
        check: false,
        checkOptions: {},
        reactDocgen: 'react-docgen-typescript',
        reactDocgenTypescriptOptions: {
            shouldExtractLiteralValuesFromEnum: true,
            propFilter: (prop) =>
                prop.parent ? !/node_modules/.test(prop.parent.fileName) : true,
        },
    },
    core: {
        disableTelemetry: true,
    },
    webpackFinal(config, options) {
        if (!config.resolve?.alias) {
            config.resolve!.alias = {};
        }
        (config.resolve!.alias as Record<string, string>)['@'] = path.resolve(__dirname, '../../nextjs-website/src');
        config.plugins!.push(new Dotenv({
            path: path.resolve(__dirname, '../../nextjs-website/.env'),
        }));
        if (config.resolve) {
          config.resolve.alias = {
            ...config.resolve.alias,
            'next/navigation': require.resolve('./nextNavigationProxy.ts'),
          };
        }
        return config;
    },
};

export default config;

function getAbsolutePath(value: string): any {
    return dirname(require.resolve(join(value, "package.json")));
}
