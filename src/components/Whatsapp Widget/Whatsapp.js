import React, { useEffect, useState } from 'react'
import { FloatingWhatsApp } from 'react-floating-whatsapp'
import avatar from '../../media/avatar.png';
import axios from 'axios';


const Whatsapp = () => {
    const url = process.env.REACT_APP_BACK_URL;
    
    const [phoneNumber, setPhoneNumber] = useState('');
    const [contactName, setContactName] = useState('');
    const [textMessage, setTextMessage] = useState('');
    const [statusMessage, setStatusMessage] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(url + '/obtener-widget-whatsapp');
                setPhoneNumber(response.data[0]?.contenido || '');
                setContactName(response.data[1]?.contenido || '');
                setTextMessage(response.data[2]?.contenido || '');
                setStatusMessage(response.data[3]?.contenido || '');
            } catch (error) {
                console.error('Error al obtener los datos del widget:', error);
            }
        };

        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <FloatingWhatsApp
                phoneNumber={phoneNumber}
                accountName={contactName}
                chatMessage={textMessage}
                statusMessage={statusMessage}
                avatar={avatar}
                placeholder="Mensaje"
                allowEsc="true"
                allowClickAway="true"
                messageDelay="1"
                notification="false"
                notificationDelay="5555"
                notificationSound="false"
            />
        </>
    )
}

export default Whatsapp;