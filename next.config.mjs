/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ['localhost'],
    },
    webpack: (config) => {
        config.resolve.alias.canvas = false;
        // config.module.rules.push({
        //     test: /\.node/,
        //     use: "raw-loader",
        // });
        return config;
    },
};

export default nextConfig;
