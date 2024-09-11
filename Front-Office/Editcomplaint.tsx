import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, TextInput, Button, Alert, Image } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';

interface ComplaintDetails {
  c_name: string;
  c_contactno: string;
  c_area: string;
  complaint_for: string;
  complaint: string;
  c_description: string;
  c_time: string;
  c_image: string;
  c_status: string;
}

const fetchComplaintDetails = async (id: string): Promise<ComplaintDetails | null> => {
  try {
    const response = await fetch(`https://baramatiapi.beatsacademy.in/complaintdetails/${id}/`, {
      method: 'GET',
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('API response data:', data);

    if (data.status !== 'success') {
      throw new Error('API response status is not success');
    }

    const complaintDetails = data.complaint_details || {};
    return {
      c_name: complaintDetails.c_name || '',
      c_contactno: complaintDetails.c_contactno || '',
      c_area: complaintDetails.c_area || '',
      complaint_for: complaintDetails.complaint_for || '',
      complaint: complaintDetails.complaint || '',
      c_description: complaintDetails.c_description || '',
      c_time: complaintDetails.c_time || '',
      c_image: complaintDetails.c_image || '',
      c_status: complaintDetails.c_status || 'inprocess',
    };
  } catch (error) {
    console.error('Error fetching complaint details:', error);
    return null;
  }
};

const updateComplaint = async (id: string, updatedComplaint: ComplaintDetails): Promise<boolean> => {
  try {
    const formData = new FormData();
    formData.append('c_name', updatedComplaint.c_name);
    formData.append('c_contactno', updatedComplaint.c_contactno);
    formData.append('c_area', updatedComplaint.c_area);
    formData.append('complaint_for', updatedComplaint.complaint_for);
    formData.append('complaint', updatedComplaint.complaint);
    formData.append('c_description', updatedComplaint.c_description);
    formData.append('c_time', updatedComplaint.c_time);
    formData.append('c_status', updatedComplaint.c_status);

    if (updatedComplaint.c_image) {
      formData.append('c_image', {
        uri: updatedComplaint.c_image, // Assuming c_image is a local file URI
        type: 'image/jpeg', // Change based on the file type
        name: 'image.jpg', // Change based on the file name
      });
    }

    const response = await fetch(`https://baramatiapi.beatsacademy.in/updatecomplaint/${id}/`, {
      method: 'PUT', // Changed to PUT method
      body: formData,
    });

    const data = await response.json();
    if (data.status === 'success') {
      Alert.alert('Success', 'Complaint updated successfully');
      return true;
    } else {
      throw new Error(data.message || 'Failed to update complaint');
    }
  } catch (error) {
    console.error('Error updating complaint:', error);
    Alert.alert('Error', 'Failed to update complaint');
    return false;
  }
};

const EditComplaint: React.FC = () => {
  const route = useRoute();
  const { id } = route.params as { id: string };

  const [complaint, setComplaint] = useState<ComplaintDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string>('inprocess');

  useEffect(() => {
    const loadComplaintDetails = async () => {
      setLoading(true);
      const fetchedComplaint = await fetchComplaintDetails(id);
      if (fetchedComplaint) {
        setComplaint(fetchedComplaint);
        setStatus(fetchedComplaint.c_status);
      }
      setLoading(false);
    };
    loadComplaintDetails();
  }, [id]);

  const handleUpdate = async () => {
    if (complaint) {
      const updatedComplaint = { ...complaint, c_status: status };
      const success = await updateComplaint(id, updatedComplaint);
      if (success) {
        Alert.alert('Success', 'Complaint updated successfully');
      }
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (!complaint) {
    return <Text style={styles.errorText}>Failed to load complaint details.</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Edit Complaint</Text>

      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        value={complaint.c_name}
        editable={false}
      />

      <Text style={styles.label}>Contact Number</Text>
      <TextInput
        style={styles.input}
        value={complaint.c_contactno}
        editable={false}
      />

      <Text style={styles.label}>Address</Text>
      <TextInput
        style={styles.input}
        value={complaint.c_area}
        editable={false}
      />

      <Text style={styles.label}>Complaint For</Text>
      <TextInput
        style={styles.input}
        value={complaint.complaint_for}
        editable={false}
      />

      <Text style={styles.label}>Problem</Text>
      <TextInput
        style={styles.input}
        value={complaint.complaint}
        editable={false}
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={styles.input}
        value={complaint.c_description}
        editable={true}  // Make the description editable
        onChangeText={(text) => setComplaint({ ...complaint, c_description: text })} // Update state on text change
      />

      <Text style={styles.label}>Date</Text>
      <TextInput
        style={styles.input}
        value={complaint.c_time}
        editable={false}
      />

      <Text style={styles.label}>Image</Text>
      {complaint.c_image ? (
        <Image
          source={{ uri: complaint.c_image }}
          style={styles.image}
          resizeMode="cover"
        />
      ) : (
        <Text>No image available</Text>
      )}

      <Text style={styles.label}>Status</Text>
      <Picker
        selectedValue={status}
        style={styles.picker}
        onValueChange={(itemValue) => setStatus(itemValue)}
      >
        <Picker.Item label="Work Complete" value="WorkComplete" />
        <Picker.Item label="Work In Progress" value="WorkInProgress" />
        <Picker.Item label="Work Incomplete" value="WorkIncomplete" />
      </Picker>

      <Button title="Update Complaint" onPress={handleUpdate} />
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
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#000',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
    color: '#000',
  },
  picker: {
    height: 50,
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
    color:'#000'
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
});

export default EditComplaint;
