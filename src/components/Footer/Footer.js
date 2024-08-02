import React, { useState, useEffect } from 'react'
import "./Footer.css"
import axios from 'axios';

const Footer = () => {
  const url = process.env.REACT_APP_BACK_URL;

  const [editorHtml, setEditorHtml] = useState('');
  const [backgroundColor, setBackgroundColor] = useState({ r: 51, g: 51, b: 51, a: 1 });

  useEffect(() => {
    const obtenerContenido = async () => {
      try {
        const response = await axios.get(url + '/obtener-contenido-footer');
        const { contenido, backgroundColor } = response.data;
        setEditorHtml(contenido || '');
        setBackgroundColor(backgroundColor || { r: 51, g: 51, b: 51, a: 1 });
      } catch (error) {
        console.error('Error al obtener el contenido desde el servidor:', error);
      }
    };

    obtenerContenido();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <footer className='footer' style={{ backgroundColor: `rgba(${backgroundColor.r}, ${backgroundColor.g}, ${backgroundColor.b}, ${backgroundColor.a})`, color: '#ffffff' }}>
      <div dangerouslySetInnerHTML={{ __html: editorHtml }} />
    </footer>
  )
}

export default Footer;