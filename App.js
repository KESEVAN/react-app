import * as React from "react";
// import * as mongoose from "mongoose";
// import mongoose from "mongoose";
// import { connect } from 'mongoose';
// const mongoose = require('mongoose')
const mongoose = require('mongoose');
const express = require('express')
const app = express()
import {
  ActivityIndicator,
  Button,
  Image,
  Share,
  StatusBar,
  Text,
  View,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import * as ImagePicker from "expo-image-picker";

const mongouri = "mongodb+srv://msritop123:msritop123@rit-dataset.ypq0r.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"

mongoose.connect(mongouri,
  { useNewUrlParser: true, useUnifiedTopology: true }, err => {
      console.log('connected to MongoDB')
  });
export default class App extends React.Component {
  state = {
    image: null,
    uploading: false,
  };

  render() {
    return (
      
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        
        <View style={{ 
            
            alignSelf: 'flex-start',
            marginTop: -400,
            position: 'absolute'
         }}>
        <Image source={require('./check.jpg')}
       style={{width: 300, height: 150,resizeMode: 'stretch'}} />
        </View>
       
        <Text
          style={{
            fontSize: 30,
            marginBottom: 30,
            textAlign: "center",
            marginHorizontal: 15,
          }}
        >
          Kannada Dataset Collection 
        </Text>
       
        {this._maybeRenderControls()}
        {this._maybeRenderUploadingIndicator()}
        {this._maybeRenderImage()}

        <StatusBar barStyle="default" />
      </View>
    );
  }

  _maybeRenderUploadingIndicator = () => {
    if (this.state.uploading) {
      return <ActivityIndicator animating size="large" />;
    }
  };

  _maybeRenderControls = () => {
    if (!this.state.uploading) {
      return (
        <View>
          <View style={{ marginVertical: 8 }}>
            <Button
              onPress={this._pickImage}
              title="Pick from Gallery"
            />
          </View>
          <View style={{ marginVertical: 8 }}>
            <Button onPress={this._takePhoto} title="Take a photo" />
          </View>
        </View>
      );
    }
  };

  _maybeRenderImage = () => {
    if (this.state.image) {
      return (
        <View
          style={{
            marginTop: 30,
            width: 250,
            borderRadius: 3,
            elevation: 2,
            shadowColor: "rgba(0,0,0,1)",
            shadowOpacity: 0.2,
            shadowOffset: { width: 4, height: 4 },
            shadowRadius: 5,
          }}
        >
          <View
            style={{
              borderTopRightRadius: 3,
              borderTopLeftRadius: 3,
              overflow: "hidden",
            }}
          >
            
            
            <Image
              source={{ uri: this.state.image }}
              style={{ width: 250, height: 250 }}
            />
          </View>

          <Text
            onPress={this._copyToClipboard}
            onLongPress={this._share}
            style={{ paddingVertical: 10, paddingHorizontal: 10 }}
          >
            {this.state.image}
          </Text>
        </View>
      );
    }
  };

  _share = () => {
    Share.share({
      message: this.state.image,
      title: "Check out this photo",
      url: this.state.image,
    });
  };

  _copyToClipboard = () => {
    Clipboard.setString(this.state.image);
    alert("Copied image URL to clipboard");
  };

  _askPermission = async (failureMessage) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status === "denied") {
      alert(failureMessage);
    }
  };
  _askCameraPermission = async (failureMessage) => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status === "denied") {
      alert(failureMessage);
    }
  };

  _takePhoto = async () => {
    await this._askCameraPermission(
      "We need the camera permission to take a picture..."
    );
    let pickerResult = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    this._handleImagePicked(pickerResult);
  };

  _pickImage = async () => {
    await this._askPermission(
      "We need the camera-roll permission to read pictures from your phone..."
    );

    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    this._handleImagePicked(pickerResult);
  };

  _handleImagePicked = async (pickerResult) => {
    let uploadResponse, uploadResult;

    try {
      this.setState({ uploading: true });

      if (!pickerResult.cancelled) {
        uploadResponse = await uploadImageAsync(pickerResult.uri);
        uploadResult = await uploadResponse.json();
        console.log({ uploadResult });
        this.setState({ image: uploadResult.location });
      }
    } catch (e) {
      console.log({ uploadResponse });
      console.log({ uploadResult });
      console.log({ e });
      alert("Upload failed, sorry :(");
    } finally {
      this.setState({ uploading: false });
    }
  };
}


async function uploadImageAsync(uri) {
  
  // const connectdatabase = require('./database')
  // connectdatabase();
  console.log(uri)
  var imgModel = require('./models');
  imgModel.create(uri)


  // Note:
  // Uncomment this if you want to experiment with local server
  //
  // if (Constants.isDevice) {
  //   apiUrl = `https://your-ngrok-subdomain.ngrok.io/upload`;
  // } else {
  //   apiUrl = `http://localhost:3000/upload`
  // }
  
}
