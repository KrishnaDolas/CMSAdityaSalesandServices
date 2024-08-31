// types.ts
export type UserRole = 'guest' | 'front-office' | 'back-office' | 'admin';

export type RootStackParamList = {
  ComplaintList: undefined;
  EditComplaint: { id: string };
  ComplaintForm: undefined;
  LoginScreen: undefined;
  // Add any other screens as needed
};
