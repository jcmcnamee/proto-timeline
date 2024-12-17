import React, { useState } from 'react';
import styled from 'styled-components';

const TimelineContainer = styled.div`
  display: grid;
  grid-template-columns: 100px repeat(11, 1fr);
  grid-auto-rows: 64px;
  gap: 4px;
  max-width: 1200px;
  margin: 0 auto;
`;

const ResourceLabel = styled.div`
  grid-column: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  border: 1px solid #e0e0e0;
`;

const TimelineGrid = styled.div`
  grid-column: 2 / -1;
  display: grid;
  grid-template-columns: repeat(11, 1fr);
  position: relative;
`;

const TimeSlot = styled.div`
  border: 1px solid #e0e0e0;
  grid-row: 1;
`;

const BookingBlock = styled.div`
  grid-column-start: ${props => props.start - 7};
  grid-column-end: ${props => props.start - 7 + props.duration};
  grid-row: 1;

  background-color: ${props => props.color || '#3b82f6'};
  color: white;
  border-radius: 4px;
  padding: 8px;
  cursor: move;

  display: flex;
  align-items: center;
  justify-content: center;

  z-index: ${props => props.zIndex || 1};

  &:hover {
    opacity: 0.8;
  }
`;

const ExampleTimelineB = () => {
  const [bookings, setBookings] = useState([
    {
      id: 1,
      title: 'Meeting A',
      start: 9,
      duration: 2,
      resource: 'Room 1',
      color: '#3b82f6',
    },
    {
      id: 2,
      title: 'Workshop',
      start: 10,
      duration: 3,
      resource: 'Room 1',
      color: '#10b981',
    },
    {
      id: 3,
      title: 'Training',
      start: 9,
      duration: 2,
      resource: 'Room 2',
      color: '#f43f5e',
    },
  ]);

  const [draggedBooking, setDraggedBooking] = useState(null);

  // Compute overlapping bookings
  const computeBookingLayers = resourceBookings => {
    const sortedBookings = [...resourceBookings].sort(
      (a, b) => a.start - b.start
    );
    const layers = [];

    return sortedBookings.map(booking => {
      let layer = layers.findIndex(
        layerBookings =>
          !layerBookings.some(
            existingBooking =>
              !(
                booking.start >=
                  existingBooking.start + existingBooking.duration ||
                booking.start + booking.duration <= existingBooking.start
              )
          )
      );

      if (layer === -1) {
        layer = layers.length;
        layers.push([]);
      }

      layers[layer].push(booking);

      return {
        ...booking,
        zIndex: layer + 1,
      };
    });
  };

  const handleDragStart = (e, booking) => {
    setDraggedBooking(booking);
    e.dataTransfer.setData('text/plain', ''); // Required for Firefox
  };

  const handleDragOver = e => {
    e.preventDefault();
  };

  const handleDrop = (e, resource) => {
    e.preventDefault();
    if (!draggedBooking) return;

    // Extract column from drop location
    const grid = e.currentTarget;
    const rect = grid.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const columnWidth = rect.width / 11;
    const startColumn = Math.floor(x / columnWidth);

    // Convert column to time
    const newStart = startColumn + 8;

    const updatedBookings = bookings.map(booking =>
      booking.id === draggedBooking.id
        ? { ...booking, start: newStart, resource }
        : booking
    );

    setBookings(updatedBookings);
    setDraggedBooking(null);
  };

  return (
    <TimelineContainer>
      {['Room 1', 'Room 2', 'Room 3'].map(resource => (
        <React.Fragment key={resource}>
          <ResourceLabel>{resource}</ResourceLabel>
          <TimelineGrid
            onDragOver={handleDragOver}
            onDrop={e => handleDrop(e, resource)}>
            {/* Time slots */}
            {Array.from({ length: 11 }, (_, i) => i + 8).map(time => (
              <TimeSlot key={time} style={{ gridColumn: time - 7 }} />
            ))}

            {/* Bookings for this resource */}
            {computeBookingLayers(
              bookings.filter(booking => booking.resource === resource)
            ).map(booking => (
              <BookingBlock
                key={booking.id}
                start={booking.start}
                duration={booking.duration}
                zIndex={booking.zIndex}
                color={booking.color}
                draggable
                onDragStart={e => handleDragStart(e, booking)}>
                {booking.title}
              </BookingBlock>
            ))}
          </TimelineGrid>
        </React.Fragment>
      ))}
    </TimelineContainer>
  );
};

export default ExampleTimelineB;
