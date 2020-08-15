import React from "react";
import { Map, GoogleApiWrapper, Marker } from "google-maps-react";

const Maps1 = (props) => {
  const mapStyles = {
    width: "48%",
    height: "80%",
    marginLeft: "-10px",
    marginTop: "20px",
    borderRadius: "10px",
  };
  return (
    <div>
      <Map
        google={props.google}
        zoom={8}
        style={mapStyles}
        initialCenter={{ lat: 47.444, lng: -122.176 }}
      />
      <Marker position={{ lat: 48.0, lng: -122.0 }} />
    </div>
  );
};

export default GoogleApiWrapper({
  apiKey: "AIzaSyDIvAugNCrcDJOd4w_zbthpr6igZyXDJWo",
})(Maps1);
