import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Button ,Text, View , Linking  } from 'react-native';
import {WebView} from 'react-native-webview';

const clientId = "841be26997054e1a9473f010e4948b34"
const authorizationEndpoint = "https://accounts.spotify.com/authorize";
const tokenEndpoint = "https://accounts.spotify.com/api/token";
const scope = 'user-read-private user-read-email';

const redirectUrl = "http://localhost:8081";


export default function App() {
  const [showWebView, setShowWebView] = useState(false);
    // URL pour l'authentification Spotify
    const authUrl = `${authorizationEndpoint}?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(redirectUrl)}&scope=${encodeURIComponent(scope)}`;
    // Fonction pour gérer le clic sur le bouton

    // Fonction pour gérer le clic sur le bouton "Se connecter à Spotify"
  const handleLoginClick = () => {
    console.log('Bouton handleLoginClick cliqué !');

    redirectToSpotifyAuthorize();

  };

  // Fonction pour rediriger vers la page d'authentification Spotify
  const redirectToSpotifyAuthorize = () => {
    console.log('Bouton setShowWebView cliqué !');
    setShowWebView(true);    

  };

  const LinkingredirectToSpotifyAuthorize = () => {
    console.log('Bouton Linking cliqué !');
    const authUrl = `${authorizationEndpoint}?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(redirectUrl)}&scope=${encodeURIComponent(scope)}`;
  

  
  const handleRedirect = (event) => {
    console.log('handleRedirect  !');
    const url = event.url;
    console.log('URL:', url);
    if (url && url.startsWith(redirectUrl)) {
      console.log('same url:');
      const accessToken = url.split('access_token=')[1].split('&')[0];
      console.log('Access Token:', accessToken);
      Linking.removeEventListener('url', handleRedirect);
    }
    console.log('done !');
  }

  Linking.addEventListener('url', handleRedirect);

  Linking.openURL(authUrl);
  console.log('fin de la fonction :');


};

  return (
    <View style={styles.container}>
      <Text>SpotyStats</Text>
      <StatusBar style="auto" />
      {showWebView ? (
        <WebView
          source={{ uri: authUrl }}
          style={{ flex: 1 }}
          onLoad={() => console.log('Page loaded successfully')}
          onNavigationStateChange={(navState) => {
            // Vérifie si l'URL a changé pour détecter la redirection avec le token
            if (navState.url.startsWith(redirectUrl)) {
              // Extraire le token d'accès de l'URL (exemple de code)
              const accessToken = navState.url.split('access_token=')[1].split('&')[0];
              console.log('Access Token:', accessToken);
              // Cacher le WebView une fois que l'authentification est terminée
              setShowWebView(false);
            }
          }}
        />
      ) : (
        <Button
          title="LoginWebView"
          onPress={handleLoginClick}
          
        />
      )}
        <Button
        title="LoginLinking"
        onPress={LinkingredirectToSpotifyAuthorize}
        
      />
      
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
