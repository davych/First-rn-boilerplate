import React, {useEffect, useState, useRef, useCallback} from 'react';
import {Dimensions, BackHandler} from 'react-native';
import {WebView} from 'react-native-webview';
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
import splashScreen from 'react-native-splash-screen';
import MyCamera from './src/components/camera';
import deployConfig from './src/common/deployConfig';
import bridge from './src/common/bridge';

const App = () => {
  const cameraRef = useRef(null);
  const webviewRef = useRef(null);
  const [webviewCanGoBack, setWebviewCanGoBack] = useState(false);

  useEffect(() => {
    BackHandler.removeEventListener('hardwareBackPress');
    BackHandler.addEventListener('hardwareBackPress', () => {
      if (webviewCanGoBack) {
        webviewRef.current.goBack();
        return true;
      }
      return false;
    });
  }, [webviewCanGoBack, webviewRef]);

  useEffect(() => {
    return () => {
      BackHandler.removeEventListener('hardwareBackPress');
    };
  }, []);

  useEffect(() => {
    bridge.setWebViewRef(webviewRef.current);
  }, [webviewRef]);

  const onWebViewInvokeMessage = useCallback(
    event => {
      const {nativeEvent} = event;
      const {data} = nativeEvent;
      bridge.runKitFunction(data, {
        takePhoto: params => {
          cameraRef.current.grantAndActiveCamera();
        },
      });
    },
    [cameraRef],
  );

  const onGetPhotoURI = useCallback(uri => {
    bridge.postMessage(
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
        injectedJavaScript={bridge.injectedJavascript}
        onLoadEnd={() => {
          splashScreen.hide();
        }}
        ref={webviewRef}
        style={{width, height}}
        originWhitelist={['*']}
        onMessage={onWebViewInvokeMessage}
        onNavigationStateChange={navState => {
          setWebviewCanGoBack(navState.canGoBack);
        }}
        source={{uri: deployConfig.webviewEntrance}}
      />
    </>
  );
};
export default App;
