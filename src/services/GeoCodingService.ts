import { Injectable} from '@angular/core';
import { createClient, GoogleMapsClient } from '@google/maps';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
// import { map, tap, catchError } from 'rxjs/operators'
import 'rxjs/add/operator/map'

    /*
    "address": {
        "hotel": "The Landmark",
        "road": "Melcombe Place",
        "suburb": "Marylebone",
        "city": "London",
        "state_district": "Greater London",
        "state": "England",
        "postcode": "NW1 6JE",
        "country": "United Kingdom",
        "country_code": "gb"
    }
    */
export interface IOSMAddress {
    place_id : string,
    license : string,
    osm_type : string,
    osm_id : string,
    lat : string,
    lon : string,
    display_name : string,
    address : any;
}

export class OSMAddress {
    constructor (public place_id : string,
                public license : string,
                public osm_type : string,
                public osm_id : string,
                public lat : string,
                public lon : string,
                public display_name : string,
                public address : any)
    {
    }
}

@Injectable()
export class GeoCodingService {

  private geoCoder: GoogleMapsClient;

  public constructor(private http: Http) {
    this.geoCoder = createClient({
      key: 'AIzaSyAwAOGAxY5PZ8MshDtaJFk2KgK7VYxArPA',
    });
    this.geoCoder = new google.maps.Geocoder;

  }


  geoCode(request : google.maps.GeocoderRequest) : Promise<string>{
      let adrs = "no results";
      return new Promise((resolve, reject) => {
        this.geoCoder.geocode(request, (results, status)  => {
          if(status === 'OK') {
            if(results[0]) {
              resolve(results[0].formatted_address);
            } else {
              console.log("no results");
              return adrs = 'no results';
            }
          }
        });
      return adrs;
    });
  }

  public geocode(request : google.maps.GeocoderRequest ): Observable<OSMAddress> {
      let
            options = {
                serviceUrl : 'https://nominatim.openstreetmap.org/'
            },
            zm = 18, //Math.round(Math.log(scale / 256) / Math.log(2)),
            qstr = options.serviceUrl + 'reverse/?lat=' + request.location.lat + '&lon=' + request.location.lng + '&zoom=' + zm +
                '&addressdetails=1&format=json';
        console.log(qstr);
        return this.http.get(qstr).map((res) => {
            let item = res.json();
            console.log(item);
            // return jres.map(item => {
            //     console.log(item);
            //     console.log(item.address);
                return new OSMAddress(item.places, item.license, item.osm_type, item.osm_id,
                                      item.lat, item.lon, item.display_name, item.address);
            // })
        });
      // return this.reverse(request.location, request.scale);
    }
    /*
    return new Promise<Observable<OSMAddress>>((resolve, reject) => {
      var pos = request.location,
          req = {'location' : pos};

      let foo : Observable<OSMAddress> = this.reverse(request.location, 12);
      console.debug(foo);
      return foo;
      */
/*
      this.geoCoder.geocode(req, (error, response) => {

        if (error) {
          reject(error);
        }

        resolve(response.json.results);

      });
    });
  }
*/
/*
   public reverse(location, scale)  : Observable<OSMAddress>{
        var
            options = {
                serviceUrl : 'https://nominatim.openstreetmap.org/'
            },
            zm = 18, //Math.round(Math.log(scale / 256) / Math.log(2)),
            qstr = options.serviceUrl + 'reverse/?lat=' + location.lat() + '&lon=' + location.lng() + '&zoom=' + zm +
                '&addressdetails=1&format=json',
            response : any;
        console.log(qstr);

        return this.http.get<OSMAddress>(qstr);
        //.subscribe(res => console.log("got Address" + res.address),
          //    this.fakeError("bad bad bad"));
        // return this.http.get<OSMAddress>(qstr).pipe(tap(res => console.log("got Address" + res.address)),
        //       this.fakeError("bad bad bad"));
    }
    */
    /*
    private fakeError(err: string) {
        return null;
    }
    private extractData(res: Response) {
        let body = res;
        return body || { };
      }
    private handleError (error: Response | any) {
        let errMsg: string;
        if (error instanceof Response) {
          const err = error || '';
          errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
          errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return Observable.throw(errMsg);
      }
      */
  /*
  public geocodeReverse(request : google.maps.GeocoderRequest ): Promise<google.maps.GeocoderResult[]> {

    return new Promise<google.maps.GeocoderResult[]>((resolve, reject) => {
      this.geoCoder.geocodeReverse(request, (error, response) => {

        if (error) {
          reject(error);
        }

        resolve(response.json.results);

      });
    });

  }
  */
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
