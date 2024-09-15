import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, TextInput, Button, Alert, Image } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Dropdown } from 'react-native-element-dropdown';

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
        uri: updatedComplaint.c_image,
        type: 'image/jpeg',
        name: 'image.jpg',
      });
    }

    const response = await fetch(`https://baramatiapi.beatsacademy.in/updatecomplaint/${id}/`, {
      method: 'PUT',
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
    return <ActivityIndicator size="large" color="#007BFF" style={styles.centered} />;
  }

  if (!complaint) {
    return <Text style={styles.errorText}>Failed to load complaint details.</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Edit Complaint</Text>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={complaint.c_name}
          editable={false}
        />
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Contact Number</Text>
        <TextInput
          style={styles.input}
          value={complaint.c_contactno}
          editable={false}
        />
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Address</Text>
        <TextInput
          style={styles.input}
          value={complaint.c_area}
          editable={false}
        />
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Complaint For</Text>
        <TextInput
          style={styles.input}
          value={complaint.complaint_for}
          editable={false}
        />
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Problem</Text>
        <TextInput
          style={styles.input}
          value={complaint.complaint}
          editable={false}
        />
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={styles.input}
          value={complaint.c_description}
          editable={true}
          onChangeText={(text) => setComplaint({ ...complaint, c_description: text })}
        />
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Date</Text>
        <TextInput
          style={styles.input}
          value={complaint.c_time}
          editable={false}
        />
      </View>

      <View style={styles.fieldContainer}>
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
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Status</Text>
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          containerStyle={styles.dropdownContainer}
          labelField="label"
          valueField="value"
          data={[
            { label: 'Work Complete', value: 'WorkComplete' },
            { label: 'Work In Progress', value: 'WorkInProgress' },
            { label: 'Work Incomplete', value: 'WorkIncomplete' },
          ]}
          value={status}
          onChange={(item) => setStatus(item.value)}
          placeholder="Select status"
          renderItem={(item) => (
            <View style={styles.dropdownItem}>
              <Text style={styles.dropdownItemText}>{item.label}</Text>
            </View>
          )}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Update Complaint" onPress={handleUpdate} color="#007BFF" />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
    color: '#000',
  },
  dropdown: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
  },
  placeholderStyle: {
    color: '#333',
  },
  selectedTextStyle: {
    color: '#333',
  },
  dropdownContainer: {
    borderRadius: 8,
  },
  dropdownItem: {
    padding: 10,
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#000', // Black color for dropdown items
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  buttonContainer: {
    marginTop: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    textAlign: 'center',
    color: 'red',
    fontSize: 18,
  },
});

export default EditComplaint;
