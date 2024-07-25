// ComplaintList.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../Navigation/types'; // adjust the path as necessary
import { runOnJS } from 'react-native-reanimated';

interface Complaint {
  id: string;
  name: string;
  address: string;
  problem: string;
  contactno: string;
  date: string;
  photo: string;
}

const fetchComplaints = async (): Promise<Complaint[]> => {
  try {
    console.warn('Starting API call');
    const response = await fetch('https://ncpapi.beatsacademy.in/allPeople/');
    console.warn('API response status:', response.status);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.warn('API response data:', data);

    if (data.status !== 'success') {
      throw new Error('API response status is not success');
    }

    const complaints = data.all_products.map((item: any) => ({
      id: item.id.toString(),
      name: item.name,
      address: item.address,
      problem: item.problem,
      contactno: item.contactno,
      date: item.date,
      photo: item.photo,
    }));
    console.warn('Parsed Complaints:', complaints);
    return complaints;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error fetching complaints:', error.message);
    } else {
      console.error('Unknown error fetching complaints:', error);
    }
    return [];
  }
};

const ComplaintList: React.FC = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(false);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    const loadComplaints = async () => {
      setLoading(true);
      console.warn('Loading complaints');
      try {
        const fetchedComplaints = await fetchComplaints();
        console.warn('Fetched Complaints:', fetchedComplaints);
        runOnJS(setComplaints)(fetchedComplaints);
        runOnJS(setApiError)(false);
      } catch (error) {
        console.error('Error during complaints loading:', error);
        runOnJS(setApiError)(true);
      } finally {
        runOnJS(setLoading)(false);
      }
    };
    loadComplaints();
  }, []);

  const filteredComplaints = complaints.filter(complaint =>
    complaint.problem.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderItem = ({ item }: { item: Complaint }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.id}</Text>
      <Text style={styles.cell}>{item.name}</Text>
      <Text style={styles.cell}>{item.address}</Text>
      <Text style={styles.cell}>{item.problem}</Text>
      <Text style={styles.cell}>{item.date}</Text>
      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => navigation.navigate('EditComplaint', { id: item.id })}
      >
        <Image source={require('../assets/editicon.png')} style={styles.icon} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Complaints</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Search complaints"
        value={searchTerm}
        onChangeText={setSearchTerm}
      />
      <View style={styles.headerRow}>
        <Text style={styles.headerCell}>ID</Text>
        <Text style={styles.headerCell}>Name</Text>
        <Text style={styles.headerCell}>Address</Text>
        <Text style={styles.headerCell}>Problem</Text>
        <Text style={styles.headerCell}>Date</Text>
        <Text style={styles.headerCell}>Action</Text>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : apiError ? (
        <Text style={styles.errorText}>Failed to load complaints. Please try again later.</Text>
      ) : (
        <FlatList
          data={filteredComplaints}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.table}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  table: {
    flexGrow: 1,
  },
  headerRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
  },
  headerCell: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 10,
    alignItems: 'center',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
  },
  actionButton: {
    padding: 10,
  },
  icon: {
    width: 20,
    height: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
});

export default ComplaintList;
