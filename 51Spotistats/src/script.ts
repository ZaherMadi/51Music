async function initApp() {
const clientId = "1086596f94274f559255b1f60160c6c0";
const params = new URLSearchParams(window.location.search);
const code = params.get("code");
console.log(params, code);

if (window.location.pathname === '/callback' || window.location.pathname === '/callback.html') {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    if (code) {
        console.log("Code reçu eeee:", code);
        const accessToken = await getAccessToken(clientId, code);
        const profile = await fetchProfile(accessToken);
        populateUI(profile);          

        } else {
        console.error("Pas de code dans l'URL.");
    }

}

if (window.location.pathname === '/LoginPage.html') {
    
    if (!code) {
        redirectToAuthCodeFlow(clientId);
    } else {
        const accessToken = await getAccessToken(clientId, code);
        const profile = await fetchProfile(accessToken);
        localStorage.setItem('profile', JSON.stringify(profile));
        console.log(profile);
        populateUI(profile);
        
    }
}

if (window.location.pathname === '/TopAlbums.html') {

    const profile = localStorage.getItem('profile');
    const profileURI = localStorage.getItem('profileURI');
    const token = localStorage.getItem('token');
    const dataArtists = localStorage.getItem('TopArtists');
    const dataTracks = localStorage.getItem('TopTracks');
    const dataAlbums = localStorage.getItem('TopAlbums');

    if (!token) {
        redirectToAuthCodeFlow(clientId);
    }
    else {
        populateUITop(profile);
        console.log(profileURI, "profileURI");
            
        if(!dataAlbums)
        {

            if (dataArtists && dataTracks) {
                const parsedData = JSON.parse(dataArtists) + JSON.parse(dataTracks);
                displayTopAlbums(parsedData.items);
                console.log(parsedData.items);
              
            }

            else {
                if (!dataArtists && !dataTracks) {
                    fetchAlbums(token).then((data) => {
                        console.log(data);
                        localStorage.setItem('TopAlbums', JSON.stringify(data));
                        const parsedData = JSON.parse(JSON.stringify(data));
                        console.log(parsedData.items);
                        

                    });
                }


                if (!dataArtists) {
                    fetchArtists(token,20).then((data) => {
                        console.log(data);
                        localStorage.setItem('TopArtists', JSON.stringify(data));
                        const parsedData = JSON.parse(JSON.stringify(data));
                        displayTopArtists(parsedData.items);
                        console.log(parsedData.items);
                    });
                }
                if (!dataTracks) {
                    fetchTrack(token,20).then((data) => {
                        console.log(data);
                        localStorage.setItem('TopTracks', JSON.stringify(data));
                        const parsedData = JSON.parse(JSON.stringify(data));
                        displayTopTracks(parsedData.items);
                        console.log(parsedData.items);
                    });
                }

                
            
            }
        }

    }

}

if (window.location.pathname === '/TopTracks.html') {
    
    const profile = localStorage.getItem('profile');    
    const token = localStorage.getItem('token');
    const datarecue = localStorage.getItem('TopTracks');
    if (!token) {
        redirectToAuthCodeFlow(clientId);
    }
    else {
        if (datarecue) {
            const parsedData = JSON.parse(datarecue);
            displayTopTracks(parsedData.items);
            console.log(parsedData.items);

            if(profile){ 
            populateUITop(profile);
            console.log(profile, "if  datarecue");
            }
            else{
                console.log("no profile");
            }

        }
        else {
        fetchTrack(token,20).then((data) => {
            console.log(data);
            localStorage.setItem('TopTracks', JSON.stringify(data));
            const parsedData = JSON.parse(JSON.stringify(data));
            displayTopTracks(parsedData.items);
            console.log(parsedData.items);

            if(profile){ 
                populateUITop(profile);
                console.log(profile, "if  datarecue");
                }
                else{
                    console.log("no profile");
                }
        });


        }

    }
    
}


if (window.location.pathname === '/TopArtists.html') {
    
    const profile = localStorage.getItem('profile');
    const token = localStorage.getItem('token');
    const datarecue = localStorage.getItem('TopArtists');
    if (!token) {
        redirectToAuthCodeFlow(clientId);
    }
    else {
        if (datarecue) {
            const parsedData = JSON.parse(datarecue);
            const profile = localStorage.getItem('profile');
            displayTopArtists(parsedData.items);
            console.log(parsedData.items,"parsedData.items");
            if(profile){ 
                populateUITop(profile);
                console.log(profile, "if  datarecue");
            }
            else{
                    console.log("no profile");
            }
                
        }
        else {
        fetchArtists(token,20).then((data) => {
            console.log(data);
            localStorage.setItem('TopArtists', JSON.stringify(data));
            const parsedData = JSON.parse(JSON.stringify(data));
            displayTopArtists(parsedData.items);
            console.log(parsedData.items);
            if(profile){ 
                populateUITop(profile);
                console.log(profile, "if  datarecue");
                }
            else{
                console.log("no profile");
            }
            
        });

            }

    }

}


}
    
    
initApp();


export async function redirectToAuthCodeFlow(clientId: string) {
    const verifier = generateCodeVerifier(128);
    const challenge = await generateCodeChallenge(verifier);

    localStorage.setItem("verifier", verifier);

    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("response_type", "code");
    params.append("redirect_uri", "https://51-music.vercel.app/callback");
    params.append("scope", "user-read-private user-read-email user-top-read");
    params.append("code_challenge_method", "S256");
    params.append("code_challenge", challenge);
    console.log("!code");
    document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
}

function generateCodeVerifier(length: number) {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

async function generateCodeChallenge(codeVerifier: string) {
    const data = new TextEncoder().encode(codeVerifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}

export async function getAccessToken(clientId: string, code: string): Promise<string> {
    const verifier = localStorage.getItem("verifier");

    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("redirect_uri", "https://51-music.vercel.app/callback");
    params.append("code_verifier", verifier!);

    const result = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params
    });

    const { access_token } = await result.json();
    localStorage.setItem("token", access_token);
    return access_token;
}
async function fetchProfile(token: string): Promise<any> {
    const result = await fetch("https://api.spotify.com/v1/me", {
        method: "GET", headers: { Authorization: `Bearer ${token}` }
    });
    console.log(result, "ah voila le token :", token);
    return await result.json();
}

function populateUI(profile: any) {
    document.getElementById("displayName")!.innerText = profile.display_name;
    if (profile.images[0]) {
        const profileImage = new Image(200, 200);
        profileImage.src = profile.images[0].url;
        document.getElementById("avatar")!.appendChild(profileImage);
        console.log("Profil à sauvegarder populateUIif:", profile.images[0].url);
        localStorage.setItem('profile', JSON.stringify(profile));
        localStorage.setItem('profileURI', JSON.stringify(profile.images[0].url));


    }

    // document.getElementById("id")!.innerText = profile.id;
    // document.getElementById("email")!.innerText = profile.email;
    // document.getElementById("uri")!.innerText = profile.uri;
    document.getElementById("uri")!.setAttribute("href", profile.external_urls.spotify);
    document.getElementById("url")!.innerText = profile.href;
    document.getElementById("url")!.setAttribute("href", profile.href);
    document.getElementById("imgUrl")!.innerText = profile.images[0]?.url ?? '(no profile image)';
}


function populateUITop(profile: any) {
    profile = JSON.parse(profile);
    if (profile.images[0]) {
        const profileImage = new Image(50, 50);
        profileImage.src = profile.images[0].url;
        profileImage.classList.add("profile-img");
        document.getElementById("div-profile-img")!.appendChild(profileImage);

        console.log(profile.images[0].url, "profile image url, if");
    }
}

//// div-profile-img
////////// TOPS TRACKS //////////

interface Track {
    name: string;
    artists: { name: string }[];
    album: {
        images: { url: string }[];
        name: string;
    };
}

async function fetchTrack(token: string, limit: number): Promise<any> {
    const URI= "https://api.spotify.com/v1/me/top/tracks?limit=" + limit.toString();
    const result = await fetch(URI, {
        method: "GET", headers: { Authorization: `Bearer ${token}` }
    });
    if (!result.ok) {
        console.error("Erreur lors de la récupération des pistes:", result.statusText);
        return;
    }
    console.log(result);
    return await result.json();
}

// Removed duplicate fetchTrack function

function displayTopTracks(tracks: Track[]): void {
    const list = document.getElementById('tracks');
    if (!list) {
        return;
    }

    list.innerHTML = ""; // Efface les pistes précédentes si la fonction est rappelée

    tracks.forEach((track, index) => {
        const item = document.createElement('div');
        item.classList.add('track');

        item.innerHTML = `
            <div class="rank">#${index + 1}</div>
            <div class="track-info">
            <img src="${track.album.images[0].url}" alt="${track.name}" class="album-cover">
                <div>
                    <h5 class="track-name">${track.name}</h5>
                    <p class="artist-name">${track.artists.map((artist) => artist.name).join(', ')}</p>
                    <p class="album-name">${track.album.name}</p>
                </div>
            </div>
        `;

        list.appendChild(item);
    });
    

}


///// TOP ARTISTS //////

interface Artist {
    name: string;
    popularity: string;
    genres: string[];
    images: { url: string }[];
}


async function fetchArtists(token: string, limit: number): Promise<any> {
    const URI = "https://api.spotify.com/v1/me/top/artists?limit=" + limit.toString();
    const result = await fetch(URI, { // Utilisation correcte de top tracks
        method: "GET",
        headers: { Authorization: `Bearer ${token}` }
    });
    if (!result.ok) {
        console.error("Erreur lors de la récupération des pistes:", result.statusText);
        return;
    }
    return await result.json();
}

function displayTopArtists(Artists: Artist[]): void {
    const list = document.getElementById('artists');
    if (!list) {
        return;
    }

    list.innerHTML = ""; // Efface les pistes précédentes si la fonction est rappelée

    Artists.forEach((Artist, index) => {
        console.log(Artist);
        const item = document.createElement('div');
        item.classList.add('artists');

        // Utilisation correcte des images et autres éléments
        item.innerHTML = `
            <div class="rank">#${index + 1}</div>
            <div class="artists-info">
                <img src="${Artist.images[0].url}" alt="${Artist.name}" class="album-cover">
                <div>
                    <h5 class="artist-name">${Artist.name}</h5>
                    <p class="artist-genres">${Artist.genres}</p>
                </div>
            </div>
        `;

        list.appendChild(item);
    });
}

///// TOP ALBUMS //////


interface Album {
    name: string;
    artists: { name: string }[];
    images: { url: string }[];
}


async function fetchAlbums(token: string): Promise<any> {



    fetchArtists(token, 50).then((data) => {
        console.log(data);
        localStorage.setItem('TopArtists', JSON.stringify(data));
        const parsedData = JSON.parse(JSON.stringify(data));
        console.log(parsedData.items);
    });

    fetchTrack(token, 50).then((data) => {
        console.log(data);
        localStorage.setItem('TopTracks', JSON.stringify(data));
        const parsedData = JSON.parse(JSON.stringify(data));
        console.log(parsedData.items);
    });
}


function displayTopAlbums(Albums: Album[]): void {
    const list = document.getElementById('albums');
    if (!list) {
        return;
    }

    list.innerHTML = ""; // Efface les albums précédents si la fonction est rappelée

    Albums.forEach((Album, index) => {
        console.log("Album ...", Album);
        const item = document.createElement('div');
        item.classList.add('albums');

        // Utilisation correcte des images et autres éléments
        item.innerHTML = `
            <div class="rank">#${index + 1}</div>
            <div class="albums-info">
                <img src="${Album.images[0].url}" alt="${Album.name}" class="album-cover">
                <div>
                    <h5 class="album-name">${Album.name}</h5>
                    <p class="artist-name">${Album.artists.map((artist) => artist.name).join(', ')}</p>
                </div>
            </div>
        `;
        list.appendChild(item);
    }
    );
}

