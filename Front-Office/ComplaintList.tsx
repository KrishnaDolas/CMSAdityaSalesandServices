import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import Icon from '../assets/Editicon.png'; // Import your icon
import { RootStackParamList } from '../Navigation/types'; // Import the types
import { Picker } from '@react-native-picker/picker'; // Correct import for Picker

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
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest'); // State for sorting order

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

  useEffect(() => {
    if (complaints.length > 0) {
      const sortedComplaints = [...complaints].sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return sortOrder === 'newest' ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime();
      });
      setComplaints(sortedComplaints);
    }
  }, [sortOrder]);

  const handleEdit = (id: string) => {
    navigation.navigate('EditComplaint', { id });
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#007BFF" style={styles.centered} />;
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  if (complaints.length === 0) {
    return <Text style={styles.noComplaintsText}>No complaints found.</Text>;
  }

  const renderItem = ({ item }: { item: Complaint }) => (
    <View style={styles.itemContainer}>
      <View style={styles.itemHeader}>
        <Text style={styles.itemTitle}>Complaint ID: {item.id}</Text>
        <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(item.id)}>
          <Image source={Icon} style={styles.icon} />
        </TouchableOpacity>
      </View>
      <Text style={styles.itemText}>Name: <Text style={styles.itemDetail}>{item.name}</Text></Text>
      <Text style={styles.itemText}>Address: <Text style={styles.itemDetail}>{item.address}</Text></Text>
      <Text style={styles.itemText}>Problem: <Text style={styles.itemDetail}>{item.problem}</Text></Text>
      <Text style={styles.itemText}>Date: <Text style={styles.itemDetail}>{item.date}</Text></Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={sortOrder}
          style={styles.picker}
          onValueChange={(itemValue) => setSortOrder(itemValue as 'newest' | 'oldest')}
          itemStyle={{ color: '#000' }} // Ensures the picker items have black text
        >
          <Picker.Item label="Sort by Newest" value="newest" />
          <Picker.Item label="Sort by Oldest" value="oldest" />
        </Picker>
      </View>
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
    backgroundColor: '#F0F4F8',
  },
  pickerContainer: {
    marginBottom: 20,
    borderRadius: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  picker: {
    height: 50,
    width: '100%',
    color: '#000', // Black color for selected item text
  },
  listContainer: {
    paddingBottom: 20,
  },
  itemContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000', // Changed to black
  },
  itemText: {
    fontSize: 16,
    color: '#000', // Changed to black
    marginBottom: 5,
  },
  itemDetail: {
    fontWeight: '600',
    color: '#000', // Changed to black
  },
  editButton: {
    borderRadius: 50,
    padding: 10,
  },
  icon: {
    width: 50,
    height: 50,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  noComplaintsText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#000', // Changed to black
    marginTop: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ComplaintList;
