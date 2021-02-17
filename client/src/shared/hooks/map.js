import { useEffect, useReducer, useCallback } from "react";

import { utilsQueryFunctions } from "../utils/queries";

export function useMap() {
  const [viewport, dispatch] = useReducer(
    (state, action) => {
      switch (action.type) {
        // change lat and lng or zoom by moving on map

        case "VIEWPORT": {
          return {
            ...state,
            ...action.nextViewport
          };
        }

        // add new a marker with double click on map

        case "NEW_MARKER": {
          let marker;

          if (Array.isArray(action.marker)) {
            marker = action.marker;
          } else {
            marker = [action.marker];
          }

          return {
            ...state,
            markers: [...state.markers.filter(mark => !mark.isFormActive), ...marker]
          };
        }

        // remove preview marker on map

        case "REMOVE_MARKER": {
          return {
            ...state,
            markers: [
              ...state.markers.filter(mark => mark.isFormActive !== action.pullForm)
            ]
          };
        }

        // show or hide discription window

        case "SHOW_DESCRIPTION": {
          const findedIndex = state.markers.findIndex(
            mark => mark._id === action._id
          );

          if (findedIndex > -1) {
            let marker = state.markers[findedIndex];
            marker["isDescriptionActive"] = action.isDescriptionActive;
          }

          // set description false for remaning markers

          state.markers.forEach(mark => {
            if (mark._id !== action._id) {
              mark["isDescriptionActive"] = false;
            }
          });

          return {
            ...state,
            markers: [...state.markers]
          };
        }

        // change some property of currect form (like name, ...)

        case "CHANGE_CURRENT_MARKER": {
          return {
            ...state,
            markers: [
              ...state.markers.map(mark => {
                if (mark.isFormActive) {
                  mark[action.name] = action.value;
                }

                return mark;
              })
            ]
          };
        }

        // form validation

        case "FORM_VALIDATION": {
          return { ...state, formValidation: action.formValidation };
        }

        // set isLoading when data is sending to the server

        case "IS_LOADING": {
          return { ...state, isLoading: action.isLoading };
        }

        // check invalid type

        default: {
          throw new Error("type is not valid");
        }
      }
    },
    {
      width: "100vw",
      height: "100vh",
      latitude: 33.7577,
      longitude: 52.4376,
      zoom: 4,
      showPopup: false,
      markers: [],
      formValidation: false,
      isLoading: false
    }
  );

  // show spinner when data is sending to the server

  const isLoading = useCallback(show => {
    dispatch({ type: "IS_LOADING", isLoading: show });
  }, []);

  const fetchData = useCallback(
    async ({
      url = `https://map-clone.herokuapp.com/graphql`,
      method = "POST",
      body,
      headers = { "Content-Type": "application/json" }
    } = {}) => {
      try {
        isLoading(true);
        // send request to the server

        const response = await fetch(url, {
          method: method,
          body: body,
          headers: headers
        });

        const responseData = await response.json();

        // check response (rest api)

        if (!response.ok) {
          throw responseData.message;
        }

        // check response (graphql)

        if (responseData.errors) {
          throw responseData.errors[0].message;
        }

        isLoading(false);
        return responseData;
      } catch (error) {
        isLoading(false);
        throw error;
      }
    },
    [isLoading]
  );

  // get all markers form the server

  useEffect(() => {
    (async () => {
      const query = utilsQueryFunctions.getAllMarkersQuery.bind(utilsQueryFunctions);

      try {
        const response = await fetchData({ body: JSON.stringify(query()) });
        dispatch({ type: "NEW_MARKER", marker: response.data.getAllMarkers });
      } catch (error) {
        throw new Error(error);
      }
    })();
  }, [fetchData]);

  // send the current data to server

  const onSubmitHandler = useCallback(
    async e => {
      e.preventDefault();
      const currentTarget = e.currentTarget;

      // check form validation

      if (!currentTarget.checkValidity()) {
        e.stopPropagation();
        dispatch({ type: "FORM_VALIDATION", formValidation: true });
        return;
      }

      // if form was validated send data to the server

      try {
        // step (1): find the current form

        const currentMarker = viewport.markers.find(mark => mark.isFormActive);

        // step (2): send image with rest api
        // send image with FormData api

        const formData = new FormData();
        formData.append("image", currentMarker.image);

        const imageResponser = await fetchData({
          url: `https://map-clone.herokuapp.com/form/image`,
          body: formData,
          headers: {}
        });

        // step (3):  create query

        const query = utilsQueryFunctions.createNewMarkerQuery.bind(
          utilsQueryFunctions,
          { ...currentMarker, image: imageResponser.image }
        );

        // step (4): send rest data to the server with graphql

        const dataResponser = await fetchData({ body: JSON.stringify(query()) });
        dispatch({ type: "NEW_MARKER", marker: dataResponser.data.createNewPlace });

        // validation of form should be false

        dispatch({ type: "FORM_VALIDATION", formValidation: false });
      } catch (error) {
        throw new Error(error);
      }
    },
    [fetchData, viewport.markers]
  );

  // change lat and lng by moving

  const changeViewportHandler = nextViewport => {
    dispatch({ type: "VIEWPORT", nextViewport });
  };

  // double click on map to show form

  const doubleClickOnMapHandler = e => {
    const [lng, lat] = e.lngLat;
    const currentForm = viewport.markers.find(mark => mark.isFormActive);

    dispatch({
      type: "NEW_MARKER",
      marker: {
        name: currentForm?.name || "",
        comment: currentForm?.comment || "",
        image: currentForm?.image || null,
        lat: +lat.toFixed(4),
        lng: +lng.toFixed(4),
        isFormActive: true,
        isMarkerActive: true,
        selectedPicture: currentForm?.selectedPicture || ""
      }
    });
  };

  // show or hide popup

  const showPopupHandler = useCallback(
    ({ isFormActive, isDescriptionActive, _id }) => {
      // if there was form window, show or hide it

      if (isFormActive) {
        dispatch({ type: "REMOVE_MARKER", pullForm: isFormActive });
      }

      // if there was description window, show or hide it

      if (!isFormActive && (!isDescriptionActive || isDescriptionActive)) {
        dispatch({
          type: "SHOW_DESCRIPTION",
          isDescriptionActive: !isDescriptionActive
            ? !isDescriptionActive
            : !isDescriptionActive,
          _id
        });
      }
    },
    []
  );

  // change inupt value

  const onChnageInpusHandler = useCallback(
    e => {
      // find the form that has a picture

      const currentForm = viewport.markers.find(
        mark => mark.isFormActive && mark.selectedPicture
      );

      // if there is the form with the prior image so,
      // remove the image and set the new image

      if (currentForm && e.target.name === "image") {
        delete currentForm.selectedPicture;
        currentForm.image = null;
      }

      dispatch({
        type: "CHANGE_CURRENT_MARKER",
        name: e.target.name,
        value:
          e.target.name === "image" && e.target.files.length === 1
            ? e.target.files[0]
            : e.target.value
      });
    },
    [viewport.markers]
  );

  // show the selected picture on form

  useEffect(() => {
    let isImageSet = viewport.markers.find(
      mark => mark.isFormActive && !mark.selectedPicture
    );

    // check if image selected on form

    if (isImageSet && isImageSet.image instanceof File) {
      // then read the currect pic on form

      const fileReader = new FileReader();

      fileReader.onload = () => {
        dispatch({
          type: "NEW_MARKER",
          marker: { ...isImageSet, selectedPicture: fileReader.result }
        });
      };

      fileReader.readAsDataURL(isImageSet.image);
    }
  }, [viewport.markers, onChnageInpusHandler]);

  return {
    viewport,
    onSubmitHandler,
    changeViewportHandler,
    onChnageInpusHandler,
    showPopupHandler,
    doubleClickOnMapHandler
  };
}
