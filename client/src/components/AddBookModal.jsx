import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { colorOptions, flowerImageOptions } from './Options';
import axios from 'axios';

export function AddBookModal({ year, onClose, onAddBook }) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [rating, setRating] = useState('');
  const [quotes, setQuotes] = useState('');
  const [notes, setNotes] = useState('');
  const [colour, setColour] = useState(colorOptions[0]);
  const [image, setImage] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    if (year) {
      setDate(`${year}-01-01`);
    } else {
      setDate('');
    }
  }, [year]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
    document.body.classList.add('overflow-hidden');
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title) {
      alert('Title is required!');
      return;
    }

    const book = {
      title,
      author,
      rating: parseInt(rating),
      quotes: quotes.split(';').map(q => q.trim()).filter(Boolean),
      notes,
      colour,
      image,
      year: date,
    };

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/books`, book, { withCredentials: true });
      onAddBook(res.data); // adds the book info and the bookid 
      onClose();
    } catch (err) {
      alert('Error adding book');
      console.error('Failed to add book:', err);
    }
  };

  return (
    <div className="fixed inset-0 w-full h-full bg-black bg-opacity-50 flex items-start justify-center p-2 pt-12">
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        className="bg-white text-gray-900 p-6 w-96 rounded-lg shadow-lg max-h-[90vh] overflow-y-auto border-4 border-dark-brown"
      >
        <h2 className="text-2xl font-serif font-semibold text-center text-dark-brown mb-2">Add a Book</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-lg text-dark-brown mb-1">Book Title <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 bg-gray-200 rounded shadow-sm border border-dark-brown focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          
          <div className="mb-2">
            <label className="block text-lg text-dark-brown mb-1">Author</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full p-2 bg-gray-200 rounded shadow-sm border border-dark-brown focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="mb-2">
            <label className="block text-lg text-dark-brown mb-1">Date Read</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2 bg-gray-200 rounded shadow-sm border border-dark-brown focus:ring-2 focus:ring-green-500"
            />
          </div>
          
          <div className="mb-2">
            <label className="block text-lg text-dark-brown mb-1">Rating (1-10)</label>
            <input type="number" min="1" max="10" value={rating} onChange={(e) => setRating(e.target.value)} className="w-full p-2 bg-gray-200 rounded shadow-sm border border-dark-brown" />
          </div>

          <div className="mb-2">
            <label className="block text-lg text-dark-brown mb-1">Quotes (Separate by semicolon)</label>
            <textarea
              value={quotes}
              onChange={(e) => setQuotes(e.target.value)}
              rows="3"
              className="w-full p-2 bg-gray-200 rounded shadow-sm border border-dark-brown focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="mb-2">
            <label className="block text-lg text-dark-brown mb-1">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows="3"
              className="w-full p-2 bg-gray-200 rounded shadow-sm border border-dark-brown focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Spine Color Picker */}
          <div className="mb-2">
            <label className="block text-lg text-dark-brown mb-1">Spine Color</label>
            <div className="flex flex-wrap gap-2 pb-2">
              {colorOptions.map((c, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setColour(c)}
                  className={`w-8 h-8 rounded-full border-2 ${colour === c ? 'border-black' : 'border-white'}`}
                  style={{
                    backgroundColor: c,
                    ...(colour === c && { outline: '4px auto -webkit-focus-ring-color' })
                  }}
                />
              ))}
            </div>
          </div>

          {/* Spine Image Picker */}
          <div className="mb-2">
            <label className="block text-lg text-dark-brown mb-1">Spine Image</label>
            <div className="flex flex-wrap gap-1 pb-2">
            {flowerImageOptions.map((c, i) => (
              <button
                key={i}
                type="button"
                className="w-14 h-10 rounded scale-90 overflow-hidden"
                style={{
                  background: colour,
                  ...(image === c && { outline: '4px auto -webkit-focus-ring-color' })
                }}
                onClick={() => setImage(c)}
              >
                <img
                  src={c}
                  className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none"
                />
              </button>
            ))}
          </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-center gap-4 mt-4">
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-md text-xl font-semibold hover:bg-green-700 transition">Add</button>
            <button type="button" onClick={onClose} className="bg-red-600 text-white px-4 py-2 rounded-md text-xl font-semibold hover:bg-red-700 transition">Cancel</button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
