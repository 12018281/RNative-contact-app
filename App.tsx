import React, { useState, useEffect , useRef} from 'react';
import Contacts from 'react-native-contacts';
import asImage from './as.png';
import logo from './headlogo.jpg';
import clg from './logo.jpg';
import { Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import {
  SafeAreaView,ScrollView,StatusBar,StyleSheet,Text,TextInput,TouchableOpacity,Image,Animated,useColorScheme,View,PermissionsAndroid,Alert,
} from 'react-native';

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [cnt, setCnt] = useState();
  const [record, setr] = useState([]);
  const [search, setsearch] = useState(true);
  const [inputText, setInputText] = useState('');
  const screenHeight = Dimensions.get('window').height;
  const screenWidth = Dimensions.get('window').width;
  const contentWidth = useRef(new Animated.Value(0)).current;
  
  const fetchContactsCount = async () => {
    try {
      const permission = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS
      );

      if (permission === PermissionsAndroid.RESULTS.GRANTED) {
        const count = await Contacts.getCount();
        setCnt(count);

        if (count !== 0) {
          Contacts.getAll()
            .then(contacts => {
              contacts.sort((a, b) =>
                a.displayName.toLowerCase().localeCompare(b.displayName.toLowerCase())
              );

              setr(contacts);            })
            .catch(e => {
              Alert.alert('Permission to access contacts was denied');
              console.warn('Permission to access contacts was denied');
            });
        }
      } else if (permission === PermissionsAndroid.RESULTS.DENIED) {
        console.log('Permission denied by user.');
      } else if (permission === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
        console.log('Permission denied by user and cannot be requested again.');
      }
    } catch (error) {
      console.log('Error requesting permission:', error);
    }
  };

  useEffect(() => {
    fetchContactsCount();
  }, []);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? 'grey' : 'white',
    height: screenHeight,
  };

  function handleSearch(text) {
    setInputText(text);
    if (text.length) {
      setsearch(false);
      Contacts.getContactsMatchingString(text)
        .then(contacts => {
          contacts.sort((a, b) =>
            a.displayName.toLowerCase().localeCompare(b.displayName.toLowerCase())
          );
          setr(contacts);
        })
        .catch(e => {
          Alert.alert('Permission to access contacts was denied');
          console.warn('Permission to access contacts was denied');
        });
    } else {
      setsearch(true);
    }
  }

  const handleAlert = (a, s, d) => {
    Alert.alert(
      s ,//+ '\n' + s,
      (d && d.length > 0) ? d[0].number : a,
      [
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  }

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />

<Image source={logo} style={{ width: screenWidth, height: 300,borderTopLeftRadius:50,borderTopRightRadius:50 }} />
        <Text style={{ fontSize: 30,color:'white',position:'absolute',marginTop:140,marginLeft:40 }}>MY CONTACT APP</Text>
      
      {search && (
        <View style={{ height: 40,borderWidth: 1,borderColor: '#3c3c47',flexDirection: 'row',borderRadius: 25,position: 'absolute',marginTop: 205, width:screenWidth-40,marginLeft:20}}>
          <Image source={asImage} style={{ width: 20, height: 20, alignSelf: 'center', marginStart: 15 }} />
        </View>
      )}
      
      {<TextInput
        style={{ height: 40,borderWidth: 1,borderColor: '#3c3c47',flexDirection: 'row',borderRadius: 25,position: 'absolute',marginTop: 205, zIndex: 1, width:screenWidth-40,marginLeft:20}}
        underlineColorAndroid="transparent"
        placeholder="                                 Search"
        value={inputText}
        placeholderTextColor="#3C3C47"
        autoCapitalize="none"
        onChangeText={text => handleSearch(text)}
      />}
      <View style={{flexDirection: 'row',alignContent: 'center'}}>

        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={{
            backgroundColor: 'white',
            borderTopWidth:20,
            borderTopColor:'white',
            height: screenHeight - 150,
            borderTopLeftRadius:15,
            borderTopRightRadius:15,
            marginTop:-30 
           }}>


          
          {record.map(item => (
            <TouchableOpacity
              key={item.recordID}
              onPress={() => handleAlert(item.recordID, item.displayName, item.phoneNumbers)}
              style={{ flexDirection: 'row',alignContent: 'center',backgroundColor: 'white',height: 47,paddingLeft: 10,paddingTop: 3,marginBottom: 2,width: screenWidth ,borderBottomColor:'gray',borderBottomWidth:2}}>
              {item.hasThumbnail ? (
                <Image source={{ uri: item.thumbnailPath }} style={{ width: 40, height: 40, borderRadius: 20 }} />
              ) : <Image source={clg} style={{ width: 40, height: 40, borderRadius: 20 }} />}
              <View style={{ marginLeft: 10 }}>
                <Text style={{ fontSize:17 }}>{item.displayName}</Text>
                {item.phoneNumbers && item.phoneNumbers.length > 0 && (
                  <Text >{item.phoneNumbers[0].number}</Text>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
    </SafeAreaView>
  );
}


export default App;
