import React, {useEffect, useMemo, useRef, useCallback} from 'react';
import {
  ScrollView,
  Text,
  Dimensions,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {WebView} from 'react-native-webview';
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
import Config from 'react-native-config';
import splashScreen from 'react-native-splash-screen';
import MyCamera from './src/components/camera';
class BridgeKit {
  injectedJavascript = `(function() {
    window.postMessage = function(data) {
      window.ReactNativeWebView.postMessage(data);
  };
  })()`;
  setWebViewRef(webView) {
    this.webView = webView;
  }
  runKit(data, kit) {
    const {method, params} = JSON.parse(data);
    kit[method] && kit[method](params);
  }
  postMessage(data) {
    this.webView.postMessage(data);
  }
}
const bridgeKit = new BridgeKit();
const App = () => {
  const cameraRef = useRef(null);
  const webviewRef = useRef(null);

  useEffect(() => {
    bridgeKit.setWebViewRef(webviewRef.current);
  }, [webviewRef]);

  const onWebViewInvokeMessage = useCallback(
    event => {
      const {nativeEvent} = event;
      const {data} = nativeEvent;
      bridgeKit.runKit(data, {
        takePhoto: params => {
          cameraRef.current.grantAndActiveCamera();
        },
      });
    },
    [cameraRef],
  );

  const onGetPhotoURI = useCallback(uri => {
    bridgeKit.postMessage(
      JSON.stringify({method: 'onGetPhotoURI', params: {uri}}),
    );
  }, []);

  return (
    <>
      <MyCamera ref={cameraRef} onGetPhotoURI={onGetPhotoURI} />
      <WebView
        geolocationEnabled
        allowFileAccessFromFileURLs
        allowUniversalAccessFromFileURLs
        allowFileAccess
        thirdPartyCookiesEnabled
        domStorageEnabled
        javaScriptEnabled
        injectedJavaScript={bridgeKit.injectedJavascript}
        onLoadEnd={() => {
          splashScreen.hide();
        }}
        ref={webviewRef}
        style={{width, height}}
        originWhitelist={['*']}
        onMessage={onWebViewInvokeMessage}
        source={{uri: 'file:///android_asset/index.html'}}
      />
    </>
  );
};
export default App;
