import React from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

export default function Settings({navigation}) {
  return (
    <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
      <TouchableOpacity
        style={{width: 100, height: 100}}
        onPress={() => {
          auth().signOut();
          navigation.navigate('Login');
          GoogleSignin.revokeAccess();
          GoogleSignin.signOut();
        }}>
        <Text>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
