

const ClientId = "2912e84601e04fde88e99f2b6a18b765",
ClientSecret = "fd86f695cc5e4f4faffa6b1ad7f1d3aa",
d = document;
var token = "",
artistId = "",
albums = "",
tracks = "";

d.addEventListener("submit", e=>{
    e.preventDefault();
    if (e.target.matches(".head-form")){
        const $search = e.target.textoIngresado.value;
        pedirToken();
        setTimeout(() => {
            searchIdArtists(token, $search)
        }, 300);
        setTimeout(() => {
            searchAlbums(token, artistId);
        }, 600);
        e.target.reset(); // limpio el form
        setTimeout(() => {
            addRenderAlbum(albums.items);
        }, 900);
        setTimeout(() => {
            searchTracks(albums.items[0].id);
        }, 1200);
    }
})

d.addEventListener("click", (e)=>{
    if (e.target.matches(".main-section")){
        addRenderTracks(e.target);
    }
})

const addRenderTracks = (selectedAlbum)=>{
    const albumId = selectedAlbum.querySelector("input").value,
    albumName = selectedAlbum.querySelector("p").textContent,
    $contenedor = d.querySelector(".second-container"),
    $template = d.getElementById("template-card-tracks").content,
    $allCards = d.querySelectorAll(".second-section"),
    $fragment = d.createDocumentFragment();
    searchTracks(albumId);
    setTimeout(() => {
        $allCards.forEach(card =>{
            //remuevo todos los albumes anteriores(si los hay)
            $contenedor.removeChild(card);
        });
        tracks.items.forEach(e=>{
            $contenedor.querySelector("h2").textContent = selectedAlbum.querySelector("p").textContent;
            $template.querySelector("img").setAttribute("src", selectedAlbum.querySelector("img").getAttribute("src"));            
            $template.querySelector("p").textContent = e.name;
            $template.querySelector("input").value = e.id;

            let $clone = d.importNode($template,true);
            $fragment.appendChild($clone);
        })

        $contenedor.appendChild($fragment); //inserción al DOM
        
    }, 400);
    
}

const addRenderAlbum = (albums)=>{
    let $contenedor = d.querySelector(".main-container"),
    $template = d.getElementById("template-card-albums").content,
    $allCards = d.querySelectorAll(".main-section"),
    $fragment = d.createDocumentFragment();

    $allCards.forEach(card =>{
        //remuevo todos los albumes anteriores(si los hay)
        $contenedor.removeChild(card);
    })

    albums.forEach(e => {
        $template.querySelector("img").setAttribute("src", e.images[0].url);
        $template.querySelector("p").textContent = e.name;
        $template.querySelector("input").value = e.id;
        

        let $clone = d.importNode($template,true);
        $fragment.appendChild($clone);
    });

    $contenedor.appendChild($fragment); //inserción al DOM
}

async function pedirToken(){
    //Esta funcion recupera el token de autenticacion de un usuario y lo almacena en la variable global "token"
    token = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials&client_id=' + ClientId + '&client_secret=' + ClientSecret
    }).then((respuesta) => (respuesta.ok ? respuesta.json() : Promise.reject(respuesta))) //si hay un error salta directamente al catch, sino convierte la respuesta a json)
    .then(data => {return data.access_token})
    .catch((err) => { //manejo del error
        console.log(`Error: no se pudo recuperar el token`)
    })
}



//Esta funcion busca un artista y retorna su id, para así poder recuperar su contenido
async function searchIdArtists (token, inputSearch){
    var artistParameters = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    }
    artistId = await fetch('https://api.spotify.com/v1/search?query='+inputSearch+'&type=artist', artistParameters)
    .then(response => response.json())
    .then(data => {return data.artists.items[0].id})
    .catch((err)=>{
        console.log(`Error: no se pudo recuperar el artista `+err);
    })
}


//Esta funcion busca los albumes de un artista con su id

async function searchAlbums (token, artistId){
    const albumsParameters = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    }
    albums = await fetch('https://api.spotify.com/v1/artists/'+ artistId +'/albums?include_groups=album&market=ES&limit=50'  , albumsParameters)
    .then(response => response.json())
    .then(data => {console.log(data.items);return data})
    .catch((err)=>{
        console.log(`Error: no se pudo recuperar el artista`+err);
    })
}

const searchTracks = async (album)=>{
    const albumsParameters = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    }
    tracks = await fetch("https://api.spotify.com/v1/albums/"+album+"/tracks", albumsParameters)
    .then(response => response.json())
    .then(data => {return data})
    .catch(err=>{
        console.log(`Error: no se pudo recuperar el artista`+err);
    });
}





