/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable no-console */
/* eslint-disable consistent-return */
/* eslint-disable no-restricted-syntax */
/* eslint-disable import/no-unresolved */
/* eslint-disable import/order */
/* eslint-disable import/no-webpack-loader-syntax */
/* eslint-disable no-shadow */
/* eslint-disable react/function-component-definition */
import {
  useLayoutEffect,
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";

// sito components
import SitoContainer from "sito-container";

// styles
import "./style.css";

// react-map-gl
// eslint-disable-next-line no-unused-vars
import "mapbox-gl/dist/mapbox-gl.css";

import mapboxgl from "!mapbox-gl";

// prop types
import PropTypes from "prop-types";

// @mui components
import { Box, Button, TextField } from "@mui/material";

// @mui icons
import MapIcon from "@mui/icons-material/Map";

// contexts
import { useLanguage } from "../../context/LanguageProvider";

// images
import pointImage from "../../assets/images/point.webp";
import config from "../../config";

const Map = (props) => {
  const {
    width,
    height,
    point,
    points,
    lng,
    lat,
    onChange,
    onChangeLng,
    onChangeLat,
    noButton,
    noInputs,
    onSave,
  } = props;

  const { languageState } = useLanguage();

  const [apiMap, setApiMap] = useState("");

  const mapContainer = useRef(null);
  const map = useRef(null);

  const [zoom, setZoom] = useState(15);

  const [showMap, setShowMap] = useState(true);

  const init = async () => {
    try {
      setApiMap(config.mapBoxAPI);
    } catch (e) {
      console.error(e);
    }
  };

  useLayoutEffect(() => {
    init();
  }, []);

  const flyToPoint = (currentFeature) => {
    map.current.flyTo({
      center: currentFeature.geometry
        ? currentFeature.geometry.coordinates
        : currentFeature,
      zoom: 20,
    });
  };

  const createPopUp = (currentFeature) => {
    const popUps = document.getElementsByClassName("mapboxgl-popup");
    // Check if there is already a popup on the map and if so, remove it
    if (popUps[0]) popUps[0].remove();

    const { name, id, type, headerImages, description } =
      currentFeature.properties;

    // eslint-disable-next-line no-unused-vars
    new mapboxgl.Popup({ closeOnClick: true })
      .setLngLat(currentFeature.geometry.coordinates)
      .setHTML(
        `<img src=${
          headerImages && headerImages[0] ? headerImages[0].url : ""
        } alt="place-image"/>` +
          `<div class="popup-content">` +
          `<h3 class="title">${name}</h3>` +
          `<p>${description}</p>` +
          `<h3><a href="${process.env.PUBLIC_URL}/details:${id}-${type}">${languageState.texts.Home.SeeGrave}</a></h3></div>`
      )
      .addTo(map.current);
  };

  const addMarkers = () => {
    if (points.length) {
      // For each feature in the GeoJSON object above:
      for (const marker of points.features) {
        // Create a div element for the marker.
        const el = document.createElement("div");
        // Assign a unique `id` to the marker.
        el.id = `marker-${marker.properties.id}`;
        // Assign the `marker` class to each marker for styling.
        el.className = "marker";
        el.style.backgroundImage = `url('${
          /* marker.type === "graves" ? */ pointImage /*: types[marker.type] */
        }')`;

        el.addEventListener("click", (e) => {
          // Fly to the point
          flyToPoint(marker);
          // Close all other popups and display popup for clicked store
          createPopUp(marker);
          // Highlight listing in sidebar
          const activeItem = document.getElementsByClassName("active");
          e.stopPropagation();
          if (activeItem[0]) activeItem[0].classList.remove("active");
        });
        new mapboxgl.Marker(el, { offset: [0, -23] })
          .setLngLat(marker.geometry.coordinates)
          .addTo(map.current);
      }
    }
    /* if (point) {
    } */
  };

  const createPoint = useCallback(
    (event) => {
      if (map.current) {
        const markerOld = document.getElementsByClassName("marker");
        // Check if there is already a popup on the map and if so, remove it
        if (markerOld[0]) markerOld[0].remove();
        const el = document.createElement("div");
        el.className = "marker";
        el.style.backgroundImage = `url('${pointImage}')`;
        el.id = `marker-${event.lngLat.wrap()}`;
        const { lng, lat } = event.lngLat.wrap();
        onChangeLng(lng);
        onChangeLat(lat);

        /* const marker = new mapboxgl.Marker(el);
      marker.setLngLat([lng, lat]).addTo(map.current); */
        new mapboxgl.Marker(el, { offset: [0, -23] })
          .setLngLat([lng, lat])
          .addTo(map.current);
        /* Fly to the point */
        flyToPoint([lng, lat]);
      }
    },
    [onChangeLng, onChangeLat, flyToPoint]
  );

  useEffect(() => {
    if (apiMap === "") return;
    mapboxgl.accessToken = apiMap;
    if (map.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [lng, lat],
      zoom,
    });
    const geocoder = new MapboxGeocoder({
      // Initialize the geocoder
      countries: "cu",
      accessToken: apiMap, // Set the access token
      mapboxgl, // Set the mapbox-gl instance
      zoom, // Set the zoom level for geocoding results
      placeholder: languageState.texts.Map.Placeholder, // This placeholder text will display in the search bar
      /*  bbox: [-105.116, 39.679, -104.898, 39.837], */ // Set a bounding box
    });
    // Add the geocoder to the map
    map.current.addControl(geocoder, "top-right");
    // Add the search box to the top left

    geocoder.on("result", async (event) => {
      // When the geocoder returns a result
      const point = event.result.center;
      const [lat, lng] = point;
      onChangeLng(lng);
      onChangeLat(lat);

      /*  const marker = new mapboxgl.Marker(el);
      marker.setLngLat([lng, lat]).addTo(map.current);  */ // Add the marker to the map at the result coordinates
    });

    /* map.current.on("move", () => {
      setZoom(map.current.getZoom().toFixed(2));
      onChangeLng(map.current.getCenter().lng);
      onChangeLat(map.current.getCenter().lat);
    }); */

    map.current.on("click", createPoint);

    if (point !== "")
      createPoint({
        lngLat: {
          wrap: () => ({ lng: point.lng, lat: point.lat }),
        },
      });

    /* if (lat && lng && map && map.current && map.current.getSource("single-point")) {
      console.log(map.current.getSource("single-point"));
      map.current.getSource("single-point").setData({ coordinates: [lng, lat], type: "Point" });
      flyToPoint({ geometry: { coordinates: [lng, lat] }* });
    } */
  });

  return (
    <Box
      sx={{
        width,
        flex: 1,
        transition: "transform 500ms ease",
      }}
    >
      {!noInputs && (lng || lat) && (
        <SitoContainer ignoreDefault className="row">
          <SitoContainer alignItems="center" sx={{ marginBottom: "20px" }}>
            <TextField
              label={languageState.texts.Map.Inputs.Longitude.label}
              placeholder={languageState.texts.Map.Inputs.Longitude.placeholder}
              type="text"
              name="lng"
              id="lng"
              value={lng}
              sx={{ marginRight: "20px" }}
              onChange={onChangeLng}
            />
            <TextField
              label={languageState.texts.Map.Inputs.Latitude.label}
              placeholder={languageState.texts.Map.Inputs.Latitude.placeholder}
              type="text"
              name="lat"
              id="lat"
              value={lat}
              sx={{ marginRight: "20px" }}
              onChange={onChangeLat}
            />
            {!noButton && (
              <Button
                sx={{
                  minWidth: 0,
                  padding: "10px",
                  borderRadius: "100%",
                  marginBottom: "10px",
                }}
                variant={showMap ? "contained" : "outlined"}
                onClick={() => setShowMap(!showMap)}
              >
                <MapIcon />
              </Button>
            )}

            {onSave ? (
              <Button
                type="button"
                color="primary"
                variant="contained"
                onClick={onSave}
              >
                {languageState.texts.Map.Save}
              </Button>
            ) : null}
          </SitoContainer>
        </SitoContainer>
      )}

      <Box
        sx={{
          width,
          height,
          position: !showMap ? "fixed" : "relative",
          opacity: !showMap ? 0 : 1,
          zIndex: !showMap ? -1 : 1,
        }}
      >
        {/*  <Box
          className="sidebar"
          sx={{
            backgroundColor: "rgba(35, 55, 75, 0.9)",
            color: "#fff",
            padding: "6px 12px",
            fontFamily: "monospace",
            zIndex: 1,
            position: "absolute",
            top: 0,
            left: 0,
            margin: "12px",
            borderRadius: "4px",
          }}
        >
          Longitude: {Math.round(localLng * 100000) / 100000} | Latitude:
          {Math.round(localLat * 100000) / 100000} | Zoom: {zoom}
        </Box> */}

        <Box
          ref={mapContainer}
          className="map-container"
          /* onMapClick={(f) => f} */
          sx={{
            width,
            height,
            borderRadius: "1rem",
          }}
        />
      </Box>
    </Box>
  );
};

Map.defaultProps = {
  width: "100%",
  height: "500px",
  point: [],
  points: [],
  lng: -75.82956791534245,
  lat: 20.022421136021567,
  onMapClick: undefined,
  onChange: undefined,
  onChangeLng: undefined,
  onChangeLat: undefined,
  noButton: false,
  noGeocoder: false,
  noInputs: false,
  onSave: undefined,
};

Map.propTypes = {
  width: PropTypes.string,
  height: PropTypes.string,
  point: PropTypes.array,
  points: PropTypes.array,
  onMapClick: PropTypes.func,
  lng: PropTypes.number,
  lat: PropTypes.number,
  onChange: PropTypes.func,
  onChangeLng: PropTypes.func,
  onChangeLat: PropTypes.func,
  noButton: PropTypes.bool,
  noGeocoder: PropTypes.bool,
  noInputs: PropTypes.bool,
  onSave: PropTypes.func,
};

export default Map;
