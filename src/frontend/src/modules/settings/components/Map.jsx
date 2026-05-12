import React from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import * as Shared from "../../../shared";


const containerStyle = {
  width: "100%",
  height: "500px",
};

export default function Map({ setCoordinates }) {
  const [markers, setMarkers] = React.useState([]);
  const gps = Shared.Hook.useGPS();

  const [center, setCenter] = React.useState({
    lat: 28.69398163747205, // Center of India
    lng: 77.10079948724547,
    isDefault: true,
  });
  React.useEffect(() => {
    gps.getLocation().then(info => {
      const loc = info.coordicantes;
      if(!loc)return;
      setMarkers([
        {
          label: "selectedLocation",
          lat: loc[1],
          lng: loc[0],
        },
      ]);
    })
  }, [])
  React.useEffect(() => {
    if (markers.length > 0) {
      if (center.isDefault)
        setCenter({
          lat: markers[0].lat,
          lng: markers[0].lng,
        });
      setCoordinates({
        lat: markers[0].lat,
        lng: markers[0].lng,
      });
    }
  }, [markers]);

  return (
    <LoadScript googleMapsApiKey="AIzaSyCNbWx_rMz7HI8YFR0cXI-cRUZ0yBfi_3E">
      <GoogleMap
        mapContainerStyle={ containerStyle }
        center={ center }
        zoom={ 16 }
        onClick={ (e) => {
          setMarkers([
            {
              label: "selectedLocation",
              lat: e.latLng.lat(),
              lng: e.latLng.lng(),
            },
          ]);
        } }
      >
        { markers.map((point, index) => (
          <Marker key={ index } position={ point } title={ point.label } />
        )) }
      </GoogleMap>
    </LoadScript>
  );
}
