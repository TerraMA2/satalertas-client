const PROXY_CONFIG = [
  {
    context: ['/api'],
    target: 'http://www.dpi.inpe.br/fipcerrado-geoserver/ows',
    secure: false,
    pathRewrite: {'^/api': ''}
  }
]

module.exports = PROXY_CONFIG;