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
} from 'react-native';
import axios from 'axios';
import {
  launchImageLibrary,
  launchCamera,
  ImagePickerResponse,
} from 'react-native-image-picker';
import DateTimePicker, { Event as DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Dropdown } from 'react-native-element-dropdown';

const ComplaintForm = () => {
  const [fileUri, setFileUri] = useState<string | undefined>(undefined);
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
    } catch (error: any) {
      console.error('Error submitting form:', error);
      Alert.alert('Error', `An error occurred while submitting your complaint: ${error.message}`);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Image source={require('../assets/ncp.png')} style={styles.logo} />
        <Text style={styles.headerText}>Complaint Management System</Text>
      </View>

      <Text style={styles.paragraph}>
        The Complaint Management System (CMS) by the Nationalist Congress Party (NCP) simplifies addressing civic issues by enabling citizens to lodge complaints about infrastructure, services, or other concerns. It improves communication between the public and government, fostering transparency and accountability. This system ensures quicker responses and amplifies citizen feedback, leading to better governance and public services.
      </Text>

      <View style={styles.formContainer}>
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
          placeholderStyle={styles.dropdownPlaceholder}
          selectedTextStyle={styles.dropdownSelectedText}
          value={complaintFor}
          onChange={(item) => setComplaintFor(item.value)}
          itemTextStyle={styles.dropdownItemText}
        />

        <Text style={styles.label}>Problem:</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={problem}
          onChangeText={setProblem}
          placeholder="Describe the problem"
          multiline
          placeholderTextColor="#000"
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
    backgroundColor: '#f5f5f5',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    color: '#666',
    marginBottom: 20,
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 5,
  },
  input: {
    height: 45,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 15,
    backgroundColor: '#fafafa',
    color: '#000',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    backgroundColor: '#fafafa',
  },
  dropdownPlaceholder: {
    fontSize: 16,
    color: '#666',
  },
  dropdownSelectedText: {
    fontSize: 16,
    color: '#000',
  },
  dropdownItemText: {
    fontSize: 16,
  },
  dateButton: {
    height: 45,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 15,
    justifyContent: 'center',
    backgroundColor: '#fafafa',
  },
  dateButtonText: {
    fontSize: 16,
    color: '#000',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  button: {
    flex: 1,
    height: 45,
    borderRadius: 8,
    backgroundColor: '#007bff',
    justifyContent: 'center',
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
    borderRadius: 10,
    marginBottom: 15,
    resizeMode: 'cover',
  },
  submitButton: {
    height: 45,
    borderRadius: 8,
    backgroundColor: '#28a745',
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ComplaintForm;
