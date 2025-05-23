import React from "react";

const Pagination = ({setCurrentPage, total_pages, total_results, page}) => {
    const nextPage = () => {
        setCurrentPage(prev => {
            if(prev>=total_pages){
                return prev;
            }
            else{
                return prev+1;
            }
        });
    }

    const previousPage = () => {
        setCurrentPage(prev => {
              if (prev === 1){
                return prev;
            }
            else{
                return prev-1;
            }
        });
    }
    return ( 
        <div className="w-full h-auto items-center flex justify-between mt-14 mb-16 px-8">
            <button className="bg-TrendingRed px-4 py-2 text-white rounded-md cursor-pointer font-semibold" onClick={previousPage}>Previous</button>
            <h2 className="text-red-500"><span className="font-bold text-slate-300 hover:text-white transition duration-200">{`Page ${page} `}</span>{`of ${total_pages}`}</h2>
             <button className="bg-TrendingRed px-4 py-2 text-white rounded-md cursor-pointer font-semibold" onClick={nextPage}>Next</button>
        </div>
     );
}
 
export default Pagination;