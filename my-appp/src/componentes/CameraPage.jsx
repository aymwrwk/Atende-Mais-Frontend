/*import React, { useRef, useState } from 'react';
import axios from 'axios';

const CameraPage = () => {
    const videoRef = useRef(null);
    const [isCameraOn, setCameraOn] = useState(false);

    const startCamera = async () => {
        setCameraOn(true);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "environment" }
                // video: { facingMode: "environment" } // Câmera traseira
            });
            videoRef.current.srcObject = stream;
        } catch (error) {
            console.error("Erro ao acessar a câmera:", error);
            alert("Câmera não disponível.");
        }
    };

    const captureImage = () => {
        
        const canvas = document.createElement('canvas');
        const video = videoRef.current;

        if (!video) {
            console.error("Vídeo não encontrado.");
            return;
        }

        canvas.width = video.videoWidth * 2;
        canvas.height = video.videoHeight * 2;
        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
        //const imageData = canvas.toDataURL('image/png');
        const imageData = canvas.toDataURL('image/jpeg', 0.9);

        console.log("Imagem capturada:", imageData);
        handleCapture(imageData);
    };

    const handleCapture = async (imageData) => {
        console.log("Imagem capturada:", imageData); // Verificar captura
        if (!imageData) {
            console.error('Imagem capturada está vazia.');
            return;
        }

        try {
            const response = await axios.post(
                'https://atende-mais.shop/pedido/orc',
                { image: imageData },
                { headers: { 'Content-Type': 'application/json' } }
            );
            console.log('Resposta do backend:', response.data);
        } catch (error) {
            console.error('Erro ao enviar imagem:', error);
        }
    };

    const stopCamera = () => {
        setCameraOn(false);
        const stream = videoRef.current.srcObject;
        if (stream) {
            stream.getTracks().forEach((track) => track.stop());
        }
    };

    return (
        <div>
            <h1>Leitor de Câmera</h1>
            {isCameraOn ? (
                <div>
                    <video ref={videoRef} autoPlay style={{ width: '100%' }} />
                    <button onClick={captureImage}>Capturar</button>
                    <button onClick={stopCamera}>Desligar Câmera</button>
                </div>
            ) : (
                <button onClick={startCamera}>Ativar Câmera</button>
            )}
        </div>
    );
};

export default CameraPage;
*/

/*import React, { useEffect, useRef, useState } from "react";

const CameraCapture = () => {
  const videoRef = useRef(null);
  const [image, setImage] = useState(null);
  
  useEffect(() => {
    const initCamera = async () => {
      try {
        // Inicialize a câmera com resolução ideal
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1920 }, height: { ideal: 1080 }, facingMode: "environment" }
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          
          // Adiciona o filtro CSS ao elemento de vídeo
          videoRef.current.style.filter = 'brightness(1.2) contrast(1.1)';
        }
      } catch (err) {
        console.error("Erro ao acessar a câmera: ", err);
      }
    };

    initCamera();
  }, []);

  const handleCapture = async () => {
    if (videoRef.current && videoRef.current.srcObject) {
      try {
        // Usa a API ImageCapture para capturar a imagem com qualidade máxima
        const track = videoRef.current.srcObject.getVideoTracks()[0];
        const imageCapture = new ImageCapture(track);
        const blob = await imageCapture.takePhoto();
        
        // Converte o blob para uma URL para exibir a imagem
        const imageUrl = URL.createObjectURL(blob);
        setImage(imageUrl);
      } catch (err) {
        console.error("Erro ao capturar a imagem: ", err);
      }
    }
  };

  return (
    <div>
      <video ref={videoRef} autoPlay playsInline style={{ width: '100%', height: 'auto' }}></video>
      <button onClick={handleCapture}>Capturar Imagem</button>
      
      {image && (
        <div>
          <h3>Imagem Capturada:</h3>
          <img src={image} alt="Imagem Capturada" style={{ width: '100%', height: 'auto' }} />
        </div>
      )}
    </div>
  );
};

export default CameraCapture;*/


import React, { useRef, useState } from 'react';
import axios from 'axios';

const CameraCapture = () => {
    const videoRef = useRef(null);
    const [isCameraOn, setCameraOn] = useState(false);
    const [responseMessage, setResponseMessage] = useState(''); // Estado para armazenar a resposta do backend

    const startCamera = async () => {
        setCameraOn(true);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "environment" }
            });
            videoRef.current.srcObject = stream;
        } catch (error) {
            console.error("Erro ao acessar a câmera:", error);
            alert("Câmera não disponível.");
        }
    };

    const captureImage = async () => {
        const video = videoRef.current;
        if (!video) {
            console.error("Vídeo não encontrado.");
            return;
        }

        const track = video.srcObject.getVideoTracks()[0];
        const imageCapture = new ImageCapture(track);
        try {
            const blob = await imageCapture.takePhoto();
            const imageData = await convertBlobToBase64(blob);

            // Envio da imagem para o backend
            const response = await axios.post(
                'https://atende-mais.shop/pedido/orc',
                { image: imageData },
                { headers: { 'Content-Type': 'application/json' } }
            );
            
            // Atualize o estado com a resposta do backend
            setResponseMessage(response.data);
            console.log('Resposta do backend:', response.data);
        } catch (error) {
            console.error('Erro ao capturar ou enviar a imagem:', error);
        }
    };

    const stopCamera = () => {
        setCameraOn(false);
        const stream = videoRef.current.srcObject;
        if (stream) {
            stream.getTracks().forEach((track) => track.stop());
        }
    };

    // Função para converter o Blob para base64
    const convertBlobToBase64 = (blob) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    };

    return (
        <div>
            <h1>Leitor de Câmera</h1>
            {responseMessage && <p>{responseMessage}</p>} {/* Exibe a resposta do backend */}
            
            {isCameraOn ? (
                <div>
                    <video ref={videoRef} autoPlay style={{ width: '100%' }} />
                    <button onClick={captureImage}>Capturar</button>
                    <button onClick={stopCamera}>Desligar Câmera</button>
                </div>
            ) : (
                <button onClick={startCamera}>Ativar Câmera</button>
            )}
        </div>
    );
};

export default CameraCapture;
