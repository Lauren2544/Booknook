import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { BookCard } from "./BookCard";
import { colorOptions, flowerImageOptions } from './Options';
import trash from '../assets/trash.png';
import axios from 'axios';

export function EditBookModal({ book, onClose, onDeleteBook }) {
  const [page, setPage] = useState(-1); 

  useEffect(() => {
      window.scrollTo({ top: 0 });
      document.body.classList.add('overflow-hidden');
      return () => {
        document.body.classList.remove('overflow-hidden');
      };
    }, []);

  const pages = [
    [
      <div key="left-0">
        <p className="font-serif"><strong>Date Read:</strong> {book.year ? new Date(book.year).getUTCFullYear() : null}</p>
        <p className="font-serif"><strong>Rating:</strong> {book.rating}/10</p>
        <p className="font-serif mt-6"><strong>Notes:</strong></p>
        <blockquote className="italic border-l-4 pl-4 border-amber-600 text-sm">
          “{book.notes}”
        </blockquote>
      </div>,
      <div key="right-0">
        <p className="font-serif"><strong>Quotes:</strong></p>
        <blockquote className="italic border-l-4 pl-4 border-amber-600 text-sm">
          {book.quotes}
        </blockquote>
      </div>
    ],
    [
      <div key="left-1">
        <p className="font-serif mt-6"><strong>Spine Colour:</strong></p>
        <div className="mb-1">
          <div className="flex flex-wrap gap-1 pb-2">
            {colorOptions.map((c, i) => (
              <button
                key={i}
                type="button"
                className={'w-10 h-8 border-5 rounded scale-90'}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>
        <p className="font-serif"><strong>Spine Image:</strong></p>
        <div className="mb-4">
          <div className="flex flex-wrap gap-1 pb-2">
            {flowerImageOptions.map((c, i) => (
              <div
                key={i}
                className="w-14 h-10 rounded scale-90 overflow-hidden"
                style={{ background: book.colour }}
              >
                <img
                  src={c}
                  className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none"
                />
              </div>
            ))}
          </div>
          
        </div>
      </div>,
      <div key="right-1">
        <p className="font-serif"><strong>Preview:</strong></p>
        <div className="flex justify-center items-center h-full pt-10 scale-120" >
          <BookCard key="preview-book" book={book} onClick={() => {}} />
        </div>
      </div>
    ]
  ];

  const handleNext = () => {
    setPage((prev) => prev + 1);
  };

  const handlePrev = () => {
    setPage((prev) => prev - 1);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/books/${book._id}`, { withCredentials: true });
      setPage(-1);
      onDeleteBook(book);
      onClose();
    } catch (error) {
      alert('Failed to delete the book. Please try again.');
      console.error("Delete book failed:", err);
    }
  };
  

  return (
    <>
      <div className="fixed inset-0 w-full h-full bg-black bg-opacity-50 flex items-start justify-center pt-40">
        {page===-1 && (
          <div
            className={`w-70 h-100 rounded shadow-md cursor-pointer border-2 flex flex-col items-center justify-center text-white text-center p-1 hover:scale-110 scale-105 transition`} 
            style={{ backgroundColor: book.colour }}
          >
            {book.image && <img src={book.image} alt="cover" className="w-10 h-10 object-cover rounded mb-1" />}
            <div className='font-serif text-2xl'>{book.title}</div>
            <div className="font-serif text-lg italic">
              By {book.author?.trim() ? book.author : 'an unknown author'}
            </div>
            <button className="absolute left-3.5 bottom-3.5 mt-4 bg-gray-800 text-white px-4 py-2 rounded" 
              onClick={() => {
                setPage(-1);
                onClose();
              }}
            >Close</button>
            <button className="absolute bottom-3.5 right-3.5 px-1" onClick={handleNext}><ChevronRight /></button>
          </div>
        )}
      
      {page!==-1 && (
        <>
          <AnimatePresence>
              <motion.div
                className="fixed inset-0 w-full h-full bg-black bg-opacity-50 flex items-start justify-center pt-40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
              >
                <motion.div
                  className="bg-amber-50 w-[620px] h-[440px] rounded shadow-lg p-6 relative border-8 flex items-center justify-center"
                  style={{ borderColor: book.colour, transformStyle: 'preserve-3d'}}
                  onClick={(e) => e.stopPropagation()}
                  initial={{ rotateY: 90 }}
                  animate={{ rotateY: 0 }}
                  exit={{ rotateY: 90 }}
                  transition={{ duration: 0.6 }}
                >

                  <img
                    src={trash}
                    alt="Delete"
                    className="absolute top-2 left-0 w-14 h-12 cursor-pointer"
                    onClick={handleDelete}
                  />
                  <button className="absolute ui-sans-serif -top-1 right-3 mt-4 bg-gray-800 text-white px-4 py-2 rounded" 
                    onClick={() => {
                      setPage(-1);
                      onClose();
                    }}
                  >Close</button>

                  <>
                    <div className="w-1/2 border-r border-dashed border-gray-400 px-5 py-1 bg-white lined-paper h-full pt-6">
                      <h2 className="text-lg font-serif font-bold text-center">{book.title}</h2>
                      <div className="italic font-serif text-center text-gray-600 mb-5">
                        By {book.author?.trim() ? book.author : 'an unknown author'}
                      </div>
                      {pages[page][0]}
                    </div>

                    <div className="w-1/2 px-4 py-2 bg-white lined-paper h-full pt-7">
                      {pages[page][1]}
                    </div>
                  </>

                  <div className="absolute bottom-3.5 left-0 right-0 flex justify-between text-white px-3">
                    {page >= 0 && <button onClick={handlePrev}><ChevronLeft /></button>}
                    <div className="flex-grow"></div>
                    {page < pages.length-1 && <button onClick={handleNext}><ChevronRight /></button>}
                  </div>
                </motion.div>
              </motion.div>
          </AnimatePresence>

          <style jsx>{`
            .lined-paper {
              background-image: repeating-linear-gradient(
                to bottom,
                white 0px,
                white 23px, #e5e7eb 24px
              );
              font: font-serif;
              background-size: 100% 24px;
            }
          `}</style>
        </>
      )}
    </div>
    </>
  );
}

