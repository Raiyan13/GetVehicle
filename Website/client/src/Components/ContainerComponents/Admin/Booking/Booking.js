import React, { useEffect, useState } from 'react';
import { Button, Container, Image } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { googleLogin } from '../../../../Services/GoogleAuthService';
import { getVehicleDetails } from '../../../../Services/VehicleDataService';
import AskForLoginModal from '../../../Modal/AskForLoginModal';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './Booking.css';
import DocumentDetailsModal from '../../../Modal/DocumentDetailsModal';
import BookedSchedulesModal from '../../../Modal/BookedSchedulesModal';
import { getBookingDetailsByVehicleId } from '../../../../Services/BookingDataService';

const Booking = () => {
  const user = useSelector((state) => state.userReducer);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showDocumentDetailsModal, setShowDocumentDetailsModal] = useState(false);
  const [showBookedSchedulesModal, setShowBookedSchedulesModal] = useState(false);
  const [acknowledgement, setAcknowledgement] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('+880 ');
  const [dayDifference, setDayDifference] = useState(1);
  const [totalPayableAmount, setTotalPayableAmount] = useState(0);
  

  const { id } = useParams();

  const dispatch = useDispatch();
  const vehicleDetails = useSelector((state) => state.vehicleDetailsReducer);
  const { loading, error, vehicle } = vehicleDetails;
  const vehicleData = vehicle && vehicle.data;

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(null);

  useEffect(()=>{
    setShowLoginModal(user == null ? true: false);
  }, user);

  useEffect(()=>{
    setTotalPayableAmount(vehicleData?.costPerDay)
  }, vehicleData);

  useEffect(() => {
    dispatch(getVehicleDetails(id));
  }, [dispatch, id]);
  

  const getDate = (date) => {
    return new Date(date).toDateString();
  }

  const getSanitizedBookingDates = (bookingDetails) => {
    let sanitizedBookingDates = [];
    bookingDetails.forEach(bookingDetail => {
      if(bookingDetail.vehicleId === id && new Date(bookingDetail?.receiveDate) >= new Date()) {
          sanitizedBookingDates.push({
          handOverDate: getDate(bookingDetail?.handOverDate),
          receiveDate: getDate(bookingDetail?.receiveDate)
        });
      }
      
    });
    return sanitizedBookingDates;
  }

  const scheduledBookings = getSanitizedBookingDates(getBookingDetailsByVehicleId(""));

  const getDayDifferenceFromDate = (startDate, endDate) => {
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays+1;
  }

  const onDateChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    let currentDayDifference = getDayDifferenceFromDate(start, end);
    setDayDifference(currentDayDifference);
    setTotalPayableAmount(vehicleData?.costPerDay * currentDayDifference);
  };


  const handleLoginModalClose = () => {
    setShowLoginModal(false);
  };

  const startGoogleLoginProcess = () => {
    googleLogin(dispatch);
    handleLoginModalClose();
  };

  const checkAndSetPhoneNumber = (e) => {
    let phoneNumberInput = e.target.value;
    if (phoneNumberInput.length <= 4) return;
    setPhoneNumber(e.target.value);
  };

  return (
    <Container fluid>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>
          <div className="booking-container">
            <div className="left-container">
              {user && (
                <div className="user-details enhance-div">
                  <div className="field-bottom-margin-x-lg">
                    <span className="enhanced-label">Delivery To</span>
                    <span>{user.name}</span>
                  </div>
                  <div className="email">
                    <span className="enhanced-label">Email</span>
                    <span>{user.email}</span>
                  </div>
                  <div className="phone-number field-bottom-margin-semi-lg">
                    <span className="phone-number-label enhanced-label">
                      Phone
                    </span>
                    <input
                      className="form-control phone-number-input form-control-sm"
                      required
                      value={phoneNumber}
                      onChange={checkAndSetPhoneNumber}
                    ></input>
                    <span className="text-danger required-text">Required</span>
                  </div>
                  <div className="field-bottom-margin-lg">
                    <span className="enhanced-label">Required Documents</span>
                    <span>You have to submit these
                      <Button onClick={()=>setShowDocumentDetailsModal(true)} style={{border:'none'}} variant='outline-info'>Documents</Button>
                      to get the vehicle.
                    </span>
                  </div>
                  <div className="acknowledgement-div">
                    <span className="enhanced-label acknowledgement-label">Acknowledgement</span>
                    <span className="acknowledgement-text">I know which documents I need to submit</span>
                    <Form.Check checked={acknowledgement} onChange={()=>setAcknowledgement(!acknowledgement)} aria-label="acknowledge"/>
                    <span className="text-danger required-text">Required</span>
                  </div>
                </div>
              )}

              {vehicleData && (
                <div className="vehicle-details enhance-div">
                  <div className="vehicle-image enhance-div">
                    <Image
                      id="vehicle-image"
                      src={
                        vehicleData.photo.length
                          ? vehicleData.photo[0]
                          : vehicleData?.category?.name === 'Bike'
                          ? '/templateBike.jpg'
                          : '/templateCar.jpg'
                      }
                      alt="Vehicle Image"
                      key="vehicle-image"
                      fluid
                    />
                  </div>
                  <div className="vehicle-info">
                    <div className="vehicle-info-title enhance-div vehicle-info-items">
                      <span className="vehicle-model">{vehicleData.model}</span>
                      <span className="field-bottom-margin vehicle-category">
                        {vehicleData.subCategory.name}{' '}
                        {vehicleData.category.name}
                      </span>
                    </div>
                    <span className="field-bottom-margin vehicle-info-items enhance-div">
                      <img src="/money-icon.png" alt=''/> Cost Per Day:{' '}
                      {vehicleData.costPerDay}
                    </span>
                    <div className="vehicle-info-items enhance-div">
                      <span>
                        You can pick up your vehicle from{' '}
                        <img src="/location-icon.png" alt=''/>{' '}
                        {vehicleData.currentLocationString}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="booking-info enhance-div">
              <div className='date-related-buttons'>
                 <span className="field-bottom-margin enhanced-label select-date-label">Select Date</span>
                 <Button onClick={()=>setShowBookedSchedulesModal(true)} size='sm' variant='outline-info' style={{border:'none'}} className='check-booked-date-button'>Check Booked Dates</Button>
              </div>
             
              <div className="date-picker-container field-bottom-margin-x-lg">
                <DatePicker
                  selected={startDate}
                  onChange={onDateChange}
                  startDate={startDate}
                  endDate={endDate}
                  selectsRange
                  inline
                />
              </div>
              <div className="field-bottom-margin-x-lg">
                <span className="field-bottom-margin enhanced-label">Total Cost</span>
                <span>{vehicleData?.costPerDay} * {dayDifference} = </span>
                <span className='total-cost-amount enhance-div'>{totalPayableAmount} Taka</span>
              </div>
              <div className='button-container-div'>
                <Button size='sm' variant='outline-success' className='w-100'>Make Payment</Button>
              </div>
            </div>
          </div>
          <AskForLoginModal
            show={showLoginModal}
            handleClose={handleLoginModalClose}
            startGoogleLoginProcess={startGoogleLoginProcess}
            acknowledgement={acknowledgement}
            setAcknowledgement={()=>setAcknowledgement}
          ></AskForLoginModal>
          <DocumentDetailsModal
            show={showDocumentDetailsModal}
            handleClose={()=>setShowDocumentDetailsModal(false)}
          ></DocumentDetailsModal>
          <BookedSchedulesModal
            show={showBookedSchedulesModal}
            handleClose={()=>setShowBookedSchedulesModal(false)}
            scheduledBookings={scheduledBookings}
          ></BookedSchedulesModal>
        </>
      )}
    </Container>
  );
};

export default Booking;