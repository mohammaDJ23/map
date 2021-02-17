import React from "react";
import { CardDeck, Card } from "react-bootstrap";

function Crd({ image, name, comment, date }) {
  return (
    <CardDeck style={{ width: "18rem", marginTop: "20px" }}>
      <Card>
        <div style={{ height: "200px" }}>
          <Card.Img
            style={{ objectFit: "cover", width: "100%", height: "100%" }}
            variant="top"
            src={`https://map-clone.herokuapp.com/${image}`}
          />
        </div>

        <Card.Body>
          <Card.Title>{name}</Card.Title>
          <Card.Text>{comment}</Card.Text>
        </Card.Body>

        <Card.Footer>
          <small className="text-muted">{date}</small>
        </Card.Footer>
      </Card>
    </CardDeck>
  );
}

export default Crd;
