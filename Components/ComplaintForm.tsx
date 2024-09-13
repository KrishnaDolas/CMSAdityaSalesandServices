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
import { Dropdown } from 'react-native-element-dropdown';
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
  const [complaintOptions] = useState([
    { label: 'Water', value: 'water' },
    { label: 'Light', value: 'light' },
    { label: 'Road', value: 'road' },
    { label: 'Pollution', value: 'pollution' },
    { label: 'Security', value: 'security' },
  ]); // Dropdown options

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

    try {
      const response = await axiosInstance.post('addcomplaint/', formData);
      console.log('Form data sent successfully:', response.data);
      Alert.alert('Success', 'Your complaint has been submitted successfully.');

      // Reset form state
      setName('');
      setContactNo('');
      setAddress('');
      setProblem('');
      setComplaintFor('water');
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
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsa neque ducimus dolorum soluta modi deserunt earum debitis iure fuga eaque amet distinctio rem reiciendis, quas in ratione laborum provident iusto.
      </Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Name:</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter your name"
          placeholderTextColor="#000"
        />

        <Text style={styles.label}>Contact No:</Text>
        <TextInput
          style={styles.input}
          value={contactNo}
          onChangeText={setContactNo}
          placeholder="Enter your contact number"
          keyboardType="phone-pad"
          placeholderTextColor="#000"
        />

        <Text style={styles.label}>Address:</Text>
        <TextInput
          style={styles.input}
          value={address}
          onChangeText={setAddress}
          placeholder="Enter your address"
          placeholderTextColor="#000"
        />

        <Text style={styles.label}>Complaint For:</Text>
        <Dropdown
  style={styles.dropdown}
  data={complaintOptions}
  labelField="label"
  valueField="value"
  placeholder="Select Complaint For"
  placeholderStyle={styles.dropdownPlaceholder}  // Add placeholder text style
  selectedTextStyle={styles.dropdownSelectedText}  // Style for selected item
  value={complaintFor}
  onChange={(item) => setComplaintFor(item.value)}
  itemTextStyle={styles.dropdownItemText}  // Style for dropdown items
/>



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
            <Text style={styles.buttonText}>Choose File</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleCaptureImage} style={styles.button}>
            <Text style={styles.buttonText}>Capture Image</Text>
          </TouchableOpacity>
        </View>

        {fileUri && (
          <Image
            source={{ uri: fileUri }}
            style={styles.imagePreview}
          />
        )}

        <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
          <Text style={styles.submitButtonText}>Submit Complaint</Text>
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
    color:'#000'
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 4,
    marginBottom: 16,
    color: '#000',
  },
  dropdownPlaceholder: {
    color: '#000',  // Black color for placeholder
  },
  dropdownSelectedText: {
    color: '#000',  // Black color for selected text
  },
  dropdownItemText: {
    color: '#000',  // Black color for dropdown items
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
    color:'#000'
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
    color:'#000'
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color:'#000'
  },
  paragraph: {
    marginBottom: 15,
    lineHeight: 20,
    textAlign: 'center',
    color: '#333',
  },
  steps: {
    marginBottom: 15,
    color:'#000'
  },
  stepsText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color:'#000'
  },
  blackText: {
    color: '#333',
  },
  step: {
    fontSize: 14,
    marginBottom: 5,
    color:'#000'
  },
  inputContainer: {
    marginBottom: 15,
    color:'#000'
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color:'#000'
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
    color:'#000'
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
    color:'#000'
  },
  button: {
    flex: 1,
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 5,
    color:'#000'
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
    color:'#000'
  },
  submitButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    color:'#000'
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
    color:'#000'
  },
  dateButtonText: {
    fontSize: 16,
    color:'#000'
  },
  locationText: {
    marginTop: 5,
    fontSize: 14,
    color: '#333',
  },
});

export default ComplaintForm;
