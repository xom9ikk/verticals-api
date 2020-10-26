const {
  CDN_ADDRESS,
} = process.env;

class TransformerComponent {
  transformLink(relativePath) {
    return relativePath ? `${CDN_ADDRESS}/${relativePath}` : relativePath;
  }
}

module.exports = {
  TransformerComponent: new TransformerComponent(),
};
