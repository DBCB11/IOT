 "use client"; 
// import { GoogleMap, LoadScript, MarkerF ,useJsApiLoader } from '@react-google-maps/api';
import React from 'react';
import { useEffect, useState } from "react";
import ReactMapGL , {Marker} from 'react-map-gl';
import * as turf from '@turf/turf';
import 'mapbox-gl/dist/mapbox-gl.css';
const GEOFENCE = turf.circle([-74.0122106, 40.7467898], 5, {units: 'miles'});
export default function Home() {
  
type loc = {
  id : Number;
  longitude: number | undefined;
  latitude: number | undefined;
  time :string;
};

type state = {
  longitude: number | undefined;
  latitude: number | undefined;
  zoom :number | undefined;
};

const [Loc , setLoc]= useState<loc | null >({
  id : 32,
  longitude: 105.84318434418022,
  latitude: 21.006358476679914,
  time : "1245123"
});

const [viewState, setviewState] = useState < state | null>({
  latitude: 21.006358476679914,
  longitude: 105.84318434418022,
  zoom: 16
} )


const center = {
  lat: 21.006358476679914, 
  lng: 105.84318434418022,
}


const Picon = {
  url :"target.png",
  scaledSize:{ width: 20, height: 20}
}
const Licon = {
  url :"point.png",
  scaledSize:{ width: 50, height: 50}
}

const getLocation = async () => {
  try {
    const res= await fetch('http://203.171.20.94:9202/iot/latest',{
      method: "GET",
      next: {
        revalidate: 1,
      }
    });
    if( res ) {
      const Loc = await res.json(); 
      if(Loc) {setLoc(Loc);  
     
      console.log(Loc);
    }
    }
   
    
  } catch (error) {
    console.log(error)
  }
}

useEffect(()=> {
  getLocation();
}, [])
useEffect(()=>{
  setviewState({
      latitude:Loc?.latitude,
      longitude:Loc?.longitude,
      zoom: 16,
  })
},[Loc]);



if(Loc){
  return (
     <ReactMapGL
        mapboxAccessToken = "pk.eyJ1IjoibWluaDEwMDkiLCJhIjoiY200NWRiMGdqMHZ4ZjJqb294MjV3bmdiMiJ9.lAsmEJWGKNrEdGPHs5Ze7Q"
        {...viewState}
        onMove={evt => setviewState(evt.viewState)}
      
        style={{width: '100%', height: '90vh'}}
        mapStyle="mapbox://styles/mapbox/streets-v9"
    >
      {Loc.longitude !== undefined&& Loc.latitude !== undefined  && <Marker longitude = {Loc?.longitude} latitude = {Loc?.latitude} color = 'green' >

      </Marker>} 
    </ReactMapGL>
    
  )
}
else{
  return (
  <ReactMapGL
        mapboxAccessToken = "pk.eyJ1IjoibWluaDEwMDkiLCJhIjoiY200NWRiMGdqMHZ4ZjJqb294MjV3bmdiMiJ9.lAsmEJWGKNrEdGPHs5Ze7Q"
        initialViewState={{
          latitude:  center.lat,
          longitude:  center.lng,
          zoom: 16
        }}
        style={{width: '100%', height: '90vh'}}
        mapStyle="mapbox://styles/mapbox/streets-v9"
    >
       <Marker longitude={center.lng} latitude={center.lat} color = 'blue' >
      </Marker>
    </ReactMapGL>
   
    )

}
}
