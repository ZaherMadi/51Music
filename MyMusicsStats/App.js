import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Button ,Text, View   } from 'react-native';
import {WebView} from 'react-native-webview';

const clientId = "841be26997054e1a9473f010e4948b34"
const authorizationEndpoint = "https://accounts.spotify.com/authorize";
const tokenEndpoint = "https://accounts.spotify.com/api/token";
const scope = 'user-read-private user-read-email';

const redirectUrl = "http://localhost:3000";
const redirectUrl2 = "http://zaher.fr";

export default function App() {
  const [showWebView, setShowWebView] = useState(false);
    // URL pour l'authentification Spotify
    const authUrl = 'https://accounts.spotify.com/authorize?client_id=YOUR_CLIENT_ID&response_type=token&redirect_uri=YOUR_REDIRECT_URI&scope=user-read-private';
    const authUrl2 = 'https://zaher.fr';

    // Fonction pour gérer le clic sur le bouton

    // Fonction pour gérer le clic sur le bouton "Se connecter à Spotify"
  const handleLoginClick = () => {
    redirectToSpotifyAuthorize();
    console.log('Bouton handleLoginClick cliqué !');

  };

  // Fonction pour rediriger vers la page d'authentification Spotify
  const redirectToSpotifyAuthorize = () => {
    const authUrl = `${authorizationEndpoint}?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(redirectUrl)}&scope=${encodeURIComponent(scope)}`;
    setShowWebView(true);    
    console.log('Bouton setShowWebView cliqué !');

  };
  
  return (
    <View style={styles.container}>
      <Text>SpotyStats</Text>
      <StatusBar style="auto" />
      {showWebView ? (
        <WebView
          source={{ uri: authUrl }}
          style={{ flex: 1 }}
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
          title="Login"
          onPress={handleLoginClick}
          
        />
      )}
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'limegreen',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
