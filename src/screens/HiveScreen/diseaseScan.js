import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ImageBackground,
  Modal,
  ActivityIndicator,
  Image,
} from 'react-native';
import Banner from '../../components/banner';
import Feather from 'react-native-vector-icons/Feather';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {TouchableOpacity} from 'react-native-gesture-handler';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import storage, {firebase} from '@react-native-firebase/storage';
import LinearGradient from 'react-native-linear-gradient';
import {useFocusEffect} from '@react-navigation/native';

export default function DiseaseScan({navigation, route}) {
  const hiveId = route.hiveData.hiveId;
  const apiaryData = route['apiaryData'];
  const hiveData = route['hiveData'];
  const [frameCheck, setFrameCheck] = useState([]);
  const [uri, setUri] = useState();
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [image, setImage] = useState();
  const [loadingResults, setLoadingResults] = useState(false);
  const [sharing, setSharing] = useState();
  const [resultsBack, setResultsBack] = useState(false);
  const [resultData, setResultData] = useState();

  useFocusEffect(
    React.useCallback(() => {
      firestore()
        .collection('Hives')
        .doc(hiveId)
        .get()
        .then(res => {
          setSharing(res.data().sharing);
        });
    }),
  );
  useEffect(() => {
    setSharing(hiveData.sharing);
  }, [route]);

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
    launchImageLibrary(options, setImage).then(res => {
      var temp_uri = res?.assets && res.assets[0].uri;
      setUri(temp_uri);
      Image.getSize(temp_uri, (width, height) => {
        setHeight(height);
        setWidth(width);
      });

      var result = [true, false];
      result = result[Math.floor(Math.random() * 2)];

      uploadData(temp_uri, result);
    });
  }

  async function takeImage() {
    // Launch camera for image capture
    const options = {
      saveToPhotos: true,
      mediaType: 'photo',
      includeBase64: false,
    };
    launchCamera(options, setImage).then(res => {
      var temp_uri = res?.assets && res.assets[0].uri;
      setUri(temp_uri);
      Image.getSize(temp_uri, (width, height) => {
        setHeight(height);
        setWidth(width);
      });

      var result = [true, false];
      result = result[Math.floor(Math.random() * 2)];

      uploadData(temp_uri, result);
    });
  }

  async function uploadData(uri, result) {
    setLoadingResults(true);
    const filename = uri.substring(uri.lastIndexOf('/') + 1);
    const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
    const task = storage().ref(filename).putFile(uploadUri);
    try {
      await task;
    } catch (e) {
      console.error(e);
    }

    // Upload to test
    const uploadModel = storage()
      .ref('test_img/' + filename)
      .putFile(uploadUri);
    try {
      await uploadModel;
    } catch (e) {
      console.error(e);
    }

    const downloadlink = (
      await storage().ref(filename).getDownloadURL()
    ).toString();
    try {
      await downloadlink;
    } catch (e) {
      console.error(e);
    }
    setTimeout(() => {
      setLoadingResults(false);
      var dotIndex = filename.indexOf('.');
      var fileId = filename.substring(0, dotIndex);

      firestore()
        .collection('images')
        .doc(fileId)
        .get()
        .then(res => {
          if (!res.exists) {
            console.log('Not ready');
            return;
          } else {
            firestore()
              .collection('images')
              .doc(fileId)
              .get()
              .then(res => {
                setResultData(res.data());
              })
              .then(() => {
                setResultsBack(true);
              });

            var today = new Date();
            var day = String(today.getDate());
            var monthNum = String(today.getMonth() + 1);
            var year = String(today.getFullYear());

            var dayString = `${monthNum}.${day}.${year}`;

            const data = {
              date: dayString,
              downloadurl: downloadlink,
              result: result,
              fileId: fileId,
            };
            var checksData = hiveData.checks;
            checksData.push(data);
            firestore()
              .collection('Hives')
              .doc(hiveId)
              .update({
                checks: checksData,
              })
              .then(() => {
                return;
              });
          }
        });
    }, 30000);
  }

  async function updateHive() {
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

    firestore()
      .collection('Hives')
      .doc(hiveId)
      .update({month: month, day: day, year: year});
  }

  async function reportHive() {
    firestore().collection('Hives').doc(hiveId).update({sharing: !sharing});
    setSharing(!sharing);
  }

  if (!frameCheck) return null;
  return (
    <View style={styles.container}>
      <Banner text="Disease Scan" />

      <View>
        <View style={[styles.imageBoxContainer, {height: 210}]}>
          <ImageBackground
            source={{uri: uri}}
            style={[
              styles.imageBox,
              {
                justifyContent: 'flex-end',
                height: 210,
                backgroundColor: '#D9D9D9',
              },
            ]}
            resizeMode="contain"
            imageStyle={{borderRadius: 10, width: '100%'}}>
            <View style={{flexDirection: 'row', alignSelf: 'flex-end'}}>
              <TouchableOpacity
                onPress={() => {
                  selectImage();
                }}>
                <Feather
                  name="upload-cloud"
                  size={27.63}
                  style={{padding: 5}}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  takeImage();
                }}>
                <Feather name="camera" size={27.63} style={{padding: 5}} />
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </View>

        {/* Results box */}
        {resultsBack && (
          <View style={[styles.imageBoxContainer]}>
            <ImageBackground
              source={{uri: uri}}
              style={[styles.imageBox, {justifyContent: 'flex-end'}]}
              resizeMode="stretch"
              imageStyle={{borderRadius: 10, width: '100%'}}>
              {resultData.bbox.map((box, key) => {

                console.log(width, height);
                var boundingBoxCoords = box.split(', ');
                var x1 = (parseInt(boundingBoxCoords[0]) / width) * 300;
                var y1 = (parseInt(boundingBoxCoords[1]) / height) * 300;
                var x2 = (parseInt(boundingBoxCoords[2]) / width) * 300;
                var y2 = (parseInt(boundingBoxCoords[3]) / height) * 300;
                var r1 = width / 300;
                var r2 = width / 300;
                var w = (x2 - x1);
                var h = (y2 - y1);
                console.log(x1, y1, x2, y2, w, h, width, height);
                console.log(Dimensions.get('window').width);
                var color = 'green';
                if (resultData.sickBBIdx.includes(key)) color = 'red';
                return (
                  <View
                    key={key}
                    style={{
                      position: 'absolute',
                      borderWidth: 2,
                      width: w,
                      height: h,
                      top: y1,
                      left: x1,
                      borderColor: color,
                    }}></View>
                );
              })}
            </ImageBackground>
          </View>
        )}
      </View>
      {/* View for padding at the bottom of ScrollView */}
      <View style={styles.saveReportContainer}>
        {/* Create button */}
        <TouchableOpacity
          style={[styles.saveReportButton, {backgroundColor: '#EEC746'}]}
          onPress={() => {
            updateHive();
          }}>
          <Text style={[styles.saveReportText, {color: 'white'}]}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.saveReportButton, {backgroundColor: '#FFFFFF'}]}
          onPress={() => {
            reportHive();
          }}>
          <Text
            style={[styles.saveReportText, {color: '#EEC746'}]}
            adjustsFontSizeToFit
            numberOfLines={1}>
            {sharing === true ? 'Stop reporting' : 'Report'}
          </Text>
        </TouchableOpacity>
      </View>
      <Modal
        transparent={true}
        animationType={'slide'}
        visible={loadingResults}
        onRequestClose={() => {
          setLoadingResults(!loadingResults);
        }}>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <View style={styles.modalView}>
            <Text style={styles.loadingText}>Loading Results</Text>
            <ActivityIndicator
              style={{marginTop: 10}}
              size="large"
              color="#EEC746"
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    alignItems: 'center',
  },
  bannerContainer: {
    width: '78.9719%',
    height: '4.8596%',
    marginLeft: '6.542%',
    marginTop: '6.6954%',
    borderTopRightRadius: 30,
    borderBottomRightRadius: 30,
    alignSelf: 'flex-start',
  },
  imageBox: {
    width: 300,
    height: 300,
    alignSelf: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    backgroundColor: 'white',
    borderRadius: 10,
  },
  imageBoxContainer: {
    width: '100%',
    height: 300,
    marginTop: '2.3758%',
    borderRadius: 10,
    alignSelf: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  saveReportContainer: {
    width: '54.9065%',
    height: '4.21166%',
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: '5.29157%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  // Create/cancel buttons
  saveReportButton: {
    height: '100%',
    width: Dimensions.get('window').width * 0.47234 * 0.569065,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderColor: '#EEC746',
    borderWidth: 1,
  },
  // Create/cancel button texts
  saveReportText: {
    fontFamily: 'Montserrat',
    fontWeight: '600',
    fontSize: 18,
    padding: 2,
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
  closeButtonContainer: {
    borderRadius: 15,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 5,
    marginTop: 10,
  },
  loadingText: {
    fontFamily: 'Montserrat',
    fontWeight: '600',
  },
});
