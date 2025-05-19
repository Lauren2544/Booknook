
import { useState, useEffect } from 'react';
import { EditBookModal } from "./EditBookModal";
import { AddBookModal } from "./AddBookModal";
import { Shelf } from "./Shelf";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// import goodreads https://www.goodreads.com/review/import
//https://help.goodreads.com/s/article/How-do-I-import-or-export-my-books-1553870934590

export default function BookshelfApp() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState(null);
  const [addingBookByYear, setAddingBookByYear] = useState(null);
  const navigate = useNavigate();

  const groupedByYear = books.reduce((acc, book) => {
    // don't ask why its in utc time, no one knows, just accept it :)
    const year = book.year ? new Date(book.year).getUTCFullYear() : null;
    if (!acc[year]) acc[year] = [];
    acc[year].push(book);
    return acc;
  }, {});

  const handleAddBook = (newBook) => {
    setBooks([...books, newBook]);
  };

  const handleDeleteBook = (oldBook) => {
    setBooks(prevBooks => prevBooks.filter(book => book._id !== oldBook._id));
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/logout`, {}, { withCredentials: true });
      navigate('/login'); 
    } catch (err) {
      alert('Failed to delete the book. Please try again.');
      console.error("Logout failed:", err);
    }
  };

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/books`, { withCredentials: true })
      .then((res) => {
        setBooks(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch books:', err);
      });
  }, []);

  // if loading just wait 
  if (loading) return <div></div>;

  return (
    <div className="min-h-screen w-200 bg-[url('/background-cozy.jpg')] bg-cover bg-fixed text-gray-800">
      <div className="backdrop-blur-sm min-h-screen bg-white/80 px-4 py-2">
        {/* Navigation Header */}
        <div className="flex justify-end space-x-4">
          {/* Todo - add import from goodreads option  */}
          {/* <span 
            onClick={handleImport} 
            className="text-black underline cursor-pointer"
          >
            Import from Goodreads
          </span> */}
          <span 
            onClick={handleLogout} 
            className="text-black underline cursor-pointer"
          >
            Logout
          </span>
        </div>
        {/* Shelves */}
        {Object.entries(groupedByYear)
          .sort((a, b) => b[0] - a[0])
          .map(([year, books]) => (
            <Shelf
            key={year}
            year={year}
            books={books}
            onAdd={setAddingBookByYear}
            onBookClick={setSelectedBook}
            />
          ))}
        {/* Empty bottom shelf */}
        <Shelf
          key="no-year"
          year={null}
          books={[]} 
          onAdd={setAddingBookByYear}
          onBookClick={setSelectedBook}
        />
        {/* Modal for editing a book */}
        {selectedBook && (
          <EditBookModal 
            book={selectedBook} 
            onClose={() => setSelectedBook(null)}
            onDeleteBook={handleDeleteBook}
          />
        )}
        {/* Modal for adding a book */}
        {addingBookByYear && (
          <AddBookModal
            year={addingBookByYear}
            onClose={() => setAddingBookByYear(null)}
            onAddBook={handleAddBook}
          />
        )}
      </div>
    </div>
  );
}
