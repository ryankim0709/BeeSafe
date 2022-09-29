import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Image, ScrollView} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Feather from 'react-native-vector-icons/Feather';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {Dimensions} from 'react-native';

export default function HiveReportAccordian(props) {
  const hiveId = props.data.hiveId;

  const [date, setDate] = useState('');
  const data = props.data;
  const [open, setOpen] = useState(false);
  useEffect(() => {
    setDate(props.data.date.replaceAll('.', '/'));
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.date}>
        <Text style={styles.dateText}>{date}</Text>
        <TouchableOpacity onPress={() => setOpen(!open)}>
          {open && (
            <Feather name={'arrow-up'} size={20} style={{marginRight: '5%'}} />
          )}
          {!open && (
            <Feather
              name={'arrow-down'}
              size={20}
              style={{marginRight: '5%'}}
            />
          )}
        </TouchableOpacity>
      </View>
      <ScrollView>
        {open && (
          <View style={styles.contentContainer}>
            <Image source={{uri: data.downloadurl}} style={styles.image} />
            {data['result'] && (
              <Feather
                name="check-square"
                size={40}
                style={[styles.icon, {color: 'green'}]}
              />
            )}
            {!data['result'] && (
              <Feather
                name="x-square"
                size={40}
                style={[styles.icon, {color: 'red'}]}
              />
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '90%',
    height: 350,
    marginTop: '2.8077%',
    alignSelf: 'center',
    borderColor: '#EEC746',
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: 'center',
    paddingVertical: '2%',
  },
  date: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 400,
  },
  image: {
    width: 300,
    height: 300,
    marginLeft: '5%',
    borderRadius: 30,
    marginTop: '2.34%',
  },
  icon: {
    alignSelf: 'center',
    marginRight: '5%',
  },
  dateText: {
    marginLeft: '5%',
    fontFamily: 'Montserrat',
    fontWeight: '600',
    fontSize: 18,
  },
});
