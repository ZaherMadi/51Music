const token = localStorage.getItem('token');
const datarecue = localStorage.getItem('data');
if (!token) {
    redirectToAuthCodeFlow();
} else {
    fetchTrack(token).then((data) => {
        console.log(data);
        localStorage.setItem('data', JSON.stringify(data));
        displayTopTracks(data.items);
    });
}

interface Artist {
    name: string;
    popularity: string;
    genres: string[];
    images: { url: string }[];
}

async function fetchTrack(token: string): Promise<any> {
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

function displayTopTracks(Artists: Artist[]): void {
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

function redirectToAuthCodeFlow() {
    alert("Redirecting to auth code flow");
    window.location.href = 'index.html';
}
