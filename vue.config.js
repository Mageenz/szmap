module.exports = {
    devServer: {
        proxy: {
            '/api': {
                target: 'https://api.tnc.hdumok.com'
            }
        }
    }
}