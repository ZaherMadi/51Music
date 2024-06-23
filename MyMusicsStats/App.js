import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Button, Text, View, Linking } from 'react-native';
import { WebView } from 'react-native-webview';

const clientId = "841be26997054e1a9473f010e4948b34";
const authorizationEndpoint = "https://accounts.spotify.com/authorize";
const tokenEndpoint = "https://accounts.spotify.com/api/token";
const scope = 'user-read-private user-read-email';

const redirectUrl = "http://localhost:8081";

export default function App() {
  const [showWebView, setShowWebView] = useState(false);
  const [accessToken, setAccessToken] = useState(null);

  const authUrl = `${authorizationEndpoint}?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(redirectUrl)}&scope=${encodeURIComponent(scope)}`;

  useEffect(() => {
    // Get the initial URL if the app was launched from a URL
    Linking.getInitialURL().then((url) => {
      if (url) {
        handleRedirect(url);
      }
    });

    // Add event listener to handle URL changes while the app is open
    const handleUrlChange = ({ url }) => {
      handleRedirect(url);
    };

    Linking.addEventListener('url', handleUrlChange);

    return () => {
      // Cleanup the event listener when the component unmounts
      Linking.removeEventListener('url', handleUrlChange);
    };
  }, []);

  const handleRedirect = (url) => {
    console.log('URL:', url);
    if (url && url.startsWith(redirectUrl)) {
      console.log('same url:');
      const Token = url.split('access_token=')[1].split('&')[0];
      console.log('Access Token:', Token);
      setAccessToken(Token);
    }
    console.log('done !');
  };

  const handleLoginClick = () => {
    console.log('Bouton handleLoginClick cliqué !');
    setShowWebView(true);
  };

  const LinkingredirectToSpotifyAuthorize = () => {
    console.log('Bouton Linking cliqué !');
    Linking.openURL(authUrl);
    console.log('fin de la fonction :');
  };

  return (
    <View style={styles.container}>
      <Text>SpotyStats</Text>
      <StatusBar style="auto" />
      {accessToken ? (
        <Text>Connecté avec le token: {accessToken}</Text>
      ) : (
        <>
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
                  setAccessToken(accessToken);
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
        </>
      )}
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
