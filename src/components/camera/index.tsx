import React, {
  forwardRef,
  useMemo,
  useRef,
  useState,
  useImperativeHandle,
  FunctionComponent,
} from 'react';
import {Dimensions, View, Image, TouchableOpacity} from 'react-native';
import {Camera, useCameraDevices} from 'react-native-vision-camera';
import styles from './styles';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const cameraStyle = {width, height}
// props with function onGetPhotoURI

export interface CameraProps {
  ref: any
  onGetPhotoURI: (uri: string) => void
}

export interface CameraRef {
  grantAndActiveCamera: () => void
}

const MyCamera: FunctionComponent<CameraProps> = forwardRef((props, ref) => {
  const cameraRef = useRef<Camera>(null);
  const [grant, setGrant] = useState<string>('');
  const [cameraActive, setCameraActive] = useState(false);
  const [previewURI, setPreviewURI] = useState<string>('');
  const devices = useCameraDevices();
  const backDeviceReady = devices.back;

  const showCameraLayer = useMemo(
    () => grant === 'authorized' && backDeviceReady && cameraActive,
    [grant, backDeviceReady, cameraActive],
  );

  useImperativeHandle(ref, () => ({
    grantAndActiveCamera: async () => {
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
    },
  }));

  return (
    <>
      {showCameraLayer ? (
        <View>
          {backDeviceReady && <Camera
            style={cameraStyle}
            photo={true}
            device={backDeviceReady}
            ref={cameraRef}
            isActive={true}
          />}
          <TouchableOpacity
            style={styles.closeCameraButtonBox}
            onPress={() => {
              setCameraActive(false);
            }}>
            <Image
              style={styles.closeCameraButton}
              source={require('../../assets/icons/close.png')}
            />
          </TouchableOpacity>
          <View style={styles.cameraButtonBox}>
            <TouchableOpacity
              onPress={async () => {
                if(cameraRef.current) {
                  const photo = await cameraRef.current.takePhoto();
                  setPreviewURI(`file://${photo.path}`);
                }
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
                  source={require('../../assets/icons/close.png')}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.checkButtonBox}
                onPress={() => {
                  props.onGetPhotoURI(previewURI);
                  setCameraActive(false);
                }}>
                <Image
                  style={styles.checkButton}
                  source={require('../../assets/icons/check.png')}
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
    </>
  );
});
export default MyCamera;
