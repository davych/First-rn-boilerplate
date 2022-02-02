import Config from 'react-native-config';

const deployMode = Config.DEPLOYMODE;

const deployConfig = {};

const baseUrl = 'file:///android_asset/index.html#';

switch (deployMode) {
  case 'pda':
    deployConfig.webviewEntrance = `${baseUrl}/pda/start`;
    break;
  case 'vehicle':
    deployConfig.webviewEntrance = `${baseUrl}/vehicle/start`;
    break;
  case 'document':
    deployConfig.webviewEntrance = `${baseUrl}/document/start`;
    break;
  default:
    deployConfig.webviewEntrance = `${baseUrl}/pda/start`;
    break;
}

export default deployConfig;
