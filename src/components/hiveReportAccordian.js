import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  ImageBackground,
} from 'react-native';
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
  const [bbox, setbbox] = useState([]);
  const [sickbboxId, setsickbboxId] = useState([]);
  useEffect(() => {
    setDate(data.date.replaceAll('.', '/'));
    firestore()
      .collection('images')
      .doc(data.fileId)
      .get()
      .then(res => {
        const imageData = res.data();
        setbbox(imageData.bbox);
        setsickbboxId(imageData.sickBBIdx);
      });
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
            <ImageBackground
              source={{uri: data.downloadurl}}
              style={styles.image}>
              {bbox.map((box, key) => {
                var boundingBoxCoords = box.split(', ');
                var x1 = parseInt(boundingBoxCoords[0]);
                var y1 = parseInt(boundingBoxCoords[1]);
                var x2 = parseInt(boundingBoxCoords[2]);
                var y2 = parseInt(boundingBoxCoords[3]);
                var w = x2 - x1;
                var h = y2 - y1;
                var color = 'green';
                if (sickbboxId.includes(key)) color = 'red';
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
    height: 320,
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
