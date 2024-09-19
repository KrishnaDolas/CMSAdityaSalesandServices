// ComplaintStackNavigator.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ComplaintList from '../Front-Office/ComplaintList'; // Ensure path is correct
import EditComplaint from '../Front-Office/Editcomplaint'; // Ensure path is correct

const ComplaintStack = createStackNavigator();

const ComplaintStackNavigator: React.FC = () => {
  return (
    <ComplaintStack.Navigator>
      <ComplaintStack.Screen 
        name="ComplaintList" 
        component={ComplaintList} 
        options={{ title: 'Complaint List' }} // Optional: Customize title
      />
      <ComplaintStack.Screen 
        name="EditComplaint" 
        component={EditComplaint} 
        options={{ title: 'Edit Complaint' }} // Optional: Customize title
      />
    </ComplaintStack.Navigator>
  );
};

export default ComplaintStackNavigator;
