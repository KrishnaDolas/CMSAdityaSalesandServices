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
  const [showDatePicker, setShowDatePicker] = useState(false); // State to control DateTimePicker visibility

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

    // Format date to YYYY-MM-DD
    const formattedDate = date!.toISOString().split('T')[0]; // Extracts YYYY-MM-DD from ISO string

    const formData = new FormData();
    formData.append('name', name);
    formData.append('contactno', contactNo); // No validation here
    formData.append('address', address);
    formData.append('problem', problem);
    formData.append('date', formattedDate); // Use formatted date

    if (fileUri) {
      formData.append('photo', {
        uri: fileUri,
        type: 'image/jpeg', // Adjust type as needed
        name: 'complaint_image.jpg', // Adjust name as needed
      });
    }

    // Axios instance with interceptors for logging and retry mechanism
    const axiosInstance = axios.create({
      baseURL: 'https://ncpapi.beatsacademy.in/',
      timeout: 10000, // Adjust timeout as needed
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    axiosInstance.interceptors.request.use((config) => {
      console.log('Request config:', config);
      return config;
    });

    axiosInstance.interceptors.response.use((response) => {
      console.log('Response:', response);
      return response;
    }, (error) => {
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
    });

    axiosInstance.interceptors.response.use(undefined, function axiosRetryInterceptor(err) {
      const config = err.config;
      // If the error is due to network issue, retry the request
      if (err.message === 'Network Error' && !err.response) {
        // Retry logic, e.g., up to 3 times
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
      const response = await axiosInstance.post('createPeopleIssue/', formData);
      console.log('Form data sent successfully:', response.data);
      Alert.alert('Success', 'Your complaint has been submitted successfully.');
      // Reset form fields and state
      setName('');
      setContactNo('');
      setAddress('');
      setProblem('');
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
        <Text style={[styles.step, styles.blackText]}>Step 2: Our Progress</Text>
        <Text style={[styles.step, styles.blackText]}>Step 3: Receive Completion Updates on WhatsApp</Text>
      </View>

      <Text style={[styles.formTitle, styles.blackText]}>Complaint Form</Text>

      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Eg. Krishna Dolas"
        placeholderTextColor="#a9a9a9"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Contact Number</Text>
      <TextInput
        style={styles.input}
        placeholder="Eg. 9876543210"
        placeholderTextColor="#a9a9a9"
        value={contactNo}
        onChangeText={setContactNo}
        keyboardType="phone-pad"
      />

      <Text style={styles.label}>Address</Text>
      <TextInput
        style={styles.input}
        placeholder="Eg. ... Nagar, Uruli, Pune 412202"
        placeholderTextColor="#a9a9a9"
        value={address}
        onChangeText={setAddress}
      />

      <TouchableOpacity style={styles.locationButton} onPress={handleGetLocation}>
        <Text style={styles.buttonText}>Get Location</Text>
      </TouchableOpacity>

      {latitude && longitude && (
        <TouchableOpacity style={styles.mapsButton} onPress={handleOpenMaps}>
          <Text style={styles.buttonText}>Open in Google Maps</Text>
        </TouchableOpacity>
      )}

      <Text style={styles.label}>Complaint</Text>
      <TextInput
        style={styles.input}
        placeholder="Describe the problem you're facing"
        placeholderTextColor="#a9a9a9"
        value={problem}
        onChangeText={setProblem}
        multiline={true}
        numberOfLines={4}
      />

      <Text style={styles.label}>Date of Problem</Text>
      <TouchableOpacity style={styles.datePickerButton} onPress={() => setShowDatePicker(true)}>
        <Text style={styles.buttonText}>Select Date</Text>
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
      {date && <Text style={styles.selectedDateText}>Selected Date: {date.toLocaleDateString()}</Text>}

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleChooseFile}>
          <Text style={styles.buttonText}>Upload Image</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleCaptureImage}>
          <Text style={styles.buttonText}>Capture Image</Text>
        </TouchableOpacity>
      </View>
      {fileUri && <Image source={{ uri: fileUri }} style={styles.previewImage} />}

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit Complaint</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
  },
  logo: {
    width: 80,
    height: 80,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 8,
  },
  paragraph: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  steps: {
    marginBottom: 16,
  },
  stepsText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  step: {
    fontSize: 16,
    marginBottom: 4,
  },
  formTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginBottom: 16,
    fontSize: 16,
  },
  locationButton: {
    backgroundColor: '#4caf50',
    paddingVertical: 12,
    borderRadius: 4,
    marginBottom: 16,
  },
  mapsButton: {
    backgroundColor: '#2196f3',
    paddingVertical: 12,
    borderRadius: 4,
    marginBottom: 16,
  },
  datePickerButton: {
    backgroundColor: '#ff9800',
    paddingVertical: 12,
    borderRadius: 4,
    marginBottom: 16,
  },
  selectedDateText: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  button: {
    flex: 1,
    backgroundColor: '#2196f3',
    paddingVertical: 12,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  previewImage: {
    width: '100%',
    height: 200,
    marginBottom: 16,
  },
  submitButton: {
    backgroundColor: '#4caf50',
    paddingVertical: 12,
    borderRadius: 4,
  },
  blackText: {
    color: '#000',
  },
});

export default ComplaintForm;
