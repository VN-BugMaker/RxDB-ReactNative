import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import initializeDB from './src/store/InitializedDB';

initializeDB();
AppRegistry.registerComponent(appName, () => App);
