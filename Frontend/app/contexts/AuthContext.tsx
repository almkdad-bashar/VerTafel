// AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { now } from 'moment';
import alert from '../utils/Alert';
import { router } from 'expo-router';
import { JwtResponse, AuthContextType } from '../utils/Interfaces';
import { _URL } from '../Config';

async function saveKey(key: string, value: string) {
    try {
        if (Platform.OS === 'web') {
            await AsyncStorage.setItem(key, value);
        } else { // mobile
            await SecureStore.setItemAsync(key, value.toString());
        }
    } catch (error) {
        console.error("Error saving data:", error);
    }
}

async function deleteKey(key: string) {
    try {
        if (Platform.OS === 'web') {
            await AsyncStorage.removeItem(key);
        } else { // mobile
            await SecureStore.deleteItemAsync(key);
        }
    } catch (error) {
        console.error("Error deleting data:", error);
    }
}

async function getKey(key: string): Promise<string | null> {
    try {
        if (Platform.OS === 'web') {
            return await AsyncStorage.getItem(key);
        } else { // mobile
            return await SecureStore.getItemAsync(key);
        }
    } catch (error) {
        console.error("Error retrieving data:", error);
        return null;
    }
}



const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [token, setToken] = useState<string | null>(null);
    const [jwtResponse, setJwtResponse] = useState<JwtResponse | null>(null);

    useEffect(() => {
        const loadToken = async () => {
            const storedToken = await getKey('authToken');
            if (storedToken) {
                setToken(storedToken);
            }
        };

        loadToken();
    }, []);

    const signIn = async (username: string, password: string) => {
        try {
            const url = `${_URL}api/v1/auth/login`
            const response = await axios.post(url, {
                username,
                password,
            });
            const token = response.data.accessToken;
            const jwtResponse: JwtResponse = {
                id: response.data.id,
                username: response.data.username,
                email: response.data.email,
                roles: response.data.roles,
                accessToken: "",
                tokenType: response.data.tokenType,
            };

            await saveKey('authToken', token);
            setToken(token);
            setJwtResponse(jwtResponse);
        } catch (error) {
            console.error('Failed to sign in:', error);
            throw new Error('Login failed');
        }
    };

    const signOut = async () => {
        try {
            const url = `${_URL}api/v1/auth/exist`
            if (jwtResponse == null)
                return
            const jwt = {
                id: jwtResponse.id,
                username: jwtResponse.username,
                email: jwtResponse.email,
                roles: jwtResponse.roles,
                accessToken: token,
                tokenType: jwtResponse.tokenType,
            };
            const data = {
                "date": now(),
                "jwtResponse": jwt
            }
            const result = await axios.post(url, data, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json' // Ensure client expects JSON responses
                },
            });
            await deleteKey('authToken');
            setToken(null);
            setJwtResponse(null);
            router.replace('screens/_LoginScreen')

        } catch (error) {
            console.error('Failed to sign in:', error);
            throw new Error('Login failed');
        }
    };

    return (
        <AuthContext.Provider value={{ jwtResponse, token, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
