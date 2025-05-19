import { flowerImageOptions } from './Options';

export function BookCard({ book, onClick }) {
  return (
    <div
      className="relative w-18 h-40 text-white p-2 mt-4 rounded shadow cursor-pointer hover:scale-103 transition flex flex-col justify-end"
      style={{ background: book.colour }}
      onClick={onClick}
    >
      {/* Image overlay */}
      {book.image && (
        <img
          src={book.image}
          className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none"
        />
      )}
      {/* Title text */}
      <div className="relative text-sm font-bold h-full w-35" style={{ rotate: '-90deg' }}>
        {book.title}
      </div>
    </div>
  );
}
  