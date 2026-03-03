import { registerRootComponent } from 'expo';
import App from './App';
import { setupMapbox } from './src/config/MapboxConfig';

setupMapbox();

registerRootComponent(App);
