import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Star from "../assets/MovieAssets/star.svg";
import { useScratch } from "react-use";
import noPoster from "../assets/MovieAssets/No-Poster.png";
import noPosterHorizontal from "../assets/MovieAssets/No-Poster-Horizontal.png";
import { Link, useParams } from "react-router-dom";
import { BsArrowRight } from "react-icons/bs";

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
    // const movieObject = location.state?.movie;
    // const {id, title, genre_names} = movieObject;
    const {adult, budget, origin_country, overview, genres, popularity, production_countries, spoken_languages, belongs_to_collection, production_companies, poster_path, backdrop_path, release_date, revenue, runtime, status, tagline, vote_average, vote_count} = movieDetails;

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



    return ( 
        <div className="bg-slate-950 w-full h-auto flex items-center justify-center">
            <div className="relative w-full max-w-[1400px] h-full flex flex-col gap-4 sm:my-10">
                <div className="relative flex flex-col gap-4 overflow-hidden p-6">

                <div className="relative w-full h-auto flex justify-between z-10">
                    <h2 className="text-white text-2xl font-semibold sm:text-3xl">{title ? title : "N/A"}</h2>
                    <div className="relative flex gap-2 px-4 bg-slate-900/40 rounded-lg items-center justify-center">
                        <img src={Star} className="w-[20px]" alt="star_svg" />
                        <h2 className="text-white text-sm font-semibold sm:text-lg">{vote_average ? `${vote_average.toFixed(1)}/10` : "N/A"}</h2>
                    </div>
                </div>

                <div className="relative w-full h-auto flex gap-2 z-10 items-center">
                    <h2 className="text-sm text-white sm:text-base">{release_date ? release_date.split("-")[0] : "N/A"}</h2>
                    <span className="text-white text-xl opacity-50">&#x2022;</span>
                    <h2 className="text-white text-sm font-semibold sm:text-base">{adult ? <span className="text-red-500">Restricted (R)</span> : <span className="text-green-500">General Audience <span className="text-white">(G)</span></span>}</h2>
                    <span className="text-white text-xl opacity-50">&#x2022;</span>
                    <h2 className="text-white text-sm sm:text-base">{runtime ? `${Math.floor(runtime / 60)}h ${runtime % 60}m` : "N/A"}</h2>
                </div>

                <div className="relative flex flex-col justify-between gap-4 w-full z-10 mb-10 sm:flex-row overflow-x-hidden">
                    <img src={backdropV2 ? `https://image.tmdb.org/t/p/w500/${backdropV2}`: `${noPosterHorizontal}`} alt={`${title}-Poster`} className=" text-white w-full rounded-lg shadow-lg shadow-black/40 sm:w-1/2" />
                    <iframe className="w-full h-auto rounded-lg shadow-lg shadow-black/40 sm:1/2" src={`https://www.youtube.com/embed/${trailerKey}`} title="Movie Trailer" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                </div>
                <div className="w-full h-full absolute bg-black/40 z-[5] top-0 left-0"></div>
                <img src={`https://image.tmdb.org/t/p/original/${backdrop_path}`} alt={`${title}-Poster`} className=" text-white rounded-lg absolute w-full h-full top-0 left-0 object-cover z-0 shadow-lg saturate-100" />
                </div>
                <div className="relative flex flex-col items-center gap-4 justify-between p-4 h-auto sm:flex-row sm:items-start sm:p-10">
                    <div className="max-w-[1100px] w-full flex flex-col gap-10 justify-between mb-8">
                    <div className="relative grid grid-cols-1 gap-2 w-full justify-between sm:grid-cols-[1fr_4fr] sm:gap-10">
                        <h1 className="text-white font-semibold text-xl">Overview</h1>
                        <h3 className="text-white flex-1">{overview ? overview : "N/A"}</h3>
                    </div>
                    <div className="relative grid grid-cols-[2fr_3fr] gap-10 w-fulljustify-between items-center sm:grid-cols-[1fr_4fr]">
                        <h1 className="text-white font-semibold text-xl">Genres</h1>
                        <p className="text-white flex-1">{getGenres.join(", ")}</p>
                    </div>
                    <div className="relative grid grid-cols-[2fr_3fr] gap-10 w-full justify-between sm:grid-cols-[1fr_4fr]">
                        <h1 className="text-white font-semibold text-xl">Release date</h1>
                        <h3 className="text-white flex-1">{dateFormat}</h3>
                    </div>
                    <div className="relative grid grid-cols-[2fr_3fr] gap-2 w-full justify-between sm:gap-10 sm:grid-cols-[1fr_4fr]">
                        <h1 className="text-white font-semibold text-xl">Countries</h1>
                        <h3 className="text-white flex-1">{getCountries.join(", ")}</h3>
                    </div>
                    <div className="relative grid grid-cols-[2fr_3fr] gap-10 w-full justify-between sm:grid-cols-[1fr_4fr]">
                        <h1 className="text-white font-semibold text-xl">Status</h1>
                        <h3 className="text-white flex-1">{status}</h3>
                    </div>
                    <div className="relative grid grid-cols-[2fr_3fr] gap-10 w-full justify-between sm:grid-cols-[1fr_4fr]">
                        <h1 className="text-white font-semibold text-xl">Language</h1>
                        <h3 className="text-white flex-1">{getLanguages.join(", ")}</h3>
                    </div>
                    <div className="relative grid grid-cols-[2fr_3fr] gap-10 w-full justify-between sm:grid-cols-[1fr_4fr]">
                        <h1 className="text-white font-semibold text-xl">Budget</h1>
                        <h3 className="text-white flex-1">{parseInt(budget).toLocaleString("en-US", { style: "currency", currency: "USD" })}</h3>
                    </div>
                    <div className="relative grid grid-cols-[2fr_3fr] gap-10 w-full justify-between sm:grid-cols-[1fr_4fr]">
                        <h1 className="text-white font-semibold text-xl">Revenue</h1>
                        <h3 className="text-white flex-1">{parseInt(revenue).toLocaleString("en-US", { style: "currency", currency: "USD" })}</h3>
                    </div>
                    <div className="relative grid grid-cols-[2fr_3fr] gap-10 w-full justify-between sm:grid-cols-[1fr_4fr]">
                        <h1 className="text-white font-semibold text-xl">Tagline</h1>
                        <h3 className="text-white flex-1">{tagline ? tagline : "N/A"}</h3>
                    </div>
                    <div className="relative grid grid-cols-[2fr_3fr] gap-2 w-full justify-between sm:grid-cols-[1fr_4fr] sm:gap-10">
                        <h1 className="text-white font-semibold text-xl">Production Companies</h1>
                        <h3 className="text-white flex-1">{getCompanies.join(", ")}</h3>
                    </div>
                    </div>
                     <Link to={"/"}><button className="bg-TrendingRed px-4 py-2 w-fit h-fit text-white flex items-center justify-center font-semibold rounded-md cursor-pointer">Visit Homepage<BsArrowRight className="text-white"/></button></Link>
                </div>
            </div>
        </div>
     );
}
 
export default MovieDetails;