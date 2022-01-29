import React, {useMemo, useRef, useState} from 'react';
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
import {Camera, useCameraDevices} from 'react-native-vision-camera';
import splashScreen from 'react-native-splash-screen';

const injectedJavascript = `(function() {
  window.postMessage = function(data) {
    window.ReactNativeWebView.postMessage(data);
};
})()`;

const App = () => {
  const onWebViewInvokeMessage = event => {
    const {nativeEvent} = event;
    const {data} = nativeEvent;
    const {method, params} = JSON.parse(data);
    if (method === 'takePhoto') {
      consumerTakePhotoRequest();
    }
  };
  const [grant, setGrant] = useState(null);
  const consumerTakePhotoRequest = async () => {
    const grantResult = await Camera.getCameraPermissionStatus();
    if (grantResult === 'authorized') {
      setGrant(grantResult);
    } else {
      const userActionResult = await Camera.requestCameraPermission();
      setGrant(userActionResult);
    }
  };
  const devices = useCameraDevices();

  const showCameraLayer = useMemo(
    () => grant === 'authorized' && devices.back,
    [grant, devices.back],
  );
  const cameraRef = useRef(null);
  const [previewURI, setPreviewURI] = useState(null);
  return (
    <View contentInsetAdjustmentBehavior="automatic">
      {/* {showCameraLayer ? (
        <View style={styles.cameraBox}>
          <Camera
            style={{width, height}}
            photo={true}
            device={devices.back}
            ref={cameraRef}
            isActive
          />
          <View style={styles.cameraButtonBox}>
            <TouchableOpacity
              onPress={async () => {
                const photo = await cameraRef.current.takePhoto();
                console.log(photo);
                setPreviewURI(photo.path);
              }}
              style={styles.cameraButton}
            />
          </View>
          {previewURI ? (
            <View style={styles.cameraPreviewBox}>
              <Image
                style={styles.preview}
                source={{
                  uri: `file://${previewURI}`,
                }}
              />
            </View>
          ) : null}
        </View>
      ) : null} */}
      <WebView
        geolocationEnabled
        allowFileAccessFromFileURLs
        allowUniversalAccessFromFileURLs
        allowFileAccess
        thirdPartyCookiesEnabled
        domStorageEnabled
        javaScriptEnabled
        injectedJavaScript={injectedJavascript}
        onLoadEnd={() => {
          splashScreen.hide();
        }}
        style={{width, height, backgroundColor: 'red'}}
        originWhitelist={['*']}
        onMessage={onWebViewInvokeMessage}
        source={{uri: 'https://www.baidu.com'}}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  cameraBox: {
    width: width,
    height: height,
    position: 'absolute',
    zIndex: 1,
    top: 0,
    bottom: 0,
  },
  cameraPreviewBox: {
    width: width,
    height: height,
    position: 'absolute',
    zIndex: 3,
    top: 0,
    bottom: 0,
  },
  preview: {
    width: width,
    height: height,
  },
  cameraButtonBox: {
    position: 'absolute',
    alignItems: 'center',
    width: width,
    height: 20,
    zIndex: 2,
    bottom: 100,
  },
  cameraButton: {
    width: 70,
    height: 70,
    opacity: 0.5,
    backgroundColor: 'white',
    borderRadius: 70,
  },
});
export default App;
