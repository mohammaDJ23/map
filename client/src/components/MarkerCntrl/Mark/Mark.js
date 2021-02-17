import React from "react";
import { Marker } from "react-map-gl";

function Mark({ mark, showPopupHandler }) {
  const { lat, lng } = mark;

  return (
    <Marker latitude={lat} longitude={lng} offsetLeft={-15} offsetTop={-10}>
      <svg
        onClick={() => showPopupHandler(mark)}
        xmlns="http://www.w3.org/2000/svg"
        id="Capa_1"
        viewBox="0 0 425.963 425.963"
        width="30px"
        height="30px"
        version="1.1"
      >
        <g>
          <path d="M 213.285 0 h -0.608 C 139.114 0 79.268 59.826 79.268 133.361 c 0 48.202 21.952 111.817 65.246 189.081 c 32.098 57.281 64.646 101.152 64.972 101.588 c 0.906 1.217 2.334 1.934 3.847 1.934 c 0.043 0 0.087 0 0.13 -0.002 c 1.561 -0.043 3.002 -0.842 3.868 -2.143 c 0.321 -0.486 32.637 -49.287 64.517 -108.976 c 43.03 -80.563 64.848 -141.624 64.848 -181.482 C 346.693 59.825 286.846 0 213.285 0 Z M 274.865 136.62 c 0 34.124 -27.761 61.884 -61.885 61.884 c -34.123 0 -61.884 -27.761 -61.884 -61.884 s 27.761 -61.884 61.884 -61.884 C 247.104 74.736 274.865 102.497 274.865 136.62 Z" />
        </g>
      </svg>
    </Marker>
  );
}

export default Mark;
