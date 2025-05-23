import React from "react";
import searchBarVector from "../assets/MovieAssets/searchBar.svg"

const Searchbar = ({searchTerm, setSearchTerm}) => {
    return ( 
    <div className="w-full px-4 flex gap-4 rounded-lg max-w-[500px] bg-searchBarGray h-auto py-3">
         <img src={searchBarVector} alt="SearchbarIcon" />
         <input className="text-white w-full focus:outline-none" onChange={(e) => setSearchTerm(e.target.value)} value={searchTerm}  type="text" placeholder="Search through 300+ movies online" />
    </div> );
}
 
export default Searchbar;