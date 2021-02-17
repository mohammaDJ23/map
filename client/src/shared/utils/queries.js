export const utilsQueryFunctions = {
  getAllMarkersQuery() {
    return {
      query: `
        query {
          getAllMarkers {
            _id
            name
            comment
            image
            date
            lat
            lng
            isDescriptionActive
            isMarkerActive
          }
        }
      `
    };
  },

  createNewMarkerQuery({ name, comment, image, lat, lng }) {
    return {
      query: `
        mutation typeOfData($name: String!, $comment: String!, $image: String!, $lat: Float!, $lng: Float!) {
          createNewPlace(inputs: {name: $name, comment: $comment, image: $image, lat: $lat, lng: $lng}) {
            _id
            name
            comment
            image
            date
            lat
            lng
            isDescriptionActive
            isMarkerActive
          }
        }
      `,
      variables: {
        name,
        comment,
        image,
        lat,
        lng
      }
    };
  }
};
