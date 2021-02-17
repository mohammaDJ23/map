import React, { useEffect, useRef } from "react";
import ReactMapGl from "react-map-gl";

import MarkerControl from "./components/MarkerCntrl/MarkerCntrl";
import { useMap } from "./shared/hooks/map";

import "./App.css";

const token = process.env.REACT_APP_MAPBOX_TOKEN;
const mapStyle = "mapbox://styles/mapbox/streets-v11";

function App() {
  const {
    viewport,
    changeViewportHandler,
    doubleClickOnMapHandler,
    onSubmitHandler,
    showPopupHandler,
    onChnageInpusHandler
  } = useMap();

  const {
    width,
    height,
    latitude,
    longitude,
    zoom,
    formValidation,
    markers,
    isLoading
  } = viewport;

  const nameInputRef = useRef();
  const nameInputCurrent = nameInputRef.current;

  // focus on first input (name) when form is appear

  useEffect(() => {
    if (nameInputCurrent) {
      nameInputCurrent.focus();
    }
  }, [nameInputCurrent]);

  return (
    <ReactMapGl
      width={width}
      height={height}
      latitude={latitude}
      longitude={longitude}
      zoom={zoom}
      mapStyle={mapStyle}
      mapboxApiAccessToken={token}
      onViewportChange={changeViewportHandler}
      onDblClick={doubleClickOnMapHandler}
    >
      <MarkerControl
        showPopupHandler={showPopupHandler}
        onSubmitHandler={onSubmitHandler}
        onChnageInpusHandler={onChnageInpusHandler}
        formValidation={formValidation}
        viewport={markers}
        isLoading={isLoading}
        nameInputRef={nameInputRef}
      />
    </ReactMapGl>
  );
}

export default App;
