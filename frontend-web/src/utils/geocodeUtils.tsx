export const geocodeAddress = async (address: string) => {
    const geocoder = window.google.maps ? new window.google.maps.Geocoder() : null;
  
    if (!geocoder) {
      console.error('Google Maps API is not available.');
      return;
    }
  
    return new Promise<google.maps.GeocoderResult>((resolve, reject) => {
      geocoder.geocode({ address }, (results, status) => {
        if (status === 'OK' && results && results.length > 0) {
          resolve(results[0]);
        } else {
          reject(new Error('Geocode was not successful for the following reason: ' + status));
        }
      });
    });
  };
export default geocodeAddress;