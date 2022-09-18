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
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Banner from '../../components/banner';
import Icon from 'react-native-vector-icons/Feather';

// Image storage imports
import storage from '@react-native-firebase/storage';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

// Auth imports
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

// Navigation imports
import {useFocusEffect} from '@react-navigation/native';

import DropDownPicker from 'react-native-dropdown-picker';

export default function ViewHive({navigation, route}) {
  // Dropdown states
  const [open, setOpen] = useState(false);
  const [hiveTypes, setHiveTypes] = useState([
    {label: 'Langstroth', value: 'Langstroth'},
    {label: 'Top Bar', value: 'Top Bar'},
    {label: 'Warre', value: 'Warre'},
  ]);

  const apiaryData = route['apiaryData'];
  const hiveData = route['hiveData'];

  // Hive creation states
  const [name, setName] = useState();
  const [frames, setFrames] = useState();
  const [type, setType] = useState();
  const [notes, setNotes] = useState('');
  const [image, setImage] = useState(null);
  const [uri, setUri] = useState(image?.assets && image.assets[0].uri);
  const [errorMessage, setErrorMessage] = useState();
  const [modalIsVisible, setModalIsVisible] = useState(false);
  const [sharing, setSharing] = useState(false);

  const [init, setInit] = useState(true);
  const [changed, setChanged] = useState(false);

  // Setup states
  const [ready, setReady] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      setUri(null);
      setReady(true);
      return () => {};
    }, []),
  );

  useEffect(() => {
    // Image URI for display
    setUri(image?.assets && image.assets[0].uri);

    if (init) {
      setUri(hiveData['downloadurl']);
      setName(hiveData['name']);
      setFrames(hiveData['frames']);
      setType(hiveData['type']);
      setNotes(hiveData['notes']);
      setInit(false);

      firestore()
        .collection('Users')
        .doc(auth().currentUser.email)
        .collection('Apiaries')
        .doc(apiaryData['name'])
        .get()
        .then(res => {
          var sharing = res.data()['sharing'];
          if (sharing.includes(hiveData['name'])) {
            setSharing(true);
          } else {
            setSharing(false);
          }
        });
    }
  }, [image, sharing]);

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
    setChanged(true);
    launchImageLibrary(options, setImage);
  }

  async function takeImage() {
    // Launch camera for image capture
    const options = {
      saveToPhotos: true,
      mediaType: 'photo',
      includeBase64: false,
    };
    setChanged(true);
    launchCamera(options, setImage);
  }

  const saveChanges = async () => {
    // Error handling
    if (!name) {
      setModalIsVisible(true);
      setErrorMessage('Please add your hive name');
      return;
    }
    if (!frames) {
      setModalIsVisible(true);
      setErrorMessage('Please add the number of frames in your hive');
      return;
    }
    if (!type) {
      setModalIsVisible(true);
      setErrorMessage('Please add the type of your hive');
      return;
    }

    var downloadlink = '';
    // Image upload
    if (changed) {
      const filename = uri.substring(uri.lastIndexOf('/') + 1);
      const uploadUri =
        Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
      const task = storage().ref(filename).putFile(uploadUri);
      try {
        await task;
      } catch (e) {
        console.error(e);
      }
      setImage(null);
      // Image upload complete

      // Get download link
      downloadlink = (
        await storage().ref(filename).getDownloadURL()
      ).toString();
      try {
        await downloadlink;
      } catch (e) {
        console.error(e);
      }
      var finalNotes = notes;
      if (!finalNotes) {
        finalNotes = '';
      }
    } else {
      downloadlink = uri;
    }

    // Add apiary to firestore
    firestore()
      .collection('Users')
      .doc(auth().currentUser.email)
      .collection('Apiaries')
      .doc(apiaryData['name'])
      .collection('Hives')
      .doc(hiveData['name'])
      .delete()
      .then(() => {
        firestore()
          .collection('Users')
          .doc(auth().currentUser.email)
          .collection('Apiaries')
          .doc(apiaryData['name'])
          .collection('Hives')
          .doc(name)
          .set({
            name: name,
            frames: frames,
            type: type,
            notes: finalNotes,
            downloadurl: downloadlink,
            day: hiveData['day'],
            month: hiveData['month'],
            year: hiveData['year'],
            latitude: hiveData['latitude'],
            longitude: hiveData['longitude'],
            checkDates: hiveData['checkdates'],
          })
          .then(() => {})
          .catch(e => {
            console.log(e);
          });
      })
      .catch(e => {
        console.log(e);
      });
    // Hive addition complete
  };

  async function reportHive() {
    firestore()
      .collection('Users')
      .doc(auth().currentUser.email)
      .collection('Apiaries')
      .doc(apiaryData['name'])
      .get()
      .then(res => {
        var sharingData = res.data()['sharing'];
        if (!sharingData.includes(hiveData['name'])) {
          sharingData.push(hiveData['name']);
        }
        firestore()
          .collection('Users')
          .doc(auth().currentUser.email)
          .collection('Apiaries')
          .doc(apiaryData['name'])
          .update({sharing: sharingData});
      });

    firestore()
      .collection('Users')
      .doc(auth().currentUser.email)
      .get()
      .then(res => {
        var sharingData = res.data()['sharing'];
        if (!sharingData.includes(apiaryData['name'])) {
          sharingData.push(apiaryData['name']);
        }
        firestore()
          .collection('Users')
          .doc(auth().currentUser.email)
          .update({sharing: sharingData});
      });
  }

  async function stopReport() {
    console.log('here');
    firestore()
      .collection('Users')
      .doc(auth().currentUser.email)
      .collection('Apiaries')
      .doc(apiaryData['name'])
      .get()
      .then(res => {
        var sharingData = res.data()['sharing'];
        sharingData.pop(hiveData['name']);
        firestore()
          .collection('Users')
          .doc(auth().currentUser.email)
          .collection('Apiaries')
          .doc(apiaryData['name'])
          .update({sharing: sharingData});
      });

    firestore()
      .collection('Users')
      .doc(auth().currentUser.email)
      .get()
      .then(res => {
        var sharingData = res.data()['sharing'];
        sharingData.pop(apiaryData['name']);
        firestore()
          .collection('Users')
          .doc(auth().currentUser.email)
          .update({sharing: sharingData});
      });
  }

  if (!ready) return null;
  return (
    // Container
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{flex: 1}}>
      <TouchableWithoutFeedback style={{flex: 1}} onPress={Keyboard.dismiss}>
        {/* Main container */}
        <View style={styles.container}>
          {/* Banner Container */}
          <Banner text="View Hive" />

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
            value={name}
            onChangeText={text => {
              setName(text);
            }}
          />

          {/* Frame choice buttons */}
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>Frames</Text>
            <TouchableOpacity
              style={[
                styles.frameButton,
                {backgroundColor: frames == 8 ? '#F09819' : 'white'},
              ]}
              onPress={() => {
                setFrames(8);
              }}>
              <Text
                style={[
                  styles.saveText,
                  {color: frames == 8 ? 'white' : 'black'},
                ]}>
                8
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.frameButton,
                {backgroundColor: frames == 10 ? '#F09819' : 'white'},
              ]}
              onPress={() => {
                setFrames(10);
              }}>
              <Text
                style={[
                  styles.saveText,
                  {color: frames == 10 ? 'white' : 'black'},
                ]}>
                10
              </Text>
            </TouchableOpacity>
          </View>

          {/* Hive type dropdown */}
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>Type</Text>
            <View style={{width: '67%'}}>
              <DropDownPicker
                open={open}
                value={type}
                items={hiveTypes}
                setOpen={setOpen}
                setValue={setType}
                setItems={setHiveTypes}
                style={{zIndex: 0, borderColor: '#F09819'}}
                placeholder={'Select Hive Type'}
                dropDownContainerStyle={{borderColor: '#F09819'}}
                textStyle={{fontFamily: 'Montserrat', fontWeight: '500'}}
              />
            </View>
          </View>

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
          <View style={styles.saveContainer}>
            {/* Report button */}
            <TouchableOpacity
              style={[styles.saveButton, {backgroundColor: '#EEC746'}]}
              onPress={() => {
                if (sharing) {
                  setSharing(false);
                  stopReport();
                } else {
                  setSharing(true);
                  reportHive();
                }
              }}>
              <Text
                style={[styles.saveText, {color: '#FFFFFF'}]}
                numberOfLines={1}
                adjustsFontSizeToFit>
                {sharing ? 'Stop Reporting' : 'Report'}
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
    fontFamily: 'Montserrat',
  },
  // Frames and type textinput container
  infoContainer: {
    marginTop: '3.455%',
    width: '85.981%',
    height: '4.21166%',
    justifyContent: 'space-between',
    flexDirection: 'row',
    zIndex: 2,
  },
  // Information text (next to TextInput)
  infoText: {
    fontFamily: 'Montserrat',
    fontWeight: '600',
    fontSize: 18,
    lineHeight: 21.94,
    justifyContent: 'center',
    alignSelf: 'center',
    width: '20%',
  },
  // Information fomr
  infoInput: {
    width: '55.36723%',
    height: '100%',
    borderRadius: 10,
    paddingLeft: 5,
    borderColor: '#F09819',
    borderWidth: 1,
  },
  // Notes form
  notesInput: {
    width: '84.3457%',
    height: '25.5939%',
    borderRadius: 10,
    backgroundColor: '#F5F5F5',
    alignSelf: 'flex-start',
    marginLeft: '6.542%',
    marginTop: '10%',
    fontFamily: 'Montserrat',
    paddingLeft: '4.297%',
    paddingTop: '3.9071%',
    zIndex: 1,
  },
  // Create/cancel container
  saveContainer: {
    width: '54.9065%',
    height: '4.21166%',
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: '5.29157%',
    flexDirection: 'row',
  },
  // Create/cancel buttons
  saveButton: {
    height: '100%',
    width: '47.2340%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderColor: '#EEC746',
    borderWidth: 1,
  },
  // Create/cancel button texts
  saveText: {
    fontFamily: 'Montserrat',
    fontWeight: '600',
    fontSize: 18,
    padding: 2,
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
  frameButton: {
    borderColor: '#F09819',
    width: '27%',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
});
