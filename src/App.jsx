import  { useState, useEffect } from 'react'
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// import axios from 'axios'; // For Node.js

function App() {
  // const firebaseConfig = {
  //   apiKey: import.meta.apiKey,
  //   authDomain: import.meta.authDomain,
  //   projectId: import.meta.projectId,
  //   storageBucket: import.meta.storageBucket,
  //   messagingSenderId: import.meta.messagingSenderId,
  //   appId: import.meta.appId,
  //   measurementId: import.meta.measurementId,
  // };
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

  const [books, setBooks] = useState([]);
  const [db, setDb] = useState(null);
  const [currentBook, setCurrentBook] = useState({ id: '', title: '',url: '', description: '', category: '' });

  const [editMode, setEditMode] = useState(false);

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
    
    // axios({
    //   method: 'get',
    //   url: 'https://firestore.googleapis.com/v1/projects/YOUR_PROJECT_ID/databases/(default)/documents/YOUR_COLLECTION/YOUR_DOCUMENT?key=YOUR_API_KEY',
    //   responseType: 'json'
    // })
    //   .then(function (response) {
    //     // response.data.pipe(fs.createWriteStream('ada_lovelace.jpg'))
    //   });

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
    const InsertBooks = function (db) {
      const transaction = db.transaction(["books"], "readwrite");
      const bookStore = transaction.objectStore("books");
      // Ajouter les livres de fetchedBooks
      fetchedBooks.forEach((book) => {
        bookStore.add(book);
      });
    }
    

  }, [])

  const fetchBooks = function (db) {
    const transaction = db.transaction(["books"], "readonly");
    const bookStore = transaction.objectStore("books");
    // Mettre à jour l'état "books" avec les livres chargés
    const request = bookStore.getAll();
    request.onsuccess = function () {
      setBooks(request.result);
    };

  };
  const addBook = (book) => {
    const transaction = db.transaction(["books"], "readwrite")
    const bookStore = transaction.objectStore('books')
    bookStore.add(book) // ajoute l\element a indexedDb
    fetchBooks(db)
  }
  const handleSubmit = (event) => {
    event.preventDefault()

    setEditMode(false)

    if(editMode){
      updateBook(currentBook)
    }else{
      addBook({...currentBook, id: Date.now()})
    }
    setCurrentBook({id: "", title: '', url: '', description: '', category: ''})

  }
  
  const deleteBook = (id) => {
    const transaction = db.transaction(["books"], "readwrite")
    const bookstore = transaction.objectStore('books')
    bookstore.delete(id) // supprimer l'element avec le id en indexedDb
    fetchBooks(db)
  }
  const updateBook = (book) => {
    const transaction = db.transaction(["books"], "readwrite")
    const bookStore = transaction.objectStore('books')
    bookStore.put(book) // mis a jour de l'element en indexedDb 
    fetchBooks(db)
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setCurrentBook(prev => ({ ...prev, [name]: value }));

  }

  
  return (
    
    <>
      <div className="container mt-4 mb-4">
      {/* ********************* add book description **************** */}
      {/* <!-- Button trigger modal --> */}
      {/* <nav className=" "> */}
          <div className="row navbar fixed-top navbar-light bg-light mb-4 px-2">
            <div className="col-10">
              <input type="text" value="Rechercher Un livre " className="form-control " />
            </div>
            <div className="col-2">
              <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                <i className="fa-solid fa-plus"></i> 
            </button>
            </div>
          </div>    
      {/* </nav> */}
      

        {/* <!-- Modal --> */}
        <div className="modal fade mt-5" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="exampleModalLabel">Ajouter Un Nouveau Livre </h1>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Titre</label>
                        <input type="text" className="form-control" name="title" value={currentBook.title} onChange={handleInputChange}  />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Categorie</label>
                        <input className="form-control" name="category" value={currentBook.category} onChange={handleInputChange} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Description</label>
                        <textarea className="form-control" name="description" value={currentBook.description} onChange={handleInputChange} ></textarea>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">url image </label>
                        <input type="text" className="form-control" name="url" value={currentBook.annee} onChange={handleInputChange}  />
                    </div>
                    <button type="submit" className="btn btn-primary">{editMode ? 'Mettre à jour' : 'Ajouter'} Le Livre</button>
                </form>
              </div>
              
            </div>
          </div>
        </div>
    
      {books.map(book => (
      <div className="row mb-3 bg-body-tertiary shadow-sm p-3 rounded-5" key={book.id}>
        <div className="col-md-3 col-12 justify-content-center ">
            {book.url ? (
                <img src={book.url} alt={book.title} className="img-responsive img-thumbnail" style={{height: "200px", width: "300px"}} /> // Use alt text for accessibility
              ) : (
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqKgpctFDqyyTTcugJX-etCXDsOstrC-lq3553mX2ISchytmwCTvx98BH4O03f_DIPE5c&usqp=CAU"
                  alt="Placeholder book image" // Descriptive alt text for placeholder
                  className="img-responsive "
                />
              )}
              </div>
      <div className="col-md-6">
          <h4> {book.title} </h4>
          <p> {book.description} </p>
          <h5>Categorie: <span>{book.category} </span> </h5>
        </div>
        <div className="col-md-3 py-4">
          <button type="button" className="btn btn-warning mx-3" data-bs-toggle="modal" data-bs-target="#exampleModal"
          onClick={() => {
                                    setEditMode(true)
                                    setCurrentBook(book)
                                }}>
           Edit  <i className="fa-solid fa-edit"></i>
        </button>
          <button className="btn btn-danger" onClick={() => { deleteBook(book.id) }}> Supprimer</button>
        </div>
      </div>

        ))}
        </div>
    </>
  )
}

export default App
