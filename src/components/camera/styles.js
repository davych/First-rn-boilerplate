import {Dimensions, StyleSheet} from 'react-native';
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
export default StyleSheet.create({
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
