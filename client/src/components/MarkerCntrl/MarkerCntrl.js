import React, { memo } from "react";
import { Popup } from "react-map-gl";

import Mark from "./Mark/Mark";
import Form from "./Form/Form";
import Card from "./Card/Card";

function MarkerCntrl({
  showPopupHandler,
  onSubmitHandler,
  onChnageInpusHandler,
  viewport,
  formValidation,
  isLoading,
  nameInputRef
}) {
  return viewport.map((mark, index) => (
    <React.Fragment key={index}>
      {mark.isMarkerActive && (
        <Mark mark={mark} showPopupHandler={showPopupHandler} />
      )}

      {(mark.isFormActive || mark.isDescriptionActive) && (
        <Popup
          latitude={mark.lat}
          longitude={mark.lng}
          closeButton={true}
          closeOnClick={false}
          className={`${mark.isDescriptionActive && "m-top-30"} z-1000 over-h`}
          onClose={() => showPopupHandler(mark)}
        >
          {mark.isFormActive && mark.isMarkerActive && (
            <Form
              onSubmitHandler={onSubmitHandler}
              onChnageInpusHandler={onChnageInpusHandler}
              formValidation={formValidation}
              isLoading={isLoading}
              nameInputRef={nameInputRef}
              selectedPicture={mark.selectedPicture}
            />
          )}

          {mark.isMarkerActive && mark.isDescriptionActive && (
            <Card
              name={mark.name}
              comment={mark.comment}
              image={mark.image}
              date={mark.date}
            />
          )}
        </Popup>
      )}
    </React.Fragment>
  ));
}

export default memo(MarkerCntrl);
