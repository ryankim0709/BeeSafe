// UI imports
import React, {useEffect, useState} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ImageBackground,
  TextInput,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Modal,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Banner from '../components/banner';
import Icon from 'react-native-vector-icons/Feather';

// Image storage imports
import storage from '@react-native-firebase/storage';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

// Auth imports
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export default function CreateApiary({navigation, route}) {
  // Apiary creation states
  const [name, setName] = useState();
  const [latitude, setLatitude] = useState();
  const [longitude, setLongitude] = useState();
  const [notes, setNotes] = useState();
  const [image, setImage] = useState(null);
  const [uri, setUri] = useState(image?.assets && image.assets[0].uri);
  const [errorMessage, setErrorMessage] = useState();

  // Auth states
  const [user, setUser] = useState();
  const [modalIsVisible, setModalIsVisible] = useState(false);

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

  const uploadImage = async () => {
    // Error handling
    if (!uri || !image) {
      setModalIsVisible(true);
      setErrorMessage('Please uplaod an image of your apiary');
      return;
    }
    if (!name) {
      setModalIsVisible(true);
      setErrorMessage('Please add your apiary name');
      return;
    }
    if (!latitude || !longitude) {
      setModalIsVisible(true);
      setErrorMessage('Please add the latitude/longitude of your apiary');
      return;
    }

    // Image upload
    const filename = uri.substring(uri.lastIndexOf('/') + 1);
    const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
    const task = storage().ref(filename).putFile(uploadUri);
    try {
      await task;
    } catch (e) {
      console.error(e);
    }
    setImage(null);
    // Image upload complete

    // Add apiary to firestore
    var email = await auth().currentUser.email;
    firestore()
      .collection('Users')
      .doc(email)
      .collection('Apiaries')
      .doc(name)
      .set({
        name: {name},
        latitude: {latitude},
        longitude: {longitude},
        notes: {notes},
        uri: {uri},
      })
      .then(() => {
        console.log('Apiary added!');
      })
      .catch(e => {
        console.log(e);
      });
    // Apiary addition complete
  };
  return (
    // Container
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{flex: 1}}>
      <TouchableWithoutFeedback style={{flex: 1}} onPress={Keyboard.dismiss}>
        {/* Main container */}
        <View style={styles.container}>
          {/* Banner Container */}
          <View style={styles.bannerContainer}>
            <Banner text="Add Your Apiary" />
          </View>

          {/* Image upload container */}
          <View style={styles.imageContainer}>
            {/* Display image if image is selected */}
            <ImageBackground
              source={{uri: uri}}
              style={styles.backgroundImage}
              imageStyle={{borderRadius: 10}}
              resizeMode="cover">
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
                  style={{paddingRight: '10%'}}>
                  <Icon name="camera" size={27.63} />
                </TouchableOpacity>
                {/* Upload image button */}
                <TouchableOpacity onPress={selectImage}>
                  <Icon name="upload-cloud" size={27.63} />
                </TouchableOpacity>
              </View>
            </ImageBackground>
          </View>

          {/* Apiary name form */}
          <TextInput
            style={styles.apiaryNameForm}
            placeholder="Name"
            onChangeText={text => {
              setName(text);
            }}
          />

          {/* Latitude and Longitude form */}
          <View style={styles.coordContainer}>
            <TextInput
              style={styles.posInputBox}
              placeholder="Latitude"
              keyboardType="numeric"
              value={latitude}
              onChangeText={text => {
                setLatitude(text);
              }}
            />
            <TextInput
              style={styles.posInputBox}
              placeholder="Longitude"
              value={longitude}
              keyboardType="numeric"
              onChangeText={text => {
                setLongitude(text);
              }}
            />
          </View>

          {/* Get Current Location button */}
          <TouchableOpacity style={styles.getCurrLocationButton}>
            <Text style={styles.getCurrLocationText}>Get Current Location</Text>
          </TouchableOpacity>

          {/* Notes form */}
          <TextInput
            style={styles.notesInput}
            placeholder="Notes"
            value={notes}
            multiline
            placeholderTextColor={'#86868A'}
            onChangeText={text => {
              setNotes(text);
            }}
          />

          {/* Create & Cancel buttons container*/}
          <View style={styles.createCancelContainer}>
            {/* Create button */}
            <TouchableOpacity
              style={[styles.createCancelButton, {backgroundColor: '#EEC746'}]}
              onPress={uploadImage}>
              <Text style={[styles.createCancelText, {color: 'white'}]}>
                Create
              </Text>
            </TouchableOpacity>

            {/* Cancel button */}
            <TouchableOpacity
              style={[styles.createCancelButton, {backgroundColor: '#FFFFFF'}]}
              onPress={() => {
                navigation.goBack();
              }}>
              <Text style={[styles.createCancelText, {color: '#EEC746'}]}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>

          {/* Error Modal */}
          <Modal
            transparent={true}
            animationType={'slide'}
            visible={modalIsVisible}
            onRequestClose={() => {
              setModalIsVisible(false);
            }}>
            {/* Image contents container */}
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View style={styles.modalView}>
                {/* Error message */}
                <Text style={styles.errorText}>{errorMessage}</Text>

                {/* Close button linear gradient container*/}
                <LinearGradient
                  colors={['#F09819', '#F09819', '#EDDE5D']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={styles.closeButtonContainer}>
                  {/* Close button */}
                  <TouchableOpacity
                    onPress={() => {
                      setModalIsVisible(false);
                    }}>
                    <Text
                      style={{
                        fontFamily: 'Montserrat',
                        fontWeight: '600',
                        color: 'white',
                      }}>
                      Close
                    </Text>
                  </TouchableOpacity>
                </LinearGradient>
              </View>
            </View>
          </Modal>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  // Container
  container: {
    flex: 1,
    alignItems: 'center',
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
    height: '18.034%',
    alignSelf: 'flex-start',
    marginTop: '5.29157%',
    marginLeft: '6.542%',
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
  },
  // Apiary background image
  backgroundImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  // Apiary name form
  apiaryNameForm: {
    width: '84.3457%',
    height: '4.211%',
    borderWidth: 1,
    marginTop: '3.4557%',
    borderRadius: 10,
    borderColor: '#F09819',
    paddingLeft: 5,
  },
  // Coordinates form container
  coordContainer: {
    width: '84.3457%',
    height: '4.21166%',
    alignSelf: 'center',
    marginTop: '5.29157%',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  // Current location button text
  getCurrLocationText: {
    color: 'white',
    fontFamily: 'Montserrat',
    fontWeight: '600',
    fontSize: 17,
    lineHeight: 21.94,
  },
  // Latitude/longitude form box
  posInputBox: {
    height: '100%',
    width: '45.5840%',
    paddingLeft: 5,
    borderRadius: 10,
    borderColor: '#F09819',
    borderWidth: 1,
  },
  // Get current location button container
  getCurrLocationButton: {
    alignSelf: 'flex-start',
    marginTop: '5.29157%',
    marginLeft: '7.009345%',
    width: '49.5327%',
    height: '4.21166%',
    backgroundColor: '#EEC746',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Notes form
  notesInput: {
    width: '84.3457%',
    height: '25.5939%',
    borderRadius: 10,
    backgroundColor: '#F5F5F5',
    alignSelf: 'flex-start',
    marginLeft: '6.542%',
    marginTop: '5.29157%',
    fontFamily: 'Montserrat',
    paddingLeft: '4.297%',
    paddingTop: '3.9071%',
  },
  // Create/cancel container
  createCancelContainer: {
    width: '54.9065%',
    height: '4.21166%',
    alignSelf: 'center',
    justifyContent: 'space-between',
    marginTop: '5.29157%',
    flexDirection: 'row',
  },
  // Create/cancel buttons
  createCancelButton: {
    height: '100%',
    width: '47.2340%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderColor: '#EEC746',
    borderWidth: 1,
  },
  // Create/cancel button texts
  createCancelText: {
    fontFamily: 'Montserrat',
    fontWeight: '600',
    fontSize: 18,
  },
  // Modal main content container
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    paddingLeft: 35,
    paddingRight: 35,
    paddingTop: 20,
    paddingBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    textAlign: 'center',
  },
  // Modal close container
  closeButtonContainer: {
    borderRadius: 15,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 5,
    marginTop: 10,
  },
  // Modal error text
  errorText: {
    color: 'red',
    fontFamily: 'Montserrat',
    fontWeight: '600',
    textAlign: 'center',
  },
});
