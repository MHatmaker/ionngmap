import { createClient, GoogleMapsClient } from '@google/maps';

export class GeoCodingService {

  private geoCoder: GoogleMapsClient;

  public constructor() {
    this.geoCoder = createClient({
      key: 'YOUR-API-KEY',
    });

  }

  public geocode(request : google.maps.GeocoderRequest ): Promise<google.maps.GeocoderResult[]> {
    // const request: google.maps.GeocoderRequest = {
    //   address: '1600 Amphitheatre Parkway, Mountain View, CA'
    // };

    return new Promise<google.maps.GeocoderResult[]>((resolve, reject) => {
      this.geoCoder.geocode(request, (error, response) => {

        if (error) {
          reject(error);
        }

        resolve(response.json.results);

      });
    });

  }
}

  // USAGE
  /*
new GeoCodingService().geocodeAddress().then((results) => {
  console.log('results', results);

  const result   = response.json.results[0],
        location = result.geometry.location;

        // @types/googlemaps describe the Javascript API not the JSON object on the response
        // there a sublte difference like lat/lng beeing number not functions, making this `<any>` cast necessary
        resolve({
          lat:     <any>location.lat,
          lng:     <any>location.lng,
          address: result.formatted_address,
        });


});
*/
