// UI imports
import React, {useEffect, useState} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ImageBackground,
  ScrollView,
  Dimensions,
} from 'react-native';
import Banner from '../components/banner';
import Icon from 'react-native-vector-icons/Feather';

// Image storage imports
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

// Auth imports
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

// Navigation imports
import {useFocusEffect} from '@react-navigation/native';

export default function CreateHive({navigation, route}) {
  // Apiary creation states
  const [image, setImage] = useState(null);
  const [uri, setUri] = useState(image?.assets && image.assets[0].uri);
  const [resUri, setResUri] = useState();

  // Auth states
  const [user, setUser] = useState();

  // Setup states
  const [ready, setReady] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      setUri(null);
      setReady(true);
      return () => {
        setReady(false);
        setImage(null);
        setUri(null);
      };
    }, []),
  );
  // Auth state change
  async function onAuthStateChanged(user) {
    await setUser(user);
  }

  useEffect(() => {
    // Image URI for display
    setUri(image?.assets && image.assets[0].uri);
    // Auth set change
    auth().onAuthStateChanged(onAuthStateChanged);
  }, [image]);

  async function selectImage() {
    // Launch image library for image selection
    const options = {
      maxWidth: 2000,
      maxHeight: 2000,
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    launchImageLibrary(options, setImage);
  }

  async function takeImage() {
    // Launch camera for image capture
    const options = {
      saveToPhotos: true,
      mediaType: 'photo',
      includeBase64: false,
    };
    launchCamera(options, setImage);
  }

  async function completeCheck() {
    var months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'June',
      'July',
      'Aug',
      'Oct',
      'Nov',
      'Dec',
    ];
    var today = new Date();
    var day = String(today.getDate());
    var month = String(months[today.getMonth()]);
    var year = String(today.getFullYear());

    console.log(route.params);
    var email = auth().currentUser.email;
    console.log(route['params']['apirayName']);
    firestore()
      .collection('Users')
      .doc(email)
      .collection('Apiaries')
      .doc(route['params']['apirayName'])
      .collection('Hives')
      .doc(route['params']['hiveName'])
      .update({
        month: month,
        year: year,
        day: day,
      })
      .then(() => {
        navigation.navigate('ApiaryBottomTabs', {
          screen: 'View Apiary',
        });
      });
  }

  if (!ready) return null;
  return (
    // Container
    <View style={styles.container}>
      {/* Banner Container */}
      <View style={styles.bannerContainer}>
        <Banner text="Check Hive" />
      </View>

      <ScrollView
        style={{
          width: '100%',
          paddingBottom: 100,
          marginTop: '5.29157%',
        }}>
        {/* Image upload container */}
        <View
          style={[styles.imageContainer, {marginTop: 0}]}
          contentStyleContainer={{alignTiems: 'center', flex: 1}}>
          {/* Display image if image is selected */}
          <ImageBackground
            source={{uri: uri}}
            style={styles.backgroundImage}
            imageStyle={{borderRadius: 10}}
            resizeMode="stretch">
            {/* Image picking options container */}
            <View
              style={{
                marginLeft: '80%',
                marginTop: '29%',
                flexDirection: 'row',
              }}>
              {/* Take picture button */}
              <TouchableOpacity
                onPress={takeImage}
                style={{
                  paddingRight: '10%',
                  marginTop: '340%',
                }}>
                <Icon name="camera" size={27.63} />
              </TouchableOpacity>
              {/* Upload image button */}
              <TouchableOpacity
                onPress={selectImage}
                style={{marginTop: '340%'}}>
                <Icon name="upload-cloud" size={27.63} />
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </View>
        <View style={styles.checkContainer}>
          {!uri && (
            <TouchableOpacity
              style={styles.checkButton}
              onPress={() => {
                navigation.navigate('ApiaryBottomTabs', {
                  screen: 'View Apiary',
                });
              }}>
              <Text style={styles.checkText}>Done Checking</Text>
            </TouchableOpacity>
          )}

          {uri && (
            <TouchableOpacity
              style={styles.checkButton}
              onPress={() => {
                setResUri(uri);
              }}>
              <Text style={styles.checkText}>Check Frame</Text>
            </TouchableOpacity>
          )}
        </View>
        {resUri && (
          <View
            style={styles.imageContainer}
            contentStyleContainer={{alignTiems: 'center', flex: 1}}>
            {/* Display image if image is selected */}
            <ImageBackground
              source={{uri: uri}}
              style={styles.backgroundImage}
              imageStyle={{borderRadius: 10}}
              resizeMode="stretch">
              {/* Image picking options container */}
            </ImageBackground>
          </View>
        )}
      </ScrollView>
      {resUri && (
        <View style={[styles.checkContainer, {marginBottom: '5.29157%'}]}>
          <TouchableOpacity
            style={styles.checkButton}
            onPress={() => {
              completeCheck();
            }}>
            <Text style={styles.checkText}>Done Checking</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  // Container
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  // Banner container
  bannerContainer: {
    width: '78.9719%',
    height: '4.8596%',
    marginLeft: '6.542%%',
    marginTop: '6.6954%',
    borderTopRightRadius: 30,
    borderBottomRightRadius: 30,
    alignSelf: 'flex-start',
  },
  // Image container
  imageContainer: {
    width: '84.3457%',
    height: Dimensions.get('window').height * 0.5,
    alignSelf: 'flex-start',
    marginTop: '5.29157%',
    marginLeft: '6.542%',
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
  },
  // Apiary background image
  backgroundImage: {
    borderRadius: 10,
    width: '100%',
    height: '100%',
  },
  checkContainer: {
    marginTop: '5.29157%',
    alignSelf: 'center',
    width: '49.5327%',
    height: Dimensions.get('window').height * 0.041,
  },
  checkButton: {
    backgroundColor: '#EEC746',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  checkText: {
    fontFamily: 'Montserrat',
    fontWeight: '600',
    fontSize: 17,
    color: 'white',
    lineHeight: 21.94,
  },
});
