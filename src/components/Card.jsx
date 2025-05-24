import React, { useEffect, useState } from "react";
import Star from "../assets/MovieAssets/star.svg";
import noPoster from "../assets/MovieAssets/No-Poster.png";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";
import { Link } from "react-router-dom";

const Card = ({id, title, poster_path, vote_average, release_date, original_language, genre_names, overview}) => {

    const [toggle, setToggle] = useState(() => {
        let bookmarkArray = JSON.parse(localStorage.getItem("bookmark")) || [];
        let movieIds = bookmarkArray.map(item => item.movieObj.id);
        return movieIds.includes(id);
    });

    const toggleBookmark = () => {
        setToggle(prev => !prev);
        console.log(toggle);
        const bookmarkValue = !toggle;
        console.log("initial value", bookmarkValue); {/* should be true */}
        
        {/* now i can push the value of true and the id into as an obj in an array*/}
        let bookmarkArray = JSON.parse(localStorage.getItem("bookmark")) || [];
        let movieIds = bookmarkArray.map(item => item.movieObj.id);
        {/* so before push check if poster id exists now */}
        const exist = movieIds.includes(id);
        if (exist){
            bookmarkArray = bookmarkArray.filter(item => item.movieObj.id !== id);
            return localStorage.setItem("bookmark", JSON.stringify(bookmarkArray));
        }
        else{
            const movieObj = {id, title, poster_path, vote_average, release_date, original_language, genre_names};
            bookmarkArray.push({movieObj, bookmarkValue});
            return localStorage.setItem("bookmark", JSON.stringify(bookmarkArray));
        }
    }

    return ( 
        <div className="w-auto h-auto p-6 bg-black/40 backdrop-blur-2xl rounded-lg border border-white/20 flex flex-col gap-3 cursor-pointer">
            <Link to={`/movie/${title}/${id}`}><img src={poster_path ? `https://image.tmdb.org/t/p/w500/${poster_path}` : `${noPoster}`} className="text-white object-cover w-full h-full" alt={`${title} Poster Cover`} /></Link>
             <h1 className="text-white font-semibold text-base">{title}</h1>
             <div className="relative flex justify-between items-center">
                 <div className="relative flex gap-2 items-center">
                 <img src={Star} alt="" />
                 <h3 className="text-white">{vote_average ? parseFloat(vote_average.toFixed(1)) : "N/A"}</h3>
                 <span className="text-white text-xl opacity-50">&#x2022;</span>
                 <h3 className="text-white capitalize">{original_language}</h3>
                 <span className="text-white text-xl opacity-50">&#x2022;</span>
                 <h3 className="text-white">{genre_names ? genre_names.slice(0,1) : "N/A"}</h3>
                 <span className="text-white text-xl opacity-50">&#x2022;</span>
                 <h3 className="text-white">{release_date ? `${release_date.split("-")[0]}` : "N/A"}</h3>
                 </div>
                 <button className="h-full cursor-pointer" onClick={toggleBookmark}>{toggle ? <BsBookmarkFill className="h-full" color="#FFFFFF"/> : <BsBookmark className="h-full" color="#FFFFFF"/>}</button>
             </div>
        </div>
     );
}
 
export default Card;