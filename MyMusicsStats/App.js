import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Button ,Text, View, Linking  } from 'react-native';

export default function App() {
    // URL pour l'authentification Spotify
    const authUrl = 'https://accounts.spotify.com/authorize?client_id=YOUR_CLIENT_ID&response_type=token&redirect_uri=YOUR_REDIRECT_URI&scope=user-read-private';
  
    // Fonction pour gérer le clic sur le bouton
    const handlePress = () => {
      // Ouvre l'URL d'authentification Spotify dans le navigateur par défaut
      Linking.openURL(authUrl);
      console.log('Bouton cliqué !');
    }
  
  return (
    <View style={styles.container}>
      <Text>SpotyStats</Text>
      <StatusBar style="auto" />
      <Button
        title="Mon Bouton"
        onPress={handlePress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
