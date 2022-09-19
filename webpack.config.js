const path = require("path");

module.exports = (async () => {
    return {
        entry: "./src/index.ts",
        output: {
            path: path.resolve(__dirname, 'lib'),
            filename: './index.js',
            library: {
                name: 'webpackNumbers',
                type: 'umd',
            },
        },
        plugins: [
            // new TypeBundler(),
        ],
        target: "node",
        mode: "production",
        externals: ["encoding"],
        resolve: {
            // Add `.ts` and `.tsx` as a resolvable extension.
            extensions: [".ts", ".tsx", ".js"],
        },
        module: {
            rules: [
                // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
                { test: /\.tsx?$/, loader: "ts-loader" },
            ],
        },
    };
})();
