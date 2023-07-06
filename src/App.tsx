import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import './App.css'


const socket = io('https://react-node-socket-image.vercel.app:4000/api');

const App = () => {
  const [image, setImage] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('general');

  useEffect(() => {
    
    socket.emit('joinRoom', selectedRoom);

    socket.on('image', (receivedImage) => {
      setImage(receivedImage);
    });

    return () => {
      socket.emit('leaveRoom', selectedRoom);
      socket.off('image');
    };
  }, [selectedRoom]);

  const handleFileChange = (event:any) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      const base64Image = reader.result;

      // Send the base64 encoded image to the server
      socket.emit('uploadImage', { room: selectedRoom, image: base64Image }, (response:any) => {
        console.log(response); 
      });
    };

    reader.readAsDataURL(file);
  };

  const handleRoomChange = (event:any) => {
    setSelectedRoom(event.target.value);
  };

  return (
    <><div className='center'>
      <h2>Image Uploader</h2>
    </div><div className="container">
        <div className="grid">
          <div className="grid-item">
            <input type="file" onChange={handleFileChange} />
            <select value={selectedRoom} onChange={handleRoomChange}>
              <option value="general">General</option>
              <option value="faceimage">Face Image</option>
            </select>
          </div>
          <div className="grid-item">
            {image && <img src={image} alt="Received Image" />}
          </div>
        </div>
      </div></>
   
  );
};

export default App;
