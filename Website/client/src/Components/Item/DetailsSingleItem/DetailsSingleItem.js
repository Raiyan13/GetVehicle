import React from 'react';
import { Row, Col, Image, Tabs, Tab, Card, ListGroup } from 'react-bootstrap';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './DetailsSingleItem.css';
import Rating from 'react-star-ratings';
import VehicleDatalistItem from '../VehicleDatalistItem';
import { TabsConstants } from '../../../Constants/CommonConstants';
import { Link } from 'react-router-dom';
import RatingModal from '../../Modal/RatingModal';

const DetailsSingleItem = ({ data, onClickStar, star }) => {
  return (
    <>
      <Row className="p-2">
        <Col md={7}>
        <h4>Details of {data?.model}</h4>
          <div className="mt-3">
            {data?.photo && data?.photo.length ? (
              <Carousel
                showArrows={true}
                showThumbs={false}
                autoPlay
                infiniteLoop
              >
                {data?.photo.map((photo, idx) => (
                  <Image
                    id="CarouselImage"
                    src={photo}
                    alt="Card image cap"
                    key={idx}
                    fluid
                  />
                ))}
              </Carousel>
            ) : (
              <Image
                id="CarouselImage"
                src={
                  data?.category?.name === 'Bike'
                    ? '/templateBike.jpg'
                    : '/templateCar.jpg'
                }
                alt="Card image cap"
                fluid
              />
            )}
          </div>
        </Col>

        <Col md={5}>
          <Card id="itemDetailsCard">
            <Card.Body>
              <Card.Text>
                <VehicleDatalistItem data={data} />
              </Card.Text>
            </Card.Body>

            <ListGroup className="list-group-flush">
              <ListGroup.Item>
                <div className="d-flex justify-content-around">
                  <RatingModal>
                    <Rating
                      name={data?._id}
                      numberOfStars={5}
                      rating={star}
                      isSelectable={true}
                      starRatedColor="#ffd700"
                      starHoverColor="#ffd700"
                      changeRating={onClickStar}
                    />
                  </RatingModal>

                  <Link to={'/booking/' + data?._id}>Book Now</Link>
                </div>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default DetailsSingleItem;
