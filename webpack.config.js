module.exports = {
    entry: './client/index.js',
    output: {
        filename: 'bundle.js',
        path: './build'
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    module: {
        loaders: [
            {
                test: /\.(jsx)|(js)$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ["react", "es2015"],
                    plugins: ["transform-class-properties"]
                }
            },
        ]
    }
}