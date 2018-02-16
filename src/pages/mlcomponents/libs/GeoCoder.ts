import {
    Injectable,
} from '@angular/core';
import { Nominatim } from "nominatim-geocoder";

console.log("loading PusherConfig");

interface IGeoCoder {
}

@Injectable()
export class GeoCoder {
    private geocoder = null;
    private options : {
        serviceUrl : string
    };

    constructor () {
        this.geocoder = new Nominatim();
    }

    search () { //}: [{'error': 'uh-oh'}] {
        this.geocoder.search({ q: 'Berlin, Germany' } )
        .then((response) => {
            console.log(response);
            return response;
        })
        .catch((error) => {
            console.log(error);
        })
    }

    reverse (location, scale) {
        var zm = 18, //Math.round(Math.log(scale / 256) / Math.log(2)),
            qstr = `{this.options.serviceUrl}reverse/?lat={location.lat}&lon={location.lng}
                    &zoom={zm}&addressdetails=1&format=json`;
        console.log(qstr);

        this.geocoder.search(qstr)
        .then((response) => {
            console.log(response);
            return response;
        })
        .catch((error) => {
            console.log(error);
        })
    }
}

/*
    options : {
        serviceUrl : string
    };
    constructor(private http : any) {
        this.options.serviceUrl = '//nominatim.openstreetmap.org/';
    }

    handleSuccess(response) {

        return (response.data);

    }
    isObject(x: any): x is Object {
        return x != null && typeof x === 'object';
    }
    // I transform the error response, unwrapping the application dta from
    // the API response payload.
    handleError(response) {

        // The API response from the server should be returned in a
        // nomralized format. However, if the request was not handled by the
        // server (or what not handles properly - ex. server error), then we
        // may have to normalize it on our end, as best we can.
        if (!this.isObject(response.data) || !response.data.message) {
            return ($q.reject("An unknown error occurred."));
        }

        // Otherwise, use expected error message.
        return ($q.reject(response.data.message));

    }

    reverse(location, scale) {
        var zm = 18, //Math.round(Math.log(scale / 256) / Math.log(2)),
            qstr = this.options.serviceUrl + 'reverse/?lat=' + location.lat + '&lon=' + location.lng + '&zoom=' + zm +
                '&addressdetails=1&format=json',
            request;
        console.log(qstr);

        request = this.http({
            method: "get",
            url: qstr,
            params: {
                action: "get"
            }
        });

        return (request.then(this.handleSuccess, this.handleError));
    }
}
*/
