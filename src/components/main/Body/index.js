import React from 'react';
import {
  Routes,
  Route
} from 'react-router-dom';
import { Index } from 'Pages';
import './styles.scss';


export default function Body(){
  return (
    <div className="main-body">
        <Routes>
          <Route element={<Index />} exact path="/" />
          <Route element={<div>Hello this is detail</div>} path="/detail" />        </Routes>
    </div>
  )
}