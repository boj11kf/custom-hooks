import Places from './Places.jsx';
import Error from './Error.jsx';
import { sortPlacesByDistance } from '../loc.js';
import { fetchAvailablePlaces } from '../http.js';
import { useFetch } from '../hooks/useFetch.js';

/* 
  Egy bevedt módszer (pattern) arra, hogy egy nem promise API-t
  promise based API-vá tegyünk.

  Itt azért volt rá szükség, mert egy async függvényt kellett 
  kibővíteni annak érdekében, hogy a custom useFetch-et használhassuk
  attól függetlenül is, hogy ki kellett egészítenünk a promissal 

  Lényegében egy egyszerű kibővítés, csak async, szal promise-ba
  csomagolva...

*/
async function fetchSortedPlaces() {
  const places = await fetchAvailablePlaces();

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition((position) => {
      const sortedPlaces = sortPlacesByDistance(
        places,
        position.coords.latitude,
        position.coords.longitude
      );

      resolve(sortedPlaces);
    });
  });      
}

export default function AvailablePlaces({ onSelectPlace }) {
  //const [isFetching, setIsFetching] = useState(false);
  //const [availablePlaces, setAvailablePlaces] = useState([]);
  //const [error, setError] = useState();

  const {
    isFetching,
    fetchedData: availablePlaces,
    setFetchedData: setAvailablePlaces,
    error,
  } = useFetch(fetchSortedPlaces, []);

  /* useEffect(() => {
    async function fetchPlaces() {
      setIsFetching(true);

      try {
        const places = await fetchAvailablePlaces();

        navigator.geolocation.getCurrentPosition((position) => {
          const sortedPlaces = sortPlacesByDistance(
            places,
            position.coords.latitude,
            position.coords.longitude
          );
          setAvailablePlaces(sortedPlaces);
          setIsFetching(false);
        });
      } catch (error) {
        setError({
          message:
            error.message || 'Could not fetch places, please try again later.',
        });
        setIsFetching(false);
      }
    }

    fetchPlaces();
  }, []); */

  if (error) {
    return <Error title="An error occurred!" message={error.message} />;
  }

  return (
    <Places
      title="Available Places"
      places={availablePlaces}
      isLoading={isFetching}
      loadingText="Fetching place data..."
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}
