import  { useState, useEffect } from 'react';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import axios from 'axios'


function App() {

  /* en principe les donnees sensibles ci-dessus doivent etre dans le fichier .env.developpement.local 
  mais lors que je les mets labas elles ne sont pas accessible donc je les garde ici etant donnee que c'est 
  un projet pas sensible. pour la version 2 nous les mettrons labas et travailler avec les variables d'environement */
  const firebaseConfig = {
    apiKey: "AIzaSyAkwkENO3aZqdbepwveC1VfuxKeTsFluwU",
    authDomain: "books-71449.firebaseapp.com",
    projectId: "books-71449",
    storageBucket: "books-71449.appspot.com",
    messagingSenderId: "320696521167",
    appId: "1:320696521167:web:fa81641019ed080834c2ba",
    measurementId: "G-8ZT8VS3GJQ"
  };

  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  
  const [books, setBooks] = useState([]);
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
    // Fonction pour charger les livres depuis la base de données firebase
    getBooks();
  }, [])

 
  const addBookOnFireStore = function (book) {
    const url_add_book = "https://firestore.googleapis.com/v1/projects/" + firebaseConfig.projectId + "/databases/(default)/documents/book?key=" + firebaseConfig.apiKey
    try{
        return axios.post(
            url_add_book,
            {
                "fields": {
                  "title": {
                    "stringValue": book.title
                  },
                  "description": {
                    "stringValue": book.description
                  },
                  "category": {
                    "stringValue": book.category
                  }
                }
              }
        )
        .then(function(response){
            return response.data 
        })

    } catch(e){
        console.error(e.response)
    }
  }
 
  
  /* delete book from the database FIREBASE */
  const deleteBookOnFireStore = function(id){ 
    const url_delete_book = "https://firestore.googleapis.com/v1/projects/" + firebaseConfig.projectId + "/databases/(default)/documents/book/" + id + "?key=" + firebaseConfig.apiKey
    try{
        return axios.delete(
            url_delete_book
        )
        .then(function(response){
            console.log(response)
        })
    } catch(e){
        console.error(e)
    }
    getBooks()
  };

  /* update a book from the database FIREBASE */
  const updateBookOnFireStore = function(id){
    const url_update_book = "https://firestore.googleapis.com/v1/projects/" + firebaseConfig.projectId + "/databases/(default)/documents/book/" +currentBook.id +"?key=" + firebaseConfig.apiKey
    try{
      return axios.patch(
          url_update_book,
          {
              "fields": {
                "title": {
                  "stringValue": currentBook.title
                },
                "description": {
                  "stringValue": currentBook.description
                },
                "category": {
                  "stringValue": currentBook.category
                }
              }
            }
      )
      .then(function(response){
          return response.data 
      })

  } catch(e){
        console.error(e)
    }
    // getBooks()

  }

  /* GEt all books from the database FIREBASE */
  const getBooks = async () => {
    const url = "https://firestore.googleapis.com/v1/projects/" + firebaseConfig.projectId + "/databases/(default)/documents/book/?key=" + firebaseConfig.apiKey
    try {
      const response = await axios.get(url);
      const books = response.data.documents.map((sp) => ({
        // id: sp.fields.id.stringValue, // Optional if not used
        title: sp.fields.title.stringValue,
        description: sp.fields.description.stringValue,
        category: sp.fields.category.stringValue,
      }));
      setBooks(books);  
      console.log(books);
      return books; 
    } catch (error) {
      console.error('Error getting books:', error.response.data);
    }
  };
  

  const addBook = (book) => {
    addBookOnFireStore(book);
    getBooks();
  }
  const handleSubmit = (event) => {
    event.preventDefault()

    setEditMode(false)

    if(editMode){
      updateBook(currentBook)
    }else{
      addBook(currentBook);
    }
    setCurrentBook({id: "", title: '', url: '', description: '', category: ''})

  }
  
  const deleteBook = (id) => {
    deleteBookOnFireStore(id);
    getBooks();
  }
  const updateBook = (book) => {
    updateBookOnFireStore(book);
    getBooks();
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
        <div className="modal fade mt-5" id="exampleModal"  aria-labelledby="exampleModalLabel" aria-hidden="true">
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
          <h4> {book.id} {book.title} </h4>
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
          <button className="btn btn-danger" onClick={() => {   deleteBook(book.id)  }}> Supprimer</button>
        </div>
      </div>

        ))}
        </div>
    </>
  )
}

export default App
