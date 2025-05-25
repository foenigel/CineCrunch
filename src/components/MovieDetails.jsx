import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Star from "../assets/MovieAssets/star.svg";
import { useScratch } from "react-use";
import noPoster from "../assets/MovieAssets/No-Poster.png";
import noPosterHorizontal from "../assets/MovieAssets/No-Poster-Horizontal.png";
import { Link, useParams } from "react-router-dom";
import { BsArrowRight, BsPlayFill, BsPeopleFill, BsClockFill, BsGlobe2, BsArrowLeft } from "react-icons/bs";

const API_BASE_URL = "https://api.themoviedb.org/3";

const API_KEY = import.meta.env.VITE_API_KEY;

const API_OPTIONS = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        authorization: `Bearer ${API_KEY}`
    }
}

const MovieDetails = () => {
    const [movieDetails, setMovieDetails] = useState([]);
    const [trailer, setTrailer] = useState([]);
    const {title, id} = useParams();
    const [play, setPlay] = useState(false);
    // const movieObject = location.state?.movie;
    // const {id, title, genre_names} = movieObject;
    const {adult, budget, origin_country, overview, genres, popularity, production_countries, homepage, spoken_languages, belongs_to_collection, production_companies, poster_path, backdrop_path, release_date, revenue, runtime, status, tagline, vote_average, vote_count, original_language, imdb_id} = movieDetails;

    const getCompanies = production_companies?.map((company) => company.name) || [];
    const getLanguages = spoken_languages?.map((language) => language.english_name) || [];
    const getCountries = production_countries?.map((country) => country.name) || [];
    const backdropV2 = belongs_to_collection?.backdrop_path || backdrop_path;
    const getGenres = genres?.map((genre) => genre.name) || [];

    const trailerMatch = trailer.find((trailer) => trailer.name?.toLowerCase().includes("official trailer") && trailer.type === "Trailer" && trailer.site === "YouTube");
    const fallbackTrailer = trailer.find((trailer) => trailer.type === "Trailer" && trailer.site === "YouTube");
    const anyYoutubeVideo = trailer.find((trailer) => trailer.site === "YouTube" || trailer.name.toLowerCase().includes("trailer"));
    const selectedTrailer = trailerMatch || fallbackTrailer || anyYoutubeVideo;
    const trailerKey = selectedTrailer?.key || null;

    const getMovieDetails = async() => {   
    try{
        const endPoint = `${API_BASE_URL}/movie/${id}?${API_KEY}&language=en-US`;
        const response = await fetch(endPoint, API_OPTIONS);

        if(!response.ok){
            throw new Error("Failed to fetch Movie Details");
        }

        const data = await response.json();
        console.log(data);
        setMovieDetails(data);
    }
    catch(error){
        console.log(`${error}`);
    }
    }


    const getTrailers = async() => {
    try{
        const endpoint = `${API_BASE_URL}/movie/${id}/videos?${API_KEY}&language=en-US`;
        const response = await fetch (endpoint, API_OPTIONS);

        if(!response.ok){
            throw new Error(`Failed to fetch ${title} trailer`);
        }

        const data = await response.json();
        setTrailer(data.results);
    }
    catch(error){
        console.log(`${error}`);
    }
    }

    const releaseDate = new Date(release_date);
    const dateFormat = releaseDate.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    });

    useEffect(()=> {
        getMovieDetails();
        getTrailers();
        window.scrollTo(0, 0);
    },[])

    const playTrailer = () => {
        setPlay(true);
    }

    const exitModal = () => {
          setPlay(false);
}



    return ( 
        <div className="w-full h-auto flex flex-col items-center justify-center">
                <div className="relative min-h-[600px] h-full flex flex-col gap-4 overflow-hidden items-start justify-center w-full px-4 sm:px-20">
                    <div className="relative z-20 top-8 mb-10 flex gap-2 px-4 py-2 rounded-full bg-TrendingDateColor items-center justify-center sm:right-20 sm:absolute">
                        <img src={Star} className="w-[20px]" alt="star_svg" />
                        <h2 className="text-white text-sm font-semibold sm:text-lg">{vote_average ? `${vote_average.toFixed(1)}/10` : "N/A"}</h2>
                    </div>
                <div className="relative w-full flex gap-14 items-start z-10 sm:max-w-[1400px]">
                    <div className="flex w-full flex-col gap-10 sm:w-10/12 xl:w-7/12">
                        <h2 className="text-white text-3xl font-semibold sm:text-5xl">{title ? title : "N/A"}</h2>
                        <div className="relative grid grid-cols-2 gap-4 items-center w-fit sm:flex">
                            <div className="flex gap-2 items-center">
                                <h2 className="flex gap-2 text-lg font-semibold text-white"><BsPeopleFill color="#FFFFFF" size={24}/>{popularity ? popularity : "N/A"}</h2>
                                <span className="text-white/70 text-2xl">&#x2022;</span>
                            </div>
                            
                            <div className="flex gap-2 items-center">
                                <h2 className="text-white text-lg font-semibold">{dateFormat ? dateFormat.split(" ")[2] : "N/A"}</h2>
                                <span className="text-white/70 text-2xl">&#x2022;</span>
                            </div>
                           
                           <div className="flex gap-2 items-center">
                                <h2 className="px-4 py-2 bg-white/15 rounded-xl font-semibold text-white text-lg">Ongoing</h2>
                                <span className="text-white/70 text-2xl">&#x2022;</span>
                           </div>
                            
                            <h2 className="text-white text-lg font-semibold">{original_language ? original_language : "N/A"}</h2>
                        </div>
                        <p className="text-white text-xl flex-1">{overview ? overview : "N/A"}</p>
                        <Link to={"/"}><button className="bg-TrendingRed px-4 py-3 w-fit h-fit text-white flex gap-1 items-center justify-center font-semibold rounded-md cursor-pointer mb-10">Visit Homepage<BsArrowRight className="text-white"/></button></Link>
                    </div>
                </div>
{/* 
                <div className="relative w-full h-auto flex gap-2 z-10 items-center">
                    <h2 className="text-sm text-white sm:text-base">{release_date ? release_date.split("-")[0] : "N/A"}</h2>
                    <span className="text-white text-xl opacity-50">&#x2022;</span>
                    <h2 className="text-white text-sm font-semibold sm:text-base">{adult ? <span className="text-red-500">Restricted (R)</span> : <span className="text-green-500">General Audience <span className="text-white">(G)</span></span>}</h2>
                    <span className="text-white text-xl opacity-50">&#x2022;</span>
                    <h2 className="text-white text-sm sm:text-base">{runtime ? `${Math.floor(runtime / 60)}h ${runtime % 60}m` : "N/A"}</h2>
                </div> */}

                {/* <div className="relative flex flex-col justify-between gap-4 w-full z-10 mb-10 sm:flex-row overflow-x-hidden">
                    <img src={backdropV2 ? `https://image.tmdb.org/t/p/w500/${backdropV2}`: `${noPosterHorizontal}`} alt={`${title}-Poster`} className=" text-white w-full rounded-lg shadow-lg shadow-black/40 sm:w-1/2" />
                    <iframe className="w-full h-auto rounded-lg shadow-lg shadow-black/40 sm:1/2" src={`https://www.youtube.com/embed/${trailerKey}`} title="Movie Trailer" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                </div> */}
                <button className="text-white rounded-full px-4 py-2 bg-white/30 flex items-center justify-center gap-2 absolute right-4 bottom-10 z-10 sm:right-20 cursor-pointer hover:bg-TrendingRed" onClick={playTrailer}><BsPlayFill color="#FFFFFF" size={25}/>Watch Trailer</button>
                <div className="w-full h-full absolute bg-gradient-to-t from-black/80 via-black/35 to-black/0 z-[5] top-0 left-0"></div>
                <img src={`https://image.tmdb.org/t/p/original/${backdrop_path}`} alt={`${title}-Poster`} className=" text-white absolute w-full h-full top-0 left-0 object-cover z-0 shadow-lg saturate-100 sm:object-cover" />
                </div>

                <div className={`w-full bg-gradient-to-b from-redVersion2 to-lightRed relative flex flex-col items-center p-0 gap-4 justify-center h-auto sm:flex-row sm:items-start sm:p-10 ${play ? 'hidden' : 'flex'}`}>
                    <div className="max-w-[1100px] w-full flex flex-col gap-10 justify-between items-center">
                    <div className="flex flex-col w-full h-auto gap-6 xl:flex-row">
                    <div className="bg-cardGray w-full h-auto mt-6 p-10 rounded-2xl flex flex-col gap-6 sm:flex-row sm:gap-10 sm:w-fit sm:mt-0">
                        <div className="relative w-full h-auto flex justify-center sm:w-fit">
                        <img src={poster_path ? `https://image.tmdb.org/t/p/w500/${poster_path}` : `${noPoster}`} className="max-h-[300px] w-fit shadow-xl shadow-white/30" alt="" />
                        </div>
                        <div className="flex flex-col gap-4">
                            <div className="flex gap-4 items-center">
                            <h2 className="text-white text-2xl font-bold">{title ? title : "N/A"}</h2>
                            <h2 className="text-TrendingDateColor px-2 rounded-md text-lg font-bold bg-white">{dateFormat ? dateFormat.split(" ")[2] : "N/A"}</h2>
                            </div>
                            <div className="flex gap-6 items-center">
                            <div className="relative flex gap-2 w-fit px-3 py-1 rounded-full bg-TrendingDateColor items-center justify-center">
                                <img src={Star} className="w-[20px]" alt="star_svg" />
                                <h2 className="text-white text-sm font-semibold sm:text-lg">{vote_average ? `${vote_average.toFixed(1)}/10` : "N/A"}</h2>
                            </div>
                            <div className="flex gap-1 items-center">
                                <BsClockFill color="#7A7A7A" size={22}/>
                                <h2 className="text-white text-base sm:text-lg">{runtime ? `${Math.floor(runtime / 60)}h ${runtime % 60}m` : "N/A"}</h2>
                            </div>
                            </div>
                            <ul className="grid grid-cols-2 gap-3 sm:flex">
                                {Object.values(getGenres).map((genre, index) => (
                                    <li key={index} className="text-grayShade2 w-fit px-4 py-2 border-2 border-white/30 rounded-xl font-bold text-nowrap">{genre}</li>
                                ))}
                            </ul>
                            <div className="border-[1px] border-gray-500/80"></div>
                            <div className="flex flex-col gap-3 items-start sm:flex-row">
                                <h1 className="text-white font-semibold text-xl">Tagline:</h1>
                                <h3 className="text-white text-lg sm:text-xl">{tagline ? tagline : "N/A"}</h3>
                            </div>
                             <div className="flex gap-3 items-center">
                                <h1 className="text-red-500 font-semibold text-xl"><BsGlobe2 size={25}/></h1>
                                <h3 className="text-white flex-1">{homepage ? <a href={homepage} target="_blank" rel="noopener noreferrer" className="text-white text-lg border-b-[1px] cursor-pointer">Visit Official Website</a> : "N/A"}</h3>
                            </div>
                        </div>
                    </div>
                    <div className="relative bg-cardGray p-10 rounded-2xl w-full flex flex-col gap-4 sm:w-fit">
                        <h2 className="text-white text-sm font-semibold sm:text-base">{adult ? <span className="text-red-500">Restricted (R)</span> : <span className="text-green-500">General Audience <span className="text-white">(G)</span></span>}</h2>
                        <h2 className="text-white text-sm font-semibold sm:text-base">{vote_count ? `Vote Count: ${vote_count}` : "N/A"}</h2>
                        <h2 className="text-white text-sm font-semibold sm:text-base">{status ? `Status: ${status}` : "N/A"}</h2>
                        <div className="flex gap-4">
                            <h2 className="text-white text-sm font-semibold sm:text-base">Available on:</h2>
                            <a href={imdb_id ?` https://www.imdb.com/title/${imdb_id}/` : "N/A"} target="_blank" rel="noopener noreferrer"><button className="bg-yellow text-black px-4 py-2 rounded-lg font-bold cursor-pointer hover:bg-yellow-300">IMDb</button></a>
                        </div> 
                        <img src={backdropV2 ? `https://image.tmdb.org/t/p/w500/${backdropV2}`: `${noPosterHorizontal}`} alt={`${title}-Poster`} className=" text-white max-h-[150px] object-cover rounded-lg shadow-lg shadow-black/40" /> 
                    </div>
                    </div>
                    <div className="relative bg-cardGray/20 flex flex-col gap-10 px-2 py-8 rounded-xl sm:p-10">
                    <div className="relative grid grid-cols-[2fr_3fr] gap-10 w-full justify-between sm:grid-cols-[1fr_4fr] border-b-2 border-white/20">
                        <h1 className="text-white font-semibold text-xl pb-3">Release date</h1>
                        <h3 className="text-white flex-1">{dateFormat}</h3>
                    </div>
                    <div className="relative grid grid-cols-[2fr_3fr] gap-2 w-full justify-between sm:gap-10 sm:grid-cols-[1fr_4fr] border-b-2 border-white/20">
                        <h1 className="text-white font-semibold text-xl pb-3">Countries</h1>
                        <h3 className="text-white flex-1">{getCountries.join(", ")}</h3>
                    </div>
                    <div className="relative grid grid-cols-[2fr_3fr] gap-10 w-full justify-between sm:grid-cols-[1fr_4fr] border-b-2 border-white/20">
                        <h1 className="text-white font-semibold text-xl pb-3">Language</h1>
                        <h3 className="text-white flex-1">{getLanguages.join(", ")}</h3>
                    </div>
                    <div className="relative grid grid-cols-[2fr_3fr] gap-10 w-full justify-between sm:grid-cols-[1fr_4fr] border-b-2 border-white/20">
                        <h1 className="text-white font-semibold text-xl pb-3">Budget</h1>
                        <h3 className="text-white flex-1">{parseInt(budget).toLocaleString("en-US", { style: "currency", currency: "USD" })}</h3>
                    </div>
                    <div className="relative grid grid-cols-[2fr_3fr] gap-10 w-full justify-between sm:grid-cols-[1fr_4fr] border-b-2 border-white/20">
                        <h1 className="text-white font-semibold text-xl pb-3">Revenue</h1>
                        <h3 className="text-white flex-1">{parseInt(revenue).toLocaleString("en-US", { style: "currency", currency: "USD" })}</h3>
                    </div>
                    <div className="relative grid grid-cols-[2fr_3fr] gap-2 w-full justify-between sm:grid-cols-[1fr_4fr] sm:gap-10">
                        <h1 className="text-white font-semibold text-xl pb-3">Production Companies</h1>
                        <h3 className="text-white flex-1">{getCompanies.join(", ")}</h3>
                    </div>
                    </div>
                    </div>
                </div>

                {
                    play && <div className="absolute top-0 left-0 w-full h-full z-20 bg-black flex items-center justify-center">
                        <button className="absolute text-white cursor-pointer top-5 z-30 bg-TrendingRed px-4 py-2 rounded-full font-semibold right-5 flex gap-2 items-center hover:bg-TrendingRed/90" onClick={exitModal}><BsArrowLeft color="#FFFFFF" size={22}/>Go Back</button>
                        <iframe className="w-full h-3/4 rounded-lg z-20" src={`https://www.youtube.com/embed/${trailerKey}?rel=0&modestbranding=1&autoplay=1&controls=1&enablejsapi=1`} title="Movie Trailer" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                            </div>
                }
           
        </div>
     );
}
 
export default MovieDetails;