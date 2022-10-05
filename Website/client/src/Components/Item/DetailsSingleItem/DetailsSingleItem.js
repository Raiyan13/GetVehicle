import React from 'react';
import { Row, Col, Image, Tabs, Tab, Card, ListGroup } from 'react-bootstrap';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './DetailsSingleItem.css';
import VehicleDatalistItem from '../VehicleDatalistItem';

const DetailsSingleItem = ({ data }) => {
  let coverImages = ['/templateBike.jpg', '/templateCar.jpg'];

  return (
    <Row className="p-3">
      <Col md={7}>
        <div className="mt-3">
          {data?.photo && data?.photo.length ? (
            <Carousel showArrows={true} showThumbs={false} autoPlay infiniteLoop>
              {data?.photo.map((photo, idx) => (
                <img src={photo} key={idx} />
              ))}
            </Carousel>
          ) : (
            <Image
              src={
                data?.categories?.category == 'Bike'
                  ? '/templateBike.jpg'
                  : '/templateCar.jpg'
              }
              alt="Card image cap"
              fluid
            />
          )}
        </div>

        <Tabs
          defaultActiveKey="description"
          id="uncontrolled-tab-example"
          className="mb-3"
        >
          <Tab eventKey="description" title="Description">
            Description
          </Tab>
          <Tab eventKey="more" title="More">
            More
          </Tab>
        </Tabs>
      </Col>

      <Col md={5}>
        <h1>{data?.model}</h1>

        <Card id="itemDetailsCard">
          <Card.Body>
            <Card.Text>
              <VehicleDatalistItem data={data} />
            </Card.Text>
          </Card.Body>

          <ListGroup className="list-group-flush">
            <ListGroup.Item>
              <>
                <Card.Link href="#">Book now</Card.Link>
                <Card.Link href="#">Rate now</Card.Link>
              </>
            </ListGroup.Item>
          </ListGroup>
        </Card>
      </Col>
    </Row>
  );
};

export default DetailsSingleItem;
