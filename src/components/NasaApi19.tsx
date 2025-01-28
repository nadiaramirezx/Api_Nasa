import React, { useEffect, useState, useTransition } from 'react'


// Definimos el tipo de dato que esperamos obtener
interface NasaData {
   identifier: string;
   caption: string;
   image: string;
   date: string;
 }
 
 function NasaApi19() {
   const apiKey = "UZHrDmWJ1Yoqq8ihKJo5FxHk5ImTkmqniwKTpQQj"; 
   const url = `https://api.nasa.gov/EPIC/api/natural/images?api_key=${apiKey}`;

   // Definición de estados del componente
  const [images, setImages] = useState<NasaData[]>([]);
  const [selectedImage, setSelectedImage] = useState<NasaData | null>(null);
  const [isPending, startTransition] = useTransition();
  
  // Función que llama a la API usando fetch
  const fetchData = () => {
   return fetch(url)
     .then((res) => {
       if (!res.ok) {
         throw new Error('La conexión falló'); //mensaje de error
       }
       return res.json();
     })
     .then((data) => {
       console.log(data); // Verifica los datos a recibir
       setImages(data);
     })
     .catch((error) => {
       console.error('Error:', error);
     });
 };
  // Hook que carga los datos desde el localstorage
   useEffect(() => {
   const storedImage = localStorage.getItem("selectedImage");
   if (storedImage) {
     setSelectedImage(JSON.parse(storedImage));
   }
   fetchData();
 }, []);


  // Guardar la tarjeta seleccionada en localStorage
  const handleImageClick = (image: NasaData) => {
   startTransition(() => {
     setSelectedImage(image);
     localStorage.setItem("selectedImage", JSON.stringify(image));
   });
 };

  return (
   <div className="container">
      {/* Mostrar la tarjeta seleccionada */}
      {selectedImage && (
        <div className="selected-card">
          <h2 className="image-title">{selectedImage.caption}</h2>
          <img className="image" src={`https://epic.gsfc.nasa.gov/archive/natural/${selectedImage.date
            .split(" ")[0]
            .replace(/-/g, "/")}/png/${selectedImage.image}.png`} alt={selectedImage.caption} />
          <p className="image-date"> {new Date(selectedImage.date).toLocaleString()} </p>
        </div>
      )}
      {/* Lista de elementos clickeables */}
      <ul className="image-list">
        {images.length > 0 ? (
          images.map((image) => (
            <li key={image.identifier} className="image-list-item" onClick={() => handleImageClick(image)}>
              {image.caption}
            </li>
          ))
        ) : (
          <p className="loading-text">Cargando...</p>
        )}
      </ul>

   </div>
  );
}
export default NasaApi19;