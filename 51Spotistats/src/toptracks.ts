const token = localStorage.getItem('token');
const datarecue = localStorage.getItem('data');
if (!token) {
    redirectToAuthCodeFlow();
}
else {
    fetchTrack(token).then((data) => {
        console.log(data);
        localStorage.setItem('data', JSON.stringify(data));
    });
    if (datarecue) {
        const parsedData = JSON.parse(datarecue);
        displayTopTracks(parsedData.items);
        console.log(parsedData.items);
    }
}


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
        console.error("Erreur lors de la récupération des pistes:", response.statusText);
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

function redirectToAuthCodeFlow() {
    alert("Redirecting to auth code flow");
    window.location.href = 'index.html';
}
