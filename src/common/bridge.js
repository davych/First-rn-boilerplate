class Bridge {
  injectedJavascript = `(function() {
    window.postMessage = function(data) {
      window.ReactNativeWebView.postMessage(data);
  };
  })()`;
  setWebViewRef(webView) {
    if (!this.webView) {
      this.webView = webView;
    }
  }
  runKitFunction(data, kitFunction) {
    const {method, params} = JSON.parse(data);
    kitFunction[method] && kitFunction[method](params);
  }
  postMessage(data) {
    this.webView.postMessage(data);
  }
}
const bridge = new Bridge();
export default bridge;
