import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Button, Text, View, Linking, Alert } from 'react-native';
import { WebView } from 'react-native-webview';

const clientId = "841be26997054e1a9473f010e4948b34";
const authorizationEndpoint = "https://accounts.spotify.com/authorize";
const scope = 'user-read-private user-read-email';
const redirectUrl = "http://localhost:8081";

export default function App() {
  const [showWebView, setShowWebView] = useState(false);
  const [accessToken, setAccessToken] = useState(null);
  
  const authUrl = `${authorizationEndpoint}?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(redirectUrl)}&scope=${encodeURIComponent(scope)}`;

  // Utilisation de Linking pour la redirection Spotify
  const LinkingredirectToSpotifyAuthorize = () => {
    console.log('Bouton Linking cliqué !');

    Linking.openURL(authUrl);
  };



  const handleShowUri = () => {
    const afficherURI = async () => {
      try {
        const url = await Linking.getInitialURL();
        if (url) {
          Alert.alert("URI complète", url);
          console.log('URI complète:', url);
        } else {
          Alert.alert("Aucune URL disponible");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération de l'URL :", error);
      }
    };

  };
  // Utilisation de useEffect pour gérer les liens d'ouverture et le nettoyage
  useEffect(() => {
    const handleRedirect = (event) => {
      const url = event.url;
      if (url && url.startsWith(redirectUrl)) {
        const token = url.split('access_token=')[1].split('&')[0];
        console.log('Access Token via Linking:', token);
        setAccessToken(token);
        Linking.removeEventListener('url', handleRedirect);
      }
    };

    Linking.addEventListener('url', handleRedirect);

    return () => {
      Linking.removeEventListener('url', handleRedirect);
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text>SpotyStats</Text>
      <StatusBar style="auto" />
      {accessToken ? (
        <Text>Connecté avec le token: {accessToken}</Text>
      ) : null}
      {showWebView ? (
        <WebView
          source={{ uri: authUrl }}
          style={{ flex: 1 }}
          onNavigationStateChange={(navState) => {
            if (navState.url.startsWith(redirectUrl)) {
              const token = navState.url.split('access_token=')[1].split('&')[0];
              console.log('Access Token via WebView:', token);
              setAccessToken(token);
              setShowWebView(false); // Fermer le WebView une fois le token récupéré
            }
          }}
        />
      ) : (
        <><Button title="LoginWebView" onPress={() => setShowWebView(true)} /><Button title="Afficher l'URI" onPress={handleShowUri} /></>
      )}
      <Button title="LoginLinking" onPress={LinkingredirectToSpotifyAuthorize} />
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
