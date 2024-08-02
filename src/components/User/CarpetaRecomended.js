import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./SignForm.css"

const CarpetaRecomended = ({ carpeta, data, onFolderSelect, classifierData }) => {
    const url = process.env.REACT_APP_BACK_URL;

    const [abierta, setAbierta] = useState(false);
    const [selectedRecomendedFolders, setSelectedRecomendedFolders] = useState([]);

    const toggleAbierta = () => {
        setAbierta(!abierta);
    };

    useEffect(() => {
        const obtenerCarpetasSeleccionadas = async () => {
            try {
                const response = await axios.get(url + '/obtener-carpetasrecomendadas');
                const carpetasSeleccionadas = response.data;

                setSelectedRecomendedFolders(carpetasSeleccionadas);
            } catch (error) {
                console.error('Error al obtener carpetas seleccionadas:', error);
            }
        };

        obtenerCarpetasSeleccionadas();
    //eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const toggleSeleccion = (e) => {
        e.stopPropagation();

        const isSelected = selectedRecomendedFolders.some((selected) => selected.IdFolder === carpeta.IdFolder);

        if (isSelected) {
            setSelectedRecomendedFolders((prevSelected) => prevSelected.filter((selected) => selected.IdFolder !== carpeta.IdFolder));
        } else {
            setSelectedRecomendedFolders((prevSelected) => [...prevSelected, carpeta]);
        }

        const isFolderInDatabase = classifierData && classifierData.some(c => c.IdFolder === carpeta.IdFolder);

        if (isFolderInDatabase) {
            if (isSelected) {
                setSelectedRecomendedFolders((prevSelected) => prevSelected.filter((selected) => selected.IdFolder !== carpeta.IdFolder));
            } else {
                eliminarCarpetaDeBaseDeDatos(carpeta.IdFolder);
            }
        }

        onFolderSelect({ IdFolder: carpeta.IdFolder, Name: carpeta.Name, IdParent: carpeta.IdParent, isSelected: !isSelected });
    };

    const eliminarCarpetaDeBaseDeDatos = async (idFolder) => {
        try {
            await axios.delete(url + `/eliminar-carpetacarpetasrecomendadas/${idFolder}`);
            console.log('Carpeta eliminada de la base de datos:', idFolder);
        } catch (error) {
            console.error('Error al eliminar carpeta de la base de datos:', error.message);
        }
    };

    const carpetaContieneSubcarpetas = (idCarpeta, data) => {
        return data.some(subcarpeta => subcarpeta.IdParent === idCarpeta);
    };

    const LineaConexion = () => {
        if (carpeta.IdParent) {
            return (
                <svg
                    style={{
                        position: 'absolute',
                        left: '-20px',
                        width: '20px',
                        bottom: '14px',
                        height: '100%',
                    }}
                >
                    <line
                        x1="10"
                        y1="0"
                        x2="10"
                        y2="100%"
                        stroke="#555"
                        strokeWidth="2"
                    />
                    <line
                        x1="10"
                        y1="100%"
                        x2="20"
                        y2="100%"
                        stroke="#555"
                        strokeWidth="2"
                    />
                </svg>
            );
        }
        return null;
    };

    //icono de carpeta cerrada
    const FolderClosedIcon = () => (
        <svg height='25' width='25' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 10.5v6m3-3H9m4.06-7.19l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
        </svg>
    );
    //icono de carpeta abierta
    const FolderOpenIcon = () => (
        <svg height='25' width='25' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 13.5H9m4.06-7.19l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
        </svg>
    );

    return (
        <div style={{ position: 'relative' }}>
            <LineaConexion />
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <div className='icono-carpetas-clasificador' onClick={toggleAbierta}>
                    {abierta ? <FolderOpenIcon /> : <FolderClosedIcon />}
                    <span className="texto-carpetas" style={{ fontWeight: selectedRecomendedFolders.some((selected) => selected.IdFolder === carpeta.IdFolder) ? 'bold' : 'normal', color: 'black' }}>{carpeta.Name}</span>
                </div>
                <input type="checkbox" checked={selectedRecomendedFolders.some((selected) => selected.IdFolder === carpeta.IdFolder)} onChange={toggleSeleccion} style={{ marginLeft: '10px', marginTop: '5px' }} />
            </div>
            {abierta && carpetaContieneSubcarpetas(carpeta.IdFolder, data) && (
                <ul style={{ listStyleType: 'none', paddingLeft: '20px', marginTop: '5px' }}>
                    {data
                        .filter(subcarpeta => subcarpeta.IdParent === carpeta.IdFolder)
                        .map(subcarpeta => (
                            <li key={subcarpeta.IdFolder}>
                                <CarpetaRecomended carpeta={subcarpeta} data={data} onFolderSelect={onFolderSelect} />
                            </li>
                        ))}
                </ul>
            )}
        </div>
    );
};

export default CarpetaRecomended;