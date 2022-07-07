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
  Alert,
  Modal,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Banner from '../components/banner';
import Icon from 'react-native-vector-icons/Feather';
import storage from '@react-native-firebase/storage';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export default function CreateApiary({navigation, route}) {
  const [name, setName] = useState();
  const [latitude, setLatitude] = useState();
  const [longitude, setLongitude] = useState();
  const [notes, setNotes] = useState();
  const [downloadURL, setDownloadUrl] = useState();

  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);
  const [uri, setUri] = useState(image?.assets && image.assets[0].uri);

  const [user, setUser] = useState();
  const [modalIsVisible, setModalIsVisible] = useState(false);

  const [errorMessage, setErrorMessage] = useState();

  function onAuthStateChanged(user) {
    setUser(user);
  }

  useEffect(() => {
    setUri(image?.assets && image.assets[0].uri);
    auth().onAuthStateChanged(onAuthStateChanged);
  }, [image]);

  async function selectImage() {
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
    const options = {
      saveToPhotos: true,
      mediaType: 'photo',
      includeBase64: false,
    };
    launchCamera(options, setImage);
  }

  const uploadImage = async () => {
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
    const filename = uri.substring(uri.lastIndexOf('/') + 1);
    console.log('File Name ' + filename);
    const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
    console.log('Upload URI ' + uploadUri);
    setUploading(true);
    setTransferred(0);
    const task = storage().ref(filename).putFile(uploadUri);
    task.on('state_changed', snapshot => {
      setTransferred(
        Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 10000,
      );
    });
    try {
      await task;
    } catch (e) {
      console.error(e);
    }
    const downloadUrlTemp = await storage().ref(filename).getDownloadURL();
    try {
      var finalURL = (await downloadUrlTemp).valueOf();
      console.log('Donwload URL ' + finalURL);
      setDownloadUrl(finalURL);
    } catch (e) {
      console.log(e);
    }
    setUploading(false);
    console.log('Uploaded!');
    setImage(null);
    console.log();

    firestore()
      .collection(`Users/${user.email}/Apiaries`)
      .doc(name)
      .set({
        name: {name},
        latitude: {latitude},
        longitude: {longitude},
        notes: {notes},
        downloadURL: {downloadURL},
      })
      .then(() => {
        console.log('Apiary added!');
      });
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{flex: 1}}>
      <TouchableWithoutFeedback style={{flex: 1}} onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          {/* Banner Container */}
          <View style={styles.bannerContainer}>
            <Banner text="Add Your Apiary" />
          </View>

          {/* Image upload */}
          <View style={styles.imageContainer}>
            <ImageBackground
              source={{uri: uri}}
              style={styles.backgroundImage}
              imageStyle={{borderRadius: 10}}
              resizeMode="cover">
              {/* Open image library for image picking */}
              <View
                style={{
                  marginLeft: '80%',
                  marginTop: '29%',
                  flexDirection: 'row',
                }}>
                <TouchableOpacity
                  onPress={takeImage}
                  style={{paddingRight: '10%'}}>
                  <Icon name="camera" size={27.63} />
                </TouchableOpacity>
                <TouchableOpacity onPress={selectImage}>
                  <Icon name="upload-cloud" size={27.63} />
                </TouchableOpacity>
              </View>
            </ImageBackground>
          </View>

          {/* Apiary name form */}
          <TextInput
            style={{
              width: '84.3457%',
              height: '4.211%',
              borderWidth: 1,
              marginTop: '3.4557%',
              borderRadius: 10,
              borderColor: '#F09819',
              paddingLeft: 5,
            }}
            placeholder="Name"
            onChangeText={text => {
              setName(text);
            }}
          />

          {/* Latitude and Longitude information form */}
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
            <Text
              style={{
                color: 'white',
                fontFamily: 'Montserrat',
                fontWeight: '600',
                fontSize: 17,
                lineHeight: 21.94,
              }}>
              Get Current Location
            </Text>
          </TouchableOpacity>

          {/* Notes text input */}
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

          {/* Create & Cancel buttons*/}
          <View style={styles.createCancelContainer}>
            <TouchableOpacity
              style={[styles.createCancelButton, {backgroundColor: '#EEC746'}]}
              onPress={uploadImage}>
              <Text style={[styles.createCancelText, {color: 'white'}]}>
                Create
              </Text>
            </TouchableOpacity>
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
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View style={styles.modalView}>
                <Text style={styles.errorText}>{errorMessage}</Text>
                <LinearGradient
                  colors={['#F09819', '#F09819', '#EDDE5D']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={{
                    borderRadius: 15,
                    paddingLeft: 10,
                    paddingRight: 10,
                    paddingTop: 5,
                    paddingBottom: 5,
                    marginTop: 10,
                  }}>
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
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  bannerContainer: {
    width: '78.9719%',
    height: '4.8596%',
    marginLeft: '6.542%%',
    marginTop: '6.6954%',
    borderTopRightRadius: 30,
    borderBottomRightRadius: 30,
    alignSelf: 'flex-start',
  },
  imageContainer: {
    width: '84.3457%',
    height: '18.034%',
    alignSelf: 'flex-start',
    marginTop: '5.29157%',
    marginLeft: '6.542%',
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  coordContainer: {
    width: '84.3457%',
    height: '4.21166%',
    alignSelf: 'center',
    marginTop: '5.29157%',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  posInputBox: {
    height: '100%',
    width: '45.5840%',
    paddingLeft: 5,
    borderRadius: 10,
    borderColor: '#F09819',
    borderWidth: 1,
  },
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
  createCancelContainer: {
    width: '54.9065%',
    height: '4.21166%',
    alignSelf: 'center',
    justifyContent: 'space-between',
    marginTop: '5.29157%',
    flexDirection: 'row',
  },
  createCancelButton: {
    height: '100%',
    width: '47.2340%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderColor: '#EEC746',
    borderWidth: 1,
  },
  createCancelText: {
    fontFamily: 'Montserrat',
    fontWeight: '600',
    fontSize: 18,
  },
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
  errorText: {
    color: 'red',
    fontFamily: 'Montserrat',
    fontWeight: '600',
    textAlign: 'center',
  },
});
