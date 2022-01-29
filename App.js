import React, {useEffect, useMemo, useRef, useState} from 'react';
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
  useEffect(() => {
    splashScreen.hide();
  }, []);
  const [grant, setGrant] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const consumerTakePhotoRequest = async () => {
    const grantResult = await Camera.getCameraPermissionStatus();
    if (grantResult === 'authorized') {
      setGrant(grantResult);
      setCameraActive(true);
    } else {
      const userActionResult = await Camera.requestCameraPermission();
      setGrant(userActionResult);
      if (userActionResult === 'authorized') {
        setCameraActive(true);
      }
    }
  };
  const devices = useCameraDevices();
  const backDeviceReady = devices.back;

  const showCameraLayer = useMemo(
    () => grant === 'authorized' && backDeviceReady && cameraActive,
    [grant, backDeviceReady, cameraActive],
  );
  const cameraRef = useRef(null);
  const [previewURI, setPreviewURI] = useState(null);
  return (
    <>
      {showCameraLayer ? (
        <View>
          <Camera
            style={{width, height}}
            photo={true}
            device={backDeviceReady}
            ref={cameraRef}
            isActive={true}
          />
          <TouchableOpacity
            style={styles.closeCameraButtonBox}
            onPress={() => {
              setCameraActive(false);
            }}>
            <Image
              style={styles.closeCameraButton}
              source={require('./src/assets/icons/close.png')}
            />
          </TouchableOpacity>
          <View style={styles.cameraButtonBox}>
            <TouchableOpacity
              onPress={async () => {
                const photo = await cameraRef.current.takePhoto();
                setPreviewURI(`file://${photo.path}`);
              }}
              style={styles.cameraButton}
            />
          </View>
          {previewURI ? (
            <View style={styles.cameraPreviewBox}>
              <TouchableOpacity
                style={styles.closeCameraButtonBox}
                onPress={() => {
                  setCameraActive(false);
                }}>
                <Image
                  style={styles.closeCameraButton}
                  source={require('./src/assets/icons/close.png')}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.checkButtonBox}
                onPress={() => {
                  alert(previewURI);
                  setCameraActive(false);
                }}>
                <Image
                  style={styles.checkButton}
                  source={require('./src/assets/icons/check.png')}
                />
              </TouchableOpacity>
              <Image
                style={styles.preview}
                source={{
                  uri: previewURI,
                }}
              />
            </View>
          ) : null}
        </View>
      ) : null}
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
        style={{width, height}}
        originWhitelist={['*']}
        onMessage={onWebViewInvokeMessage}
        source={{uri: 'file:///android_asset/index.html'}}
      />
    </>
  );
};
const styles = StyleSheet.create({
  closeCameraButtonBox: {
    position: 'absolute',
    zIndex: 2,
    top: 10,
    left: 10,
    opacity: 1,
  },
  closeCameraButton: {
    width: 40,
    height: 40,
  },
  checkButtonBox: {
    position: 'absolute',
    zIndex: 2,
    top: 10,
    right: 10,
    opacity: 0.8,
  },
  checkButton: {
    width: 40,
    height: 40,
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
