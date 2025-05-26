import React,{useState, useEffect} from "react";
import CineCrunchBG from "../assets/MovieAssets/CineCrunch-BG.png";
import Searchbar from "./Searchbar";
import Card from "./Card";
import filmTape from "../assets/MovieAssets/filmtape.png";
import logo from "../assets/MovieAssets/Logo.svg";
import heroBg from "../assets/MovieAssets/hero-bg.svg";
import heroPosters from "../assets/MovieAssets/hero.png";
import Pagination from "./Pagination";
import Spinner from "./Spinner";
import { getTrendingMovies, updateSearchCount } from "../appwrite";
import { useLocation } from "react-router-dom";
import Modal from "./BookmarkModal";

    const API_BASE_URL = "https://api.themoviedb.org/3";

    const API_KEY = import.meta.env.VITE_API_KEY;

    const API_OPTIONS = {
        method: 'GET',
        headers: {
            accept:'application/json',
            authorization:`Bearer ${API_KEY}`
        }
    }

const Home = () => {
    const [movieList, setMovieList] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [genreList, setGenreList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageDetails, setPageDetails] = useState([]);
    const [noSearchMessage, setNoSearchMessage] = useState("");
    const [trendingMovies, setTrendingMovies] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const {total_results} = pageDetails;
    const [blur, setBlur] = useState(true);
    const [name, setName] = useState("");
    const [loggedin, setLoggedin] = useState(() => {
        const storedName = localStorage.getItem("name");
         return !!storedName;
    });

    const todaysDate = new Date();
    const formatted = todaysDate.toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    });

    const toggleModal = () => {
        setOpenModal(prev => !prev);
    }

    const inputName = (e) => {
        const userName = e.target.value;
        setName(userName);
    }

    const saveName = () => {
        localStorage.setItem("name", name);
        setBlur(false);
    }

    {/* Useeffect to fetch api data */}
    const getMovies = async (query = '') => {
        setLoading(true);
        setErrorMessage("");

        try{
            const endPoint = query ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}&page=${currentPage}` : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc&page=${currentPage}`;
            const response = await fetch(endPoint, API_OPTIONS);

            if(!response.ok){
                throw new Error("Failed to fetch Movies");
            }

            const data = await response.json();

            if(data.Response === "False"){
                setErrorMessage(data.Error || 'Failed to fetch movies');
                setMovieList([]);
                return;
            }

            if(data.results.length === 0){
                setNoSearchMessage(`No Movies found with the name ${query}`);
            }
            else {
                setNoSearchMessage(""); 
            }

            setPageDetails({page: data.page, total_pages: data.total_pages, total_results: data.total_results});
            setMovieList(data.results);
            console.log(data.results);

            if (query && data.results.length > 0){
                await updateSearchCount(query, data.results[0]);
            }
        }
        catch(error){
            console.log(`${error}`);
            setErrorMessage("Could not fetch movie list. Please try again later.");
        }
        finally{
            setLoading(false);
        }
    }

    const loadTrendingMovies = async () => {
        try{
            const movies = await getTrendingMovies();
            setTrendingMovies(movies);
        }
        catch (error) {
            console.error(`Error fetching trending movies: ${error}`);
        }
    }

    const getGenres = async() =>{
        try{
            const endpoint =  `${API_BASE_URL}/genre/movie/list`;
            const response = await fetch(endpoint, API_OPTIONS);

            if(!response.ok){
                throw new Error("Failed to fetch genre list");
            }

            const data = await response.json();
            console.log(data);
            setGenreList(data.genres);
        }
        catch(error){
            console.log(`${error}`);
            setErrorMessage("Could not fetch genre list. Please try again later.");
        }
        finally{
            setLoading(false);
        }
    }

    const moviesWithGenres = movieList.map((movie) => {
    const genreNames = Array.isArray(movie.genre_ids)
    ? movie.genre_ids.map((id) => {
        const match = genreList.find((genre) => genre.id === id);
        return match ? match.name : 'Unknown';
        })
    : ['Unknown'];



  return {
    ...movie,
    genre_names: genreNames,
  };
});
    
   useEffect(() => {
  const timer = setTimeout(() => {
    getMovies(searchTerm);
  }, 800);
  return () => clearTimeout(timer);
}, [searchTerm, currentPage]);

    useEffect (() =>{
        getGenres();
        loadTrendingMovies();
    },[]);

    useEffect (() => {
        if (loggedin){
            setBlur(false);
        }
    },[]);
        
    return ( <div className="relative flex flex-col items-center justify-center bg-gradient-to-b from-black to-red-950 h-auto w-full overflow-hidden">
        <div className="min-h-screen h-auto flex items-center justify-center w-full relative">
        <img src={CineCrunchBG} className="h-full w-full object-cover absolute z-0" alt="" />
    
        <div className="relative overflow-x-hidden rounded-3xl px-2 py-16 w-full flex flex-col gap-10 items-center justify-center max-w-[1200px] z-10 sm:mx-10 sm:min-h-[500px] xl:min-h-[600px] sm:m-4">
            <div className="relative flex flex-col items-center justify-center gap-10 px-0 h-auto w-auto sm:px-10">
                <div className="relative flex items-center justify-center w-auto h-auto">
                <img src={heroPosters} className="flex-1 z-10 max-h-[340px] sm:flex-2" alt="" />
                <img src={logo} className="flex-1 absolute h-auto z-10 bottom-0 w-1/3 sm:w-3/4" alt="" />
                </div>
                <h1 className="text-white font-bold text-3xl text-center sm:text-5xl">Find <span className="text-red-500">Movies</span> You’ll Love Without the Hassle</h1>
                <Searchbar searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
            </div>
         <img src={heroBg} className="w-full h-full absolute object-cover -z-10" alt="" />
        </div>
        
        </div>

            <div className={`bg-transparent flex flex-col items-center justify-center w-full h-full ${blur || openModal ? `hidden` : `flex`} sm:px-8`}>
                <div className="w-full h-auto max-w-[1400px] mt-10">

                <div className="flex justify-between">
                    <div className="text-white flex items-center justify-center bg-red-800/50 px-4 py-2 rounded-tl-lg rounded-tr-lg font-semibold ">{formatted}</div>
                    <div className="text-white flex items-center justify-center bg-TrendingRed font-semibold h-auto px-4 py-1 rounded-lg mb-2">Trending</div>
                </div>
                <div className="bg-gradient-to-t from-transparent to-red-700/80 backdrop-blur-3xl saturate-150 w-full h-auto p-8 mb-8 rounded-tr-xl rounded-bl-xl rounded-br-xl">
                   <h2 className="font-bold text-3xl text-white mb-6">Top Searched Movies</h2>
                    {trendingMovies.length > 0 && (
                        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-5">
                            {trendingMovies.map((movie, index) => (
                                <li key={movie.$id}>
                                    <img src={movie.poster_url} className="shadow-lg shadow-black/80 saturate-100" alt="" />
                                </li>
                            ))}
                       </ul>
                    )}
                    <div className="relative flex w-full justify-center">
                    <button className="text-white mt-10 text-center px-4 py-2 rounded-lg border-2 border-white cursor-pointer hover:bg-TrendingRed/70" onClick={toggleModal}>View Bookmarks</button>
                    </div>
                </div>

                <div className="relative flex flex-col gap-2">
                    <div className="px-2 flex flex-col justify-between sm:flex-row">
                        <h2 className="font-bold text-3xl text-white mb-2">All Movies</h2>
                        <div className="flex items-center rounded-lg">
                        <h2 className="text-white font-medium capitalize text-lg pr-1 sm:text-right">{`Movies found: ${total_results}`}</h2>
                        
                        </div>
                    </div>
                {loading ? <div className="text-center"><Spinner/></div> : errorMessage ? <p className="text-red-500 text-center">{errorMessage}</p> : noSearchMessage ? <h1 className="text-red-500 text-xl font-semibold text-center">{noSearchMessage}</h1> :<div className={`h-auto gap-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4`}>
                    {moviesWithGenres.map((movie) => (
                        <Card key={movie.id} {...movie}/>
                    ))}</div> }
                </div>
                </div>
             
                <Pagination {...pageDetails} setCurrentPage={setCurrentPage} currentPage={currentPage}/>
            </div>

            {blur && <div className="absolute backdrop-blur-3xl flex items-center justify-center saturate-150 w-full min-h-screen z-30 top-0">
                <div className="max-w-[400px] w-full h-[300px] p-14 justify-center rounded-lg bg-black/50 flex flex-col gap-6 shadow-xl shadow-black/30">
                    <img src={logo} alt="CineCrunch Logo" />
                    <h1 className="text-white text-center">Welcome to CineCrunch! Kindly Enter your <span className="font-bold">name</span> to continue.</h1>
                    <input type="text" className="font-mono bg-TrendingRed text-white py-1 rounded-md w-full focus:outline-none px-4" onChange={(e) => inputName(e)} />
                    <button className="bg-black text-white w-1/2 py-1 rounded-lg cursor-pointer border-[1px] border-white/20 hover:border-white/70" onClick={saveName}>Save</button>
                </div>
             </div>}

             {openModal && <div className="w-full h-full absolute z-20 backdrop-blur-3xl flex items-center justify-center">
                        <Modal openModal={openModal} setOpenModal = {setOpenModal}/>
                   </div>
                }
    </div> );
}
 
export default Home;