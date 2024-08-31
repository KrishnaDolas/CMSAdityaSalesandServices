import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import Icon from '../assets/editicon.png'; // Import your icon
import { RootStackParamList } from '../Navigation/types'; // Import the types

interface Complaint {
  id: string;
  name: string;
  address: string;
  problem: string;
  date: string;
}

const fetchComplaints = async (): Promise<Complaint[]> => {
  try {
    const response = await fetch('https://baramatiapi.beatsacademy.in/allcomplaints/', {
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

    return data.all_complaints.map((complaint: any) => ({
      id: complaint.c_id.toString(),
      name: complaint.c_name || '',
      address: complaint.c_area || '',
      problem: complaint.complaint || '',
      date: complaint.c_time || '',
    }));
  } catch (error) {
    console.error('Error fetching complaints:', error);
    return [];
  }
};

const ComplaintList: React.FC = () => {
  const navigation = useNavigation<DrawerNavigationProp<RootStackParamList>>();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadComplaints = async () => {
      setLoading(true);
      setError(null); // Reset error state before new fetch
      try {
        const fetchedComplaints = await fetchComplaints();
        setComplaints(fetchedComplaints);
      } catch (fetchError) {
        setError('Failed to load complaints. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    loadComplaints();
  }, []);

  const handleEdit = (id: string) => {
    navigation.navigate('EditComplaint', { id });
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" style={styles.centered} />;
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  if (complaints.length === 0) {
    return <Text style={styles.errorText}>No complaints found.</Text>;
  }

  const renderItem = ({ item }: { item: Complaint }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemText}>Name: {item.name}</Text>
      <Text style={styles.itemText}>Address: {item.address}</Text>
      <Text style={styles.itemText}>Problem: {item.problem}</Text>
      <Text style={styles.itemText}>Date: {item.date}</Text>
      <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(item.id)}>
        <Image source={Icon} style={styles.icon} />
      </TouchableOpacity>
    </View>
  );

  return (
    <FlatList
      data={complaints}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    color : '#000'
  },
  itemContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    borderColor: '#ddd',
    borderWidth: 1,
    position: 'relative',
    color : '#000'
  },
  itemText: {
    fontSize: 16,
    marginBottom: 5,
    color : '#000'
  },
  editButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: '#007BFF',
    borderRadius: 50,
    padding: 10,
    color : '#000'
  },
  icon: {
    width: 20,
    height: 20,
    tintColor: '#fff',
    color : '#000'
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    color : '#000'
  },
});

export default ComplaintList;
