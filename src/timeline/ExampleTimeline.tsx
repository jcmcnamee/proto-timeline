import React, { useState } from 'react';
import styled from 'styled-components';

const Card = styled.div`
  padding: 1rem;
  width: 100%;
  max-width: 72rem;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
`;

const TimelineHeader = styled.div`
  margin-bottom: 1rem;
  font-weight: bold;
  font-size: 1.125rem;
`;

const TimelineContainer = styled.div`
  display: flex;
`;

const ResourceColumn = styled.div`
  width: 8rem;
  flex-shrink: 0;
`;

const TimelineGrid = styled.div`
  flex: 1;
  position: relative;
`;

const TimeSlotHeader = styled.div`
  display: flex;
  border-bottom: 1px solid #e5e7eb;
`;

const TimeSlotHeaderItem = styled.div`
  width: 100px;
  text-align: center;
`;

const ResourceRow = styled.div`
  display: flex;
  border-bottom: 1px solid #e5e7eb;
`;

const ResourceLabel = styled.div`
  width: 8rem;
  padding: 0.5rem;
  flex-shrink: 0;
`;

const TimelineCell = styled.div`
  position: absolute;
  height: 100%;
  width: 100px;
  border-right: 1px solid #e5e7eb;
`;

const BookingBlock = styled.div`
  position: absolute;
  height: 3rem;
  margin-top: 0.5rem;
  background-color: #3b82f6;
  color: white;
  border-radius: 0.25rem;
  padding: 0.25rem 0.5rem;
  cursor: move;
`;

const ExampleTime = () => {
  const [bookings, setBookings] = useState([
    { id: 1, title: 'Meeting A', start: 9, duration: 2, resource: 'Room 1' },
    { id: 2, title: 'Workshop', start: 14, duration: 3, resource: 'Room 2' },
  ]);

  const [draggedBooking, setDraggedBooking] = useState(null);

  const timeSlots = Array.from({ length: 11 }, (_, i) => i + 8);
  const resources = ['Room 1', 'Room 2', 'Room 3'];

  const getPosition = time => {
    return (time - 8) * 100 + 'px';
  };

  const getWidth = duration => {
    return duration * 100 + 'px';
  };

  const handleDragStart = booking => {
    setDraggedBooking(booking);
  };

  const handleDragOver = e => {
    e.preventDefault();
  };

  const handleDrop = (e, resource, time) => {
    e.preventDefault();
    if (draggedBooking) {
      const updatedBookings = bookings.map(booking => {
        if (booking.id === draggedBooking.id) {
          return { ...booking, resource, start: time };
        }
        return booking;
      });
      setBookings(updatedBookings);
      setDraggedBooking(null);
    }
  };

  return (
    <Card>
      <TimelineHeader>ExampleTime Booking Interface</TimelineHeader>

      <TimelineContainer>
        <ResourceColumn>Resources</ResourceColumn>
        <TimelineGrid>
          <TimeSlotHeader>
            {timeSlots.map(time => (
              <TimeSlotHeaderItem key={time}>{time}:00</TimeSlotHeaderItem>
            ))}
          </TimeSlotHeader>
        </TimelineGrid>
      </TimelineContainer>

      <div>
        {resources.map(resource => (
          <ResourceRow key={resource}>
            <ResourceLabel>{resource}</ResourceLabel>
            <TimelineGrid>
              {timeSlots.map(time => (
                <TimelineCell
                  key={time}
                  style={{ left: getPosition(time) }}
                  onDragOver={handleDragOver}
                  onDrop={e => handleDrop(e, resource, time)}
                />
              ))}

              {bookings
                .filter(booking => booking.resource === resource)
                .map(booking => (
                  <BookingBlock
                    key={booking.id}
                    style={{
                      left: getPosition(booking.start),
                      width: getWidth(booking.duration),
                    }}
                    draggable
                    onDragStart={() => handleDragStart(booking)}>
                    {booking.title}
                  </BookingBlock>
                ))}
            </TimelineGrid>
          </ResourceRow>
        ))}
      </div>
    </Card>
  );
};

export default ExampleTime;
