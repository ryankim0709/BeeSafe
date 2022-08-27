import React, {useState, useEffect} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import Banner from '../../components/banner';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import HiveReportAccordian from '../../components/hiveReportAccordian';
import {ScrollView} from 'react-native-gesture-handler';

export default function HiveReport({route}) {
  const apiaryData = route['apiaryData'];
  const hiveData = route['hiveData'];
  const [dates, setDates] = useState([]);
  useEffect(() => {
    getDates();
  }, []);

  async function getDates() {
    var dates = [];

    firestore()
      .collection('Users')
      .doc(auth().currentUser.email)
      .collection('Apiaries')
      .doc(apiaryData['name'])
      .collection('Hives')
      .doc(hiveData['name'])
      .get()
      .then(res => {
        dates = res.data()['checkdates'];
        setDates(dates);
      });
  }
  return (
    <View style={styles.container}>
      <Banner text="Hive Report" />

      <ScrollView>
        {dates.map((data, key) => (
          <HiveReportAccordian key={key} date={data} data={route} />
        ))}
      </ScrollView>
      <View
        style={{
          width: '100%',
          height: '7.1923%',
          borderRadius: 10,
        }}></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});
