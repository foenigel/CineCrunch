import React from "react";

const MovieScenes = ({movieScenes}) => {
    const getScenePath = movieScenes.map((scene) => scene.file_path);
    const filteredScenes = getScenePath.filter(scene => scene !== "" && scene !== null);

    const shuffleScenes = (array) => {
        let arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }
    const shuffledScenes = shuffleScenes(filteredScenes);
    const randomSixScenes = shuffledScenes.slice(0, 6);

    return ( 
        <div className="grid grid-cols-1 w-full h-auto sm:grid-cols-3 sm:gap-4">
            {
                randomSixScenes.map((scene, index) => (
                <img key={index} className="rounded-xl" src={`https://image.tmdb.org/t/p/w780${scene}`} alt="Movie-Scenes" />
                ))
            }
        </div>
     );
}
 
export default MovieScenes;