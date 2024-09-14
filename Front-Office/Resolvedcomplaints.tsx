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
  resolved: boolean;
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
      resolved: complaint.resolved || false,
    }));
  } catch (error) {
    console.error('Error fetching complaints:', error);
    return [];
  }
};

const Resolvedcomplaints: React.FC = () => {
  const navigation = useNavigation<DrawerNavigationProp<RootStackParamList>>();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadComplaints = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedComplaints = await fetchComplaints();
        const resolvedComplaints = fetchedComplaints.filter(complaint => complaint.resolved); // Filter resolved complaints
        setComplaints(resolvedComplaints);
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
    return <Text style={styles.errorText}>No resolved complaints found.</Text>;
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
    <View style={styles.container}>
      <FlatList
        data={complaints}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  listContainer: {
    paddingBottom: 20,
  },
  itemContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    borderColor: '#ddd',
    borderWidth: 1,
    position: 'relative',
  },
  itemText: {
    fontSize: 16,
    marginBottom: 5,
  },
  editButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: '#007BFF',
    borderRadius: 50,
    padding: 10,
  },
  icon: {
    width: 20,
    height: 20,
    tintColor: '#fff',
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
  },
});

export default Resolvedcomplaints;
