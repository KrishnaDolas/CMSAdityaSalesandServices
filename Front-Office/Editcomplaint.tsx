import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Button, ActivityIndicator, ScrollView, TouchableOpacity, Image } from 'react-native';
import DateTimePicker, { Event as DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useRoute } from '@react-navigation/native';

interface Complaint {
  id: string;
  address: string;
  problem: string;
  date: string;
  photo: string;
  processDate: string;
  status: string;
}

const fetchComplaintDetails = async (id: string): Promise<Complaint | null> => {
  try {
    const response = await fetch(`https://ncpapi.beatsacademy.in/Details/${id}/`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('API response data:', data);

    if (data.status !== 'success') {
      throw new Error('API response status is not success');
    }

    const productDetails = data.product_details;
    const complaint: Complaint = {
      id: productDetails.id?.toString() || '',
      address: productDetails.address || '',
      problem: productDetails.problem || '',
      date: productDetails.date || '',
      photo: productDetails.photo || '',
      processDate: new Date().toISOString(), // Default to current date
      status: '', // Default to empty string to let user choose
    };
    return complaint;
  } catch (error) {
    console.error('Error fetching complaint details:', error);
    return null;
  }
};

const EditComplaint: React.FC = () => {
  const route = useRoute();
  const { id } = route.params as { id: string };

  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [loading, setLoading] = useState(true);
  const [processDate, setProcessDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [status, setStatus] = useState<string>('');

  useEffect(() => {
    const loadComplaintDetails = async () => {
      setLoading(true);
      const fetchedComplaint = await fetchComplaintDetails(id);
      if (fetchedComplaint) {
        console.log('Fetched complaint details:', fetchedComplaint);
        setComplaint(fetchedComplaint);
        setProcessDate(new Date(fetchedComplaint.processDate));
        setStatus(fetchedComplaint.status);
      }
      setLoading(false);
    };
    loadComplaintDetails();
  }, [id]);

  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || processDate;
    setShowDatePicker(false);
    setProcessDate(currentDate);
  };

  const handleSave = () => {
    // Implement save functionality to update the processDate and status
    console.log('Updated processDate:', processDate.toISOString().split('T')[0]);
    console.log('Updated status:', status);
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

      <Text style={styles.label}>Address</Text>
      <Text style={styles.input}>{complaint.address}</Text>

      <Text style={styles.label}>Problem</Text>
      <Text style={styles.input}>{complaint.problem}</Text>

      <Text style={styles.label}>Date</Text>
      <Text style={styles.input}>{complaint.date}</Text>

      <Text style={styles.label}>Photo</Text>
      <Image source={{ uri: complaint.photo }} style={styles.image} />

      <Text style={styles.label}>Process Date</Text>
      <TouchableOpacity
        style={styles.input}
        onPress={() => setShowDatePicker(true)}
      >
        <Text>{processDate.toISOString().split('T')[0]}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={processDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}

      <Text style={styles.label}>Status</Text>
      <View style={styles.statusContainer}>
        <TouchableOpacity
          style={[styles.statusButton, status === 'inprocess' && styles.inprocess]}
          onPress={() => setStatus('inprocess')}
        >
          <Text style={[styles.statusText, status === 'inprocess' && styles.inprocessText]}>In Process</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.statusButton, status === 'done' && styles.done]}
          onPress={() => setStatus('done')}
        >
          <Text style={[styles.statusText, status === 'done' && styles.doneText]}>Done</Text>
        </TouchableOpacity>
      </View>

      <Button title="Save" onPress={handleSave} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
    color : '#000'
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color : '#000'
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color : '#000'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    color : '#000'
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    marginBottom: 20,
    color : '#000'
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    color : '#000'
  },
  statusButton: {
    flex: 1,
    padding: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
    marginHorizontal: 5,
    color : '#000'
  },
  inprocess: {
    backgroundColor: 'violet',
  },
  done: {
    backgroundColor: 'green',
  },
  statusText: {
    fontWeight: 'bold',
    color : '#000'
  },
  inprocessText: {
    color: 'white',
  },
  doneText: {
    color: 'white',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
});

export default EditComplaint;
