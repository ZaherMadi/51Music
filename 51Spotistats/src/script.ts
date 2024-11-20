async function initApp() {
const clientId = "1086596f94274f559255b1f60160c6c0";
const params = new URLSearchParams(window.location.search);
const code = params.get("code");
console.log(params, code);
if (window.location.pathname === '/callback' || window.location.pathname === '/callback.html') {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    if (code) {
        console.log("Code reçu :", code);
        const accessToken = await getAccessToken(clientId, code);
        const profile = await fetchProfile(accessToken);
        console.log(profile);
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
        console.log(profile);
        populateUI(profile);
        
    }
}

if (window.location.pathname === '/TopTracks.html') {
    
    const token = localStorage.getItem('token');
    const datarecue = localStorage.getItem('TopTracks');
    if (!token) {
        redirectToAuthCodeFlow(clientId);
    }
    else {
        fetchTrack(token).then((data) => {
            console.log(data);
            localStorage.setItem('TopTracks', JSON.stringify(data));
        });
        if (datarecue) {
            const parsedData = JSON.parse(datarecue);
            displayTopTracks(parsedData.items);
            console.log(parsedData.items);
        }
    }
    
}

if (window.location.pathname === '/TopArtists.html') {
    
    const token = localStorage.getItem('token');
    const datarecue = localStorage.getItem('TopArtists');
    if (!token) {
        redirectToAuthCodeFlow(clientId);
    }
    else {
        fetchArtists(token).then((data) => {
            console.log(data);
            localStorage.setItem('TopArtists', JSON.stringify(data));
        });
        if (datarecue) {
            const parsedData = JSON.parse(datarecue);
            displayTopArtists(parsedData.items);
            console.log(parsedData.items);
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
    }
    // document.getElementById("id")!.innerText = profile.id;
    // document.getElementById("email")!.innerText = profile.email;
    document.getElementById("uri")!.innerText = profile.uri;
    document.getElementById("uri")!.setAttribute("href", profile.external_urls.spotify);
    document.getElementById("url")!.innerText = profile.href;
    document.getElementById("url")!.setAttribute("href", profile.href);
    document.getElementById("imgUrl")!.innerText = profile.images[0]?.url ?? '(no profile image)';
}

////////// TOPS TRACKS //////////

interface Track {
    name: string;
    artists: { name: string }[];
    album: {
        images: { url: string }[];
        name: string;
    };
}

async function fetchTrack(token: string): Promise<any> {
    const result = await fetch("https://api.spotify.com/v1/me/top/tracks", {
        method: "GET", headers: { Authorization: `Bearer ${token}` }
    });
    if (!result.ok) {
        console.error("Erreur lors de la récupération des pistes:", result.statusText);
        return;
    }
    console.log(result);
    return await result.json();
}

function displayTopTracks(tracks: Track[]): void {
    const list = document.getElementById('tracks');
    if (!list) {
        return;
    }

    list.innerHTML = ""; // Efface les pistes précédentes si la fonction est rappelée

    tracks.forEach((track, index) => {
        console.log("test ...", track);
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


async function fetchArtists(token: string): Promise<any> {
    const result = await fetch("https://api.spotify.com/v1/me/top/artists", { // Utilisation correcte de top tracks
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
        console.log("test ...", Artist);
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
