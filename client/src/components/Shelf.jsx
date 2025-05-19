import { BookCard } from "./BookCard";
import React, { useMemo } from "react";
import { plantImageOptions } from './Options';

export function Shelf({ year, books, onAdd, onBookClick }) {
  const getRandomPlantImage = () => {
    const randomIndex = Math.floor(Math.random() * plantImageOptions.length);
    return plantImageOptions[randomIndex];
  };

  const randomPlantImage = useMemo(() => getRandomPlantImage(), []);
  const randomPlantImage2 = useMemo(() => getRandomPlantImage(), []);

  return (
    <div className="my-2 relative">
      {/* Shelf date */}
      <div className="text-4xl font-serif px-2 py-2 bg-amber-900 text-white">
        {year !== null ? year : <span className="block w-full">&nbsp;</span>}
        <button
          className="absolute -right-5 -top-3.5 bg-green-500 bold text-white rounded scale-45 hover:scale-50"
          onClick={() => onAdd(year !== null ? year : 1973)}
        >+</button>
      </div>
      {/* Books and Plants */}
      <div className="flex gap-1 overflow-x-auto overflow-y-hidden px-1 bg-cover">
        {books.map((book, idx) => (
          <BookCard key={idx} book={book} onClick={() => onBookClick(book)} />
        ))}
        {books.length < 4 && (<img
          src={randomPlantImage}
          alt="Plant decoration"
          className="w-24 h-40 mt-4 object-contain rounded shadow-md"
        />)}
        {books.length < 4 && (<img
          src={randomPlantImage2}
          alt="Plant decoration"
          className="w-24 h-40 mt-4 object-contain rounded shadow-md"
        />)}
      </div>
      {/* If this shelf is the empty shelf (only has plants) add a bottom shelf */}
      {books.length == 0 && (
        <div className="text-4xl font-serif px-2 py-2 mt-2 bg-amber-900 text-white">
          <span className="block w-full">&nbsp;</span>
        </div>
      )}
      
    </div>
  );
}