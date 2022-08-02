import React from 'react';
import {
  Routes,
  Route
} from 'react-router-dom';
import { Index, Detail } from 'Pages';
import './styles.scss';


export default function Body(){
  return (
    <div className="main-body">
        <Routes>
          <Route element={<Index />} exact path="/" />
          <Route element={<Detail />} path="/create" />
          <Route element={<Detail />} path="/detail/:id" />
        </Routes>
    </div>
  )
}