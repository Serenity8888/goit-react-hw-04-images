import { useState, useEffect } from 'react';
import { Button } from './Button/Button';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Loader } from './Loader/Loader';
import { Searchbar } from './Searchbar/Searchbar';
import { getAPI } from 'pixabay-api';
import toast, { Toaster } from 'react-hot-toast';
import css from './App.module.css';

export const App = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isEnd, setIsEnd] = useState(false);

  useEffect(() => {
    if (search === '') return;

    (async () => {
      await fetchImages(search, page);
    })();
  }, [search, page]);

  const fetchImages = async (search, page) => {
    try {
      setIsLoading(true);

      // fetch data from API
      const fetchedImages = await getAPI(search, page);
      const { hits, totalHits } = fetchedImages;

      console.log(hits, totalHits);
      // Display an error message, if there is no match with the search
      if (hits.length === 0) {
        toast.error(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        return;
      }

      // Display a success message if it's the first page
      if (page === 1) {
        toast.success(`Hooray! We found ${totalHits} images!`);
      }

      // Display a message if page is already at the end of data (12 = per_page based on API call)
      if (page * 12 >= totalHits) {
        setIsEnd(true);
        toast("We're sorry, but you've reached the end of search results.");
      }

      // Update the state with the new images
      setImages(prevState => [...prevState, ...hits]);
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = e => {
    e.preventDefault();

    const newSearch = e.target.search.value.trim().toLowerCase();

    if (newSearch !== search) {
      setSearch(newSearch);
      setPage(1);
      setImages([]);
    }
  };

  const handleClick = () => {
    setPage(prevState => prevState + 1);
  };

  console.log(search);
  return (
    <div className={css.app}>
      <Searchbar onSubmit={handleSubmit} />
      {/* Render ImageGallery Component when there is atleast one match of images */}
      {images.length >= 1 && <ImageGallery photos={images} />}

      {/* Render Button Component when there is atleast a second page or more and it's not the end of page */}
      {images.length >= 2 && !isEnd && <Button onClick={handleClick} />}
      {isLoading && <Loader />}
      {isError && toast.error('Oops, something went wrong! Reload this page!')}
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};
