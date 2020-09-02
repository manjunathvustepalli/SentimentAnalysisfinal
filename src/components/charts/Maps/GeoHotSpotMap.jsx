import React from 'react';
import ReactMapboxGl, { Marker, Cluster } from 'react-mapbox-gl';

const places = {
  "features":[
    {
      key: 1,
      coordinates: [ 90.3563, 23.6850] 
    },
    {
      key: 2,
      coordinates:  [ 91.3563, 22.6850 ] 
    },
    {
      key: 3,
      coordinates: [ 91.3563, 24.6850 ] 
    }
  ]
};

const GeoHotSpotMap = () => {

  const Map = ReactMapboxGl({
    accessToken: "pk.eyJ1IjoibnY4IiwiYSI6ImNrZTN6cGE0MDBvNXozMG9iNWJ2YTZxcmEifQ.ySJ1X8VZlNrtbItgc0Mjkg",
    dragRotate : false
  });

  const greenBubbles = {
    height: '50px', 
    borderRadius: '50px', 
    background: '#04E36C', 
    width:'50px', 
    opactiy: '0.5', 
    zIndex: 300
  }

  const yellowBubbles = {
    height: '40px', 
    borderRadius: '50px', 
    background: '#FCC401', 
    width:'40px', 
    opactiy: '0.5', 
    zIndex: 400
  }

  const redBubbles = {
    height: '30px', 
    borderRadius: '30px', 
    background: '#FF5152',
    width:'30px',
    opactiy: '0.5', 
    zIndex: 500
  }

  return (
    <Map
      style="mapbox://styles/mapbox/streets-v9"
      center={[78.9629,20.5937]}
      zoom={[4]}
      containerStyle={{
        height: '80vh'
      }}
    >
      <Marker
        coordinates={[77.1025, 28.7041]}
        anchor="bottom">
        <div style={redBubbles}></div>
      </Marker>

      <Marker
        coordinates={[80.1025, 20.7041]}
        anchor="bottom">
        <div style={redBubbles}></div>
      </Marker>
      
      <Marker
        coordinates={[79.7400,15.9129]}
        anchor="bottom">
        <div style={yellowBubbles} ></div>
      </Marker>
            
      <Marker
        coordinates={[79.7400,12.9129]}
        anchor="bottom">
        <div style={yellowBubbles} ></div>
      </Marker>
      <Marker
        coordinates={[79.7400,11.9129]}
        anchor="bottom">
        <div style={greenBubbles} ></div>
      </Marker>
      <Marker
        coordinates={[72.6569, 29.9734]}
        anchor="bottom"
      >
      <div style={greenBubbles} ></div>
      </Marker>

      <Marker
        coordinates={[78.6569, 22.9734]}
        anchor="bottom"
      >
      <div style={greenBubbles} ></div>
      </Marker>
      <Marker
        coordinates={[76.6569, 20.9734]}
        anchor="bottom"
      >
      <div style={redBubbles} ></div>
      </Marker>
    </Map>
  );
};


export default GeoHotSpotMap;