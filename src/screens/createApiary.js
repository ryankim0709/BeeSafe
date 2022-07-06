import React from 'react';
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
} from 'react-native';
import Banner from '../components/banner';
import Icon from 'react-native-vector-icons/Feather';

export default function CreateApiary({navigation, route}) {
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
              // source={require()} Where to put image
              style={styles.backgroundImage}
              imageStyle={{borderRadius: 10}}
              resizeMode="cover">
              {/* Open image library for image picking */}
              <TouchableOpacity style={{marginLeft: '90%', marginTop: '29%'}}>
                <Icon name="upload-cloud" size={27.63} />
              </TouchableOpacity>
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
          />

          {/* Latitude and Longitude information form */}
          <View style={styles.coordContainer}>
            <TextInput style={styles.posInputBox} placeholder="Latitude" />
            <TextInput style={styles.posInputBox} placeholder="Longitude" />
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
            multiline
            placeholderTextColor={'#86868A'}
          />

          {/* Create & Cancel buttons*/}
          <View style={styles.createCancelContainer}>
            <TouchableOpacity
              style={[styles.createCancelButton, {backgroundColor: '#EEC746'}]}>
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
});
