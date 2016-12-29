module.exports = {
    entry: './client/app.jsx',
    output: {
        filename: 'bundle.js',
        path: './build'
    },
    module: {
        loaders: [
            {
                test: /\.jsx$/,
                loader: 'babel-loader',
                query: {
                    presets: ["react", "es2015"]
                }
            },
        ]
    }
}