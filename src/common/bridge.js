class Bridge {
  injectedJavascript = `(function() {
    window.postMessage = function(data) {
      window.ReactNativeWebView.postMessage(data);
    };
    window.Android = {
      takePicture: function() {
        window.postMessage(JSON.stringify({method: 'takePhoto'}));
      },
      getCurrentLocation: function() {
        window.postMessage(JSON.stringify({method: 'getCurrentLocation'}));
      }
    }

    window.addEventListener('message', function(event) {
      const data = JSON.parse(event.data);
      const AndroidCallback = window.AndroidCallback || {};
      if (data.method === 'onGetPhotoURI') {
        window.AndroidCallback.onGetPhotoURI && window.onGetPhotoURI(data.params.uri);
      } else if (data.method === 'onGetCurrentLocation') {
        window.AndroidCallback.onGetCurrentLocation && window.onGetCurrentLocation(data.params.location);
      }
    });
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
