import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Home from './components/Home'
import { Routes, Route } from 'react-router-dom'
import MovieDetails from './components/MovieDetails'

function App() {

  return (
    <>
    <Routes>  
      <Route path='/' element={<Home/>}/>
      <Route path='/movie/:title/:id' element={<MovieDetails/>}/>
    </Routes>
    </>
  )
}

export default App
