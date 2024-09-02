import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Alert,
  Linking,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import axios from 'axios';
import {
  launchImageLibrary,
  launchCamera,
  ImagePickerResponse,
} from 'react-native-image-picker';
import DateTimePicker, { Event as DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

const ComplaintForm = () => {
  const [fileUri, setFileUri] = useState<string | undefined>(undefined);
  const [latitude, setLatitude] = useState<number | undefined>(undefined);
  const [longitude, setLongitude] = useState<number | undefined>(undefined);
  const [name, setName] = useState<string>('');
  const [contactNo, setContactNo] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [problem, setProblem] = useState<string>('');
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [complaintFor, setComplaintFor] = useState<string>('water'); // Default value

  const requestLocationPermission = async () => {
    try {
      const result = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
      if (result === RESULTS.GRANTED) {
        return true;
      } else {
        Alert.alert('Permission Denied', 'Location permission is required to fetch your current location.');
        return false;
      }
    } catch (error) {
      console.error('Error requesting location permission:', error);
      return false;
    }
  };

  const handleChooseFile = () => {
    launchImageLibrary({ mediaType: 'mixed' }, (response: ImagePickerResponse) => {
      if (response.assets && response.assets.length > 0) {
        setFileUri(response.assets[0].uri);
      }
    });
  };

  const handleCaptureImage = () => {
    launchCamera({ mediaType: 'photo' }, (response: ImagePickerResponse) => {
      if (response.assets && response.assets.length > 0) {
        setFileUri(response.assets[0].uri);
      }
    });
  };

  const handleGetLocation = async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) return;

    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLatitude(latitude);
        setLongitude(longitude);
        Alert.alert('Location', `Latitude: ${latitude}, Longitude: ${longitude}`);
      },
      (error) => {
        console.error('Error fetching location:', error);
        Alert.alert('Error', 'Failed to fetch location.');
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  const handleOpenMaps = () => {
    if (latitude && longitude) {
      const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
      Linking.openURL(url).catch((err) => Alert.alert('Error', 'Failed to open Google Maps'));
    } else {
      Alert.alert('Location Error', 'No location data available');
    }
  };

  const handleSubmit = async () => {
    if (!name || !address || !problem || !date) {
      Alert.alert('Validation Error', 'Please fill all the fields.');
      return;
    }

    const formattedDate = date!.toISOString().split('T')[0];

    const formData = new FormData();
    formData.append('c_name', name);
    formData.append('c_contactno', contactNo);
    formData.append('c_area', address);
    formData.append('complaint', problem);
    formData.append('complaint_for', complaintFor);
    formData.append('c_time', formattedDate);

    if (fileUri) {
      formData.append('c_image', {
        uri: fileUri,
        type: 'image/jpeg',
        name: 'complaint_image.jpg',
      });
    }

    const axiosInstance = axios.create({
      baseURL: 'https://baramatiapi.beatsacademy.in/',
      timeout: 10000,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    axiosInstance.interceptors.request.use((config) => {
      console.log('Request config:', config);
      return config;
    });

    axiosInstance.interceptors.response.use(
      (response) => {
        console.log('Response:', response);
        return response;
      },
      (error) => {
        console.error('Response Error:', error);
        if (error.response) {
          console.error('Response Data:', error.response.data);
          console.error('Response Status:', error.response.status);
          console.error('Response Headers:', error.response.headers);
        } else if (error.request) {
          console.error('Request Error:', error.request);
        } else {
          console.error('Error Message:', error.message);
        }
        return Promise.reject(error);
      }
    );

    axiosInstance.interceptors.response.use(undefined, function axiosRetryInterceptor(err) {
      const config = err.config;
      if (err.message === 'Network Error' && !err.response) {
        if (!config.retryCount || config.retryCount >= 3) {
          config.retryCount = 0;
          throw err;
        }
        config.retryCount += 1;
        return new Promise((resolve) => setTimeout(() => resolve(axiosInstance(config)), 1000));
      }
      throw err;
    });

    try {
      const response = await axiosInstance.post('addcomplaint/', formData);  // Ensure the endpoint is correct
      console.log('Form data sent successfully:', response.data);
      Alert.alert('Success', 'Your complaint has been submitted successfully.');

      // Reset form state
      setName('');
      setContactNo('');
      setAddress('');
      setProblem('');
      setComplaintFor('water');  // Reset to default value
      setDate(undefined);
      setFileUri(undefined);
      setLatitude(undefined);
      setLongitude(undefined);
    } catch (error: any) {
      console.error('Error submitting form:', error);
      Alert.alert('Error', `An error occurred while submitting your complaint: ${error.message}`);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Image source={require('../assets/ncp.png')} style={styles.logo} />
        <Text style={styles.headerText}>NCP Complaint Management System</Text>
      </View>

      <Text style={styles.paragraph}>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsa neque ducimus dolorum soluta modi deserunt earum debitis iure fuga eaque amet distinctio rem reiciendis, quas in ratione laborum provident iusto nostrum id optio? Molestias nulla assumenda ad dignissimos illo magni laborum. Exercitationem eum nemo in, quia odio inventore ab sit quos consectetur ipsa rem, debitis velit eveniet est optio fugiat. Ut ipsum voluptates quos!
      </Text>

      <View style={styles.steps}>
        <Text style={[styles.stepsText, styles.blackText]}>Submit, Track, and Receive Updates: Our 3-Step Process</Text>
        <Text style={[styles.step, styles.blackText]}>Step 1: Submit Your Complaint</Text>
        <Text style={[styles.step, styles.blackText]}>Step 2: Track the Status of Your Complaint</Text>
        <Text style={[styles.step, styles.blackText]}>Step 3: Receive Updates and Resolutions</Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Name:</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter your name"
        />

        <Text style={styles.label}>Contact No:</Text>
        <TextInput
          style={styles.input}
          value={contactNo}
          onChangeText={setContactNo}
          placeholder="Enter your contact number"
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Address:</Text>
        <TextInput
          style={styles.input}
          value={address}
          onChangeText={setAddress}
          placeholder="Enter your address"
        />

        <Text style={styles.label}>Complaint For:</Text>
        <Picker
          selectedValue={complaintFor}
          style={styles.picker}
          onValueChange={(itemValue: string) => setComplaintFor(itemValue)}
        >
          <Picker.Item label="Water" value="Water" />
          <Picker.Item label="Light" value="Light" />
          <Picker.Item label="Road" value="Road" />
          <Picker.Item label="Pollution" value="Pollution" />
          <Picker.Item label="Security" value="Security" />
        </Picker>

        <Text style={styles.label}>Problem:</Text>
        <TextInput
          style={styles.input}
          value={problem}
          onChangeText={setProblem}
          placeholder="Describe the problem"
          multiline
        />

        <Text style={styles.label}>Date:</Text>
        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateButton}>
          <Text style={styles.dateButtonText}>{date ? date.toDateString() : 'Select Date'}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={date || new Date()}
            mode="date"
            display="default"
            onChange={(event: DateTimePickerEvent, selectedDate?: Date) => {
              setShowDatePicker(false);
              if (selectedDate) setDate(selectedDate);
            }}
          />
        )}

        <Text style={styles.label}>Location:</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={handleGetLocation} style={styles.button}>
            <Text style={styles.buttonText}>Get Location</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleOpenMaps} style={styles.button}>
            <Text style={styles.buttonText}>Open in Maps</Text>
          </TouchableOpacity>
        </View>

        {latitude && longitude && (
          <Text style={styles.locationText}>
            Latitude: {latitude}, Longitude: {longitude}
          </Text>
        )}

        <Text style={styles.label}>Upload Image:</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={handleChooseFile} style={styles.button}>
            <Text style={styles.buttonText}>Choose Image</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleCaptureImage} style={styles.button}>
            <Text style={styles.buttonText}>Capture Image</Text>
          </TouchableOpacity>
        </View>

        {fileUri && (
          <Image source={{ uri: fileUri }} style={styles.imagePreview} />
        )}

        <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  paragraph: {
    marginBottom: 15,
    lineHeight: 20,
    textAlign: 'center',
    color: '#333',
  },
  steps: {
    marginBottom: 15,
  },
  stepsText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  blackText: {
    color: '#333',
  },
  step: {
    fontSize: 14,
    marginBottom: 5,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
  },
  picker: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    color: '#000',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  button: {
    flex: 1,
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 5,
    marginBottom: 15,
    resizeMode: 'contain',
  },
  submitButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  dateButton: {
    height: 40,
    justifyContent: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: '#f9f9f9',
    marginBottom: 15,
  },
  dateButtonText: {
    fontSize: 16,
  },
  locationText: {
    marginTop: 5,
    fontSize: 14,
    color: '#333',
  },
});

export default ComplaintForm;
