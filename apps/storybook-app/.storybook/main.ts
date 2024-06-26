import type { StorybookConfig } from '@storybook/nextjs';
import path from 'path';
import Dotenv from 'dotenv-webpack';

const config: StorybookConfig = {
    stories: ['../**/*.stories.@(js|jsx|ts|tsx)', '../**/*.mdx'],
    staticDirs: ['../public'],
    addons: ['@storybook/addon-links', '@storybook/addon-essentials', '@storybook/addon-interactions'],
    framework: {
        name: '@storybook/nextjs',
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
        config.resolve!.alias['@'] = path.resolve(__dirname, '../../nextjs-website/src');
        config.plugins!.push(new Dotenv({
            path: path.resolve(__dirname, '../../nextjs-website/.env'),
        }));
        return config;
    },
};

export default config;
