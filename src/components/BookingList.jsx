import BookingListItem from "./BookingListItem";

export default function BookingList({ bookings, setBookings, trainers }) {
  return (
    <>
      {bookings.map((row) => (
        <BookingListItem
          key={row.id}
          row={row}
          setBookings={setBookings}
          trainers={trainers}
        />
      ))}
    </>
  );
}
