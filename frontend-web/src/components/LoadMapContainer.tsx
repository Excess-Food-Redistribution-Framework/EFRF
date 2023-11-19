import { LoadScript } from '@react-google-maps/api';

class LoadMapContainer extends LoadScript {
  componentDidMount() {
    const cleaningUp = true;
    const isBrowser = typeof document !== 'undefined';

    // Check if the Google API is already loaded
    const isAlreadyLoaded =
      window.google &&
      window.google.maps &&
      document.querySelector('body.first-hit-completed');

    if (!isAlreadyLoaded && isBrowser) {
      if (window.google && !cleaningUp) {
        console.error('google api is already presented');
        return;
      }

      // Load the Google API only if it hasn't been loaded yet
      this.isCleaningUp().then(this.injectScript);
    }

    if (isAlreadyLoaded) {
      this.setState({ loaded: true });
    }
  }
}

export default LoadMapContainer;