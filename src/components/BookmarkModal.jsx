import React, { useEffect, useState } from "react";
import { BsXCircleFill, BsFilm } from "react-icons/bs";
import Card from "./Card";

const Modal = (props) => {
const [bookmarkedMovies, setbookmarkedMovies] = useState([]);

const setOpenModal = props.setOpenModal;
const openModal = props.openModal;

const exitModal = () => {
    setOpenModal(false);
}

const getBookmarks = () => {
    const storedBookmarks = JSON.parse(localStorage.getItem("bookmark")) || [];
    const allBookmarks = storedBookmarks.map(movie => movie.movieObj);
    console.log("mapped IDs from localstorage bookmarks, ", allBookmarks);
    setbookmarkedMovies(allBookmarks);
}

useEffect(()=>{
    getBookmarks();
},[openModal])
    return ( 
        <div className="w-full h-full rounded-lg relative z-30 p-5 overflow-y-scroll">
            <button className="relative text-white cursor-pointer float-right mb-4" onClick={exitModal}><BsXCircleFill className="text-white/80 hover:text-white" size={20}/></button>
            <div className="relative w-full h-auto flex items-center justify-center">
                {
                    bookmarkedMovies.length === 0 ? <div className="relative flex flex-col gap-20 items-center"><h1 className="text-white/30 text-2xl font-bold text-center">Your Bookmark List is Currently Empty</h1><BsFilm className="text-white/10" size={100}></BsFilm></div> : 
                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">{
                    bookmarkedMovies.map((bookmarkedMovie, index) => (
                        <Card key={index} {...bookmarkedMovie}/>
                    ))}
                    </div>
                }
            </div>
        </div>
     );
}
 
export default Modal;