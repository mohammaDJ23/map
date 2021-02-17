import React from "react";
import { Form, Button, Card } from "react-bootstrap";

function Frm({
  formValidation,
  onSubmitHandler,
  onChnageInpusHandler,
  isLoading,
  selectedPicture,
  nameInputRef
}) {
  return (
    <Form
      noValidate
      validated={formValidation}
      onSubmit={onSubmitHandler}
      style={{ width: "18rem" }}
    >
      <Form.Group controlId="validationCustom01">
        <Form.Label>Name</Form.Label>

        <Form.Control
          ref={nameInputRef}
          required
          onChange={onChnageInpusHandler}
          minLength={3}
          maxLength={30}
          size="sm"
          type="text"
          name="name"
          placeholder="Enter your name"
        />
      </Form.Group>

      <Form.Group controlId="validationCustom02">
        <Form.Label>Comment</Form.Label>

        <Form.Control
          required
          onChange={onChnageInpusHandler}
          minLength={10}
          maxLength={150}
          size="sm"
          type="text"
          name="comment"
          placeholder="Enter your comment"
        />
      </Form.Group>

      <Form.File
        required
        onChange={onChnageInpusHandler}
        name="image"
        id="exampleFormControlFile1"
        label="Pick an image"
      />

      <Card.Img
        variant="top"
        src={selectedPicture}
        className="m-bt-10"
        object-fit="cover"
      />

      <div className="d-flex align-items-center">
        {!isLoading ? (
          <Button variant="primary" type="submit" size="sm">
            Submit
          </Button>
        ) : (
          <Button className="btn btn-primary" type="button" disabled>
            <span
              className="spinner-border spinner-border-sm mr-10"
              role="status"
              aria-hidden="true"
            ></span>
            Loading...
          </Button>
        )}
      </div>
    </Form>
  );
}

export default Frm;
