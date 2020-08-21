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
      center={[90.3563, 23.6850]}
      zoom={[6]}
      containerStyle={{
        height: '80vh'
      }}
    >
      <Marker
        coordinates={[90.3563, 23.6850]}
        anchor="bottom">
        <div style={redBubbles} ></div>
      </Marker>
      <Marker
        coordinates={[91.3575, 22.6750]}
        anchor="bottom">
        <div style={redBubbles} ></div>
      </Marker>
      <Marker
        coordinates={[89.9567, 23.3951]}
        anchor="bottom">
        <div style={redBubbles} ></div>
      </Marker>
      <Marker
        coordinates={[89.105344, 24.526176]}
        anchor="bottom">
        <div style={redBubbles} ></div>
      </Marker>
      
      <Marker
        coordinates={[91.3563, 22.6850]}
        anchor="bottom">
        <div style={yellowBubbles} ></div>
      </Marker>
      <Marker
        coordinates={[88.984375, 25.776259]}
        anchor="bottom">
        <div style={yellowBubbles} ></div>
      </Marker>
      <Marker
        coordinates={[88.298887, 24.718622]}
        anchor="bottom">
        <div style={yellowBubbles} ></div>
      </Marker>
      <Marker
        coordinates={[89.891639 , 23.799580]}
        anchor="bottom">
        <div style={yellowBubbles} ></div>
      </Marker>

      <Marker
        coordinates={[91.3563, 24.6850]}  
        anchor="bottom">
        <div style={yellowBubbles} ></div>
      </Marker>
      <Marker
        coordinates={[89.41786, 23.661155]}  
        anchor="bottom">
        <div style={greenBubbles} ></div>
      </Marker>
      <Marker
        coordinates={[89.155747, 22.390162]}  
        anchor="bottom">
        <div style={greenBubbles} ></div>
      </Marker>
      <Marker
        coordinates={[89.538814, 24.965616]}  
        anchor="bottom">
        <div style={greenBubbles} ></div>
      </Marker>
      

    </Map>
  );
};


export default GeoHotSpotMap;