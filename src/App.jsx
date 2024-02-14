import React, { useState, useEffect } from 'react'

import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [books, setBooks] = useState([]);
  const [db, setDb] = useState(null);
  const [currentFilm, setCurrentFilm] = useState({ id: '', titre: '', description: '', category: '' });

  

  const fetchedBooks = [
    { id: 1, title: "L'Étranger", category: "Roman", description: "Un roman d'Albert Camus sur l'absurdité de la vie." },
    { id: 2, title: "À la recherche du temps perdu", category: "Roman", description: "L'œuvre majeure de Marcel Proust." },
    { id: 3, title: "Madame Bovary", category: "Roman", description: "Un chef-d'œuvre de Gustave Flaubert sur les désirs inassouvis." },
    { id: 4, title: "Les Misérables", category: "Roman historique", description: "L'épopée de Victor Hugo sur la justice et la rédemption." },
    { id: 5, title: "Le Petit Prince", category: "Conte philosophique", description: "Un conte touchant d'Antoine de Saint-Exupéry." },
    { id: 6, title: "Germinal", category: "Roman social", description: "Un roman d'Émile Zola sur la condition ouvrière." },
    { id: 7, title: "Voyage au bout de la nuit", category: "Roman", description: "L'œuvre majeure de Louis-Ferdinand Céline." },
    { id: 8, title: "La Peste", category: "Roman", description: "Un roman d'Albert Camus sur une épidémie à Oran." },
    { id: 9, title: "Les Fleurs du mal", category: "Poésie", description: "Un recueil de poèmes de Charles Baudelaire." },
    { id: 10, title: "Candide", category: "Conte philosophique", description: "Un conte satirique de Voltaire." },
    { id: 11, title: "Notre-Dame de Paris", category: "Roman historique", description: "Un roman de Victor Hugo sur le destin tragique d'Esmeralda." },
    { id: 12, title: "Bel-Ami", category: "Roman", description: "Un roman de Guy de Maupassant sur l'ascension sociale." },
    { id: 13, title: "Le Comte de Monte-Cristo", category: "Roman d'aventure", description: "Un roman d'Alexandre Dumas sur la vengeance." },
    { id: 14, title: "La Chute", category: "Roman", description: "Un roman d'Albert Camus sur la culpabilité et la chute morale." },
    { id: 15, title: "Thérèse Raquin", category: "Roman", description: "Un roman naturaliste d'Émile Zola." },
    { id: 16, title: "Les Trois Mousquetaires", category: "Roman d'aventure", description: "Un roman d'Alexandre Dumas sur l'amitié et l'aventure." },
    { id: 17, title: "Du côté de chez Swann", category: "Roman", description: "Le premier tome de l'œuvre de Marcel Proust." },
    { id: 18, title: "L'Assommoir", category: "Roman social", description: "Un roman d'Émile Zola sur la vie dans les quartiers populaires de Paris." },
    { id: 19, title: "Nana", category: "Roman", description: "Un roman d'Émile Zola sur la décadence de la société parisienne." },
    { id: 20, title: "Les Rougon-Macquart", category: "Série de romans", description: "Une série de romans d'Émile Zola dépeignant la société française sous le Second Empire." }
  ];
  useEffect(()=>{
    const request = indexedDB.open("LibraryDb", 1)
    request.onupgradeneeded = function(event){ // S'éxécute au moment ou la BDD est crée et lorsqu'elle change de version
      const db = event.target.result
      db.createObjectStore('books', { keyPath: 'id', autoIncrement: true})
    }
    request.onsuccess = function(event){ // Si la fonction open a été éxécutée avec succès
      setDb(event.target.result)
      InsertBooks(event.target.result)
      fetchBooks(event.target.result)

    }
    // Fonction pour charger les livres depuis la base de données
    const fetchBooks = function (db) {
      const transaction = db.transaction(["books"], "readonly");
      const bookStore = transaction.objectStore("books");
      // Mettre à jour l'état "books" avec les livres chargés
      const request = bookStore.getAll();
      request.onsuccess = function () {
        setBooks(request.result);
        console.log(request.result);
      };
    };

    const InsertBooks = function (db) {
      const transaction = db.transaction(["books"], "readwrite");
      const bookStore = transaction.objectStore("books");

      // Ajouter les livres de fetchedBooks
      fetchedBooks.forEach((book) => {
        bookStore.add(book);
      });
    }
    

  }, [])

  
  
  return (
    
    <>
      <div className="container mt-4 mb-4">
      <input type="text" value="Rechercher Un livre " className="form-control mb-4" />
      {books.map(book => (
      <div className="row mb-3 bg-body-tertiary shadow-sm " key={book.id}>

        <div className="col-md-3"> <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqKgpctFDqyyTTcugJX-etCXDsOstrC-lq3553mX2ISchytmwCTvx98BH4O03f_DIPE5c&usqp=CAU" className='img-responsive  ' alt="" /></div>
        <div className="col-md-6">
          <h4> {book.title} </h4>
          <p>{book.description}</p>
          <h5>Categorie: <span>{book.category} </span> </h5>
        </div>
        <div className="col-md-3">
          <button className="btn btn-warning mx-2"> Editer</button>
          <button className="btn btn-danger"> Supprimer</button>
        </div>
      </div>

        ))}
        </div>
    </>
  )
}

export default App
